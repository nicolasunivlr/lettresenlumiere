<?php

/**
 * Contrôleur pour l'importation globale et la réinitialisation de la base de données
 * 
 * Ce contrôleur fournit deux fonctionnalités principales :
 * 
 * 1. Importation globale des données:
 *    - Accepte un fichier ZIP exporté par GlobalExportController
 *    - Extrait le contenu du ZIP dans un répertoire temporaire
 *    - Importe le fichier SQL pour restaurer les données
 *    - Copie les fichiers médias vers les emplacements appropriés
 * 
 * 2. Réinitialisation de la base de données:
 *    - Vide toutes les tables principales de l'application
 *    - Crée un jeu minimal de données (étape/séquence/couleur par défaut)
 *    - Réinitialise les séquences AUTO_INCREMENT
 * 
 * Utilise le formulaire GlobalImportType pour gérer le téléchargement des fichiers.
 */

namespace App\Controller;

use App\Form\GlobalImportType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Filesystem\Filesystem;
use ZipArchive;

class GlobalImportController extends AbstractController
{
    private $filesystem;

    public function __construct(Filesystem $filesystem)
    {
        $this->filesystem = $filesystem;
    }

    #[Route('/admin/global-import', name: 'admin_global_import')]
    public function importGlobal(Request $request, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(GlobalImportType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $importFile */
            $importFile = $form->get('importFile')->getData();

            try {
                $this->processImportFile($importFile, $entityManager);
                $this->addFlash('success', 'Import réussi avec succès !');
            } catch (\Exception $e) {
                $this->addFlash('danger', 'Erreur lors de l\'import : ' . $e->getMessage());
            }

            return $this->redirectToRoute('admin');
        }

        return $this->render('admin/global_import.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/admin/reset-database', name: 'admin_reset_database')]
    public function resetDatabase(EntityManagerInterface $entityManager): Response
    {
        try {
            // Désactiver les contraintes de clés étrangères
            $conn = $entityManager->getConnection();
            $conn->executeStatement('SET FOREIGN_KEY_CHECKS=0');
            
            // Liste des tables à vider/réinitialiser
            $tables = [
                'contenu_exercice',
                'contenu_format',
                'contenu',
                'exercice',
                'sequence',
                'etape',
                'couleur'
            ];
            
            // Vider toutes les tables
            foreach ($tables as $table) {
                $conn->executeStatement('TRUNCATE TABLE `' . $table . '`');
            }
            
            // Créer une étape par défaut
            $conn->executeStatement("INSERT INTO `etape` (`id`, `nom`) VALUES (1, 'Étape par défaut')");
            
            // Créer une séquence par défaut reliée à l'étape
            $conn->executeStatement("INSERT INTO `sequence` (`id`, `nom`, `etape_id`) VALUES (1, 'Séquence par défaut', 1)");
            
            // Créer une couleur par défaut
            $conn->executeStatement("INSERT INTO `couleur` (`id`, `code`) VALUES (1, '#000000')");
            
            // Réactiver les contraintes de clés étrangères
            $conn->executeStatement('SET FOREIGN_KEY_CHECKS=1');
            
            // Réinitialiser les séquences AUTO_INCREMENT
            foreach ($tables as $table) {
                if ($this->tableHasColumn($conn, $table, 'id')) {
                    $maxId = $conn->fetchOne('SELECT MAX(id) FROM `' . $table . '`') ?? 0;
                    $conn->executeStatement('ALTER TABLE `' . $table . '` AUTO_INCREMENT = ' . ($maxId + 1));
                }
            }
            
            $this->addFlash('success', 'Base de données réinitialisée avec succès. Un ensemble minimal de données a été créé.');
        } catch (\Exception $e) {
            $this->addFlash('danger', 'Erreur lors de la réinitialisation de la base de données : ' . $e->getMessage());
        }
        
        return $this->redirectToRoute('admin');
    }

    private function processImportFile(UploadedFile $file, EntityManagerInterface $entityManager): void
    {
        $zipFile = $file->getPathname();
        $tempDir = sys_get_temp_dir() . '/global_import_' . uniqid();
        mkdir($tempDir);

        $zip = new ZipArchive();
        if ($zip->open($zipFile) === true) {
            $zip->extractTo($tempDir);
            $zip->close();

            // Vérifier si un fichier SQL est présent et l'importer
            $sqlFilePath = $tempDir . '/database_export.sql';
            if (file_exists($sqlFilePath)) {
                $this->importSqlFile($sqlFilePath, $entityManager);
                
                // Nous ne vérifions plus les entités essentielles ici pour éviter
                // de créer des séquences par défaut automatiquement
            } else {
                throw new \Exception('Le fichier SQL d\'export n\'a pas été trouvé dans l\'archive');
            }

            // Copier les répertoires de médias s'ils existent
            $projectDir = $this->getParameter('kernel.project_dir');
            
            $mediaDirs = ['images', 'audios', 'sequencevideos'];
            foreach ($mediaDirs as $dir) {
                $extractedDir = $tempDir . '/' . $dir;
                $targetDir = $projectDir . '/public/' . $dir;
                
                if (is_dir($extractedDir)) {
                    // S'assurer que le répertoire cible existe
                    if (!is_dir($targetDir)) {
                        mkdir($targetDir, 0777, true);
                    }
                    
                    // Copier les fichiers
                    $this->copyDirectory($extractedDir, $targetDir);
                }
            }
            
            // Nettoyer le répertoire temporaire
            $this->deleteDirectory($tempDir);
        } else {
            throw new \Exception('Impossible d\'ouvrir le fichier ZIP');
        }
    }

    private function importSqlFile(string $sqlFilePath, EntityManagerInterface $entityManager): void
    {
        $sql = file_get_contents($sqlFilePath);
        $conn = $entityManager->getConnection();
        
        // Désactiver les contraintes de clés étrangères pour l'import
        $conn->executeStatement('SET FOREIGN_KEY_CHECKS=0');
        
        // Diviser le fichier SQL en requêtes individuelles
        $queries = $this->splitSqlQueries($sql);
        
        // Exécuter chaque requête séparément
        foreach ($queries as $query) {
            if (trim($query) !== '') {
                try {
                    $stmt = $conn->prepare($query);
                    $stmt->executeStatement();
                    // La ligne stmt->free() a été supprimée car cette méthode n'existe pas
                    // Doctrine DBAL gère automatiquement la libération des ressources
                } catch (\Exception $e) {
                    // Réactiver les contraintes de clés étrangères avant de lancer l'exception
                    $conn->executeStatement('SET FOREIGN_KEY_CHECKS=1');
                    throw new \Exception('Erreur lors de l\'exécution d\'une requête SQL : ' . $e->getMessage());
                }
            }
        }
        
        // Réactiver les contraintes de clés étrangères
        $conn->executeStatement('SET FOREIGN_KEY_CHECKS=1');
    }
    
    private function splitSqlQueries(string $sql): array
    {
        // Diviser le SQL en requêtes individuelles en tenant compte des délimiteurs
        $queries = [];
        $currentQuery = '';
        $lines = explode("\n", $sql);
        
        foreach ($lines as $line) {
            // Ignorer les commentaires et les lignes vides
            $trimmedLine = trim($line);
            if (empty($trimmedLine) || strpos($trimmedLine, '--') === 0) {
                continue;
            }
            
            $currentQuery .= $line . "\n";
            
            // Si la ligne se termine par un point-virgule, c'est la fin d'une requête
            if (substr(trim($line), -1) === ';') {
                $queries[] = $currentQuery;
                $currentQuery = '';
            }
        }
        
        // Ajouter la dernière requête si elle n'est pas vide
        if (trim($currentQuery) !== '') {
            $queries[] = $currentQuery;
        }
        
        return $queries;
    }
    
    private function copyDirectory(string $sourceDir, string $targetDir): void
    {
        $dir = opendir($sourceDir);
        
        while (($file = readdir($dir)) !== false) {
            if ($file != '.' && $file != '..') {
                $sourceFile = $sourceDir . '/' . $file;
                $targetFile = $targetDir . '/' . $file;
                
                if (is_dir($sourceFile)) {
                    if (!is_dir($targetFile)) {
                        mkdir($targetFile, 0777, true);
                    }
                    
                    $this->copyDirectory($sourceFile, $targetFile);
                } else {
                    copy($sourceFile, $targetFile);
                }
            }
        }
        
        closedir($dir);
    }
    
    private function deleteDirectory(string $dir): void
    {
        if (!file_exists($dir)) {
            return;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->deleteDirectory($path) : unlink($path);
        }
        
        rmdir($dir);
    }
    
    private function tableHasColumn($connection, string $table, string $column): bool
    {
        $schemaManager = $connection->createSchemaManager();
        
        if (!$schemaManager->tablesExist([$table])) {
            return false;
        }
        
        $columns = $schemaManager->listTableColumns($table);
        
        foreach ($columns as $col) {
            if ($col->getName() === $column) {
                return true;
            }
        }
        
        return false;
    }
}

