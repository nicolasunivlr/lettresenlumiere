<?php

/**
 * Contrôleur pour l'exportation globale des données
 * 
 * Ce contrôleur permet de générer une archive ZIP contenant :
 * - Un dump SQL des données principales de l'application (Contenu, ContenuFormat, Couleur, Etape, Exercice, Sequence)
 * - Les fichiers médias associés (images, audios, vidéos de séquences)
 * 
 * Le processus d'exportation:
 * 1. Génère les instructions SQL pour toutes les entités principales
 * 2. Ajoute ces instructions dans un fichier SQL
 * 3. Collecte tous les fichiers médias des dossiers pertinents
 * 4. Crée une archive ZIP contenant le fichier SQL et tous les médias
 * 5. Nettoie les fichiers temporaires et renvoie l'archive au client
 */

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;
use ZipArchive;

class GlobalExportController extends AbstractController
{
    #[Route('/admin/global-export', name: 'admin_global_export', methods: ['GET'])]
    public function globalExport(EntityManagerInterface $em): StreamedResponse
    {
        $entities = [
            'Contenu'         => 'App\Entity\Contenu',
            'ContenuFormat'   => 'App\Entity\ContenuFormat',
            'Couleur'         => 'App\Entity\Couleur',
            'Etape'           => 'App\Entity\Etape',
            'Exercice'        => 'App\Entity\Exercice',
            'Sequence'        => 'App\Entity\Sequence',
        ];

        $tempDir = sys_get_temp_dir() . '/global_export_' . uniqid();
        mkdir($tempDir);

        // Génération du fichier SQL
        $sqlData = $this->generateSqlData($em, $entities);
        file_put_contents($tempDir . '/database_export.sql', $sqlData);

        $imagesFolder = $this->getParameter('kernel.project_dir') . '/public/images';
        $audiosFolder = $this->getParameter('kernel.project_dir') . '/public/audios';
        $sequenceVideosFolder = $this->getParameter('kernel.project_dir') . '/public/sequencevideos';

        $zipFile = tempnam(sys_get_temp_dir(), 'global_export_') . '.zip';
        $zip = new ZipArchive();
        if ($zip->open($zipFile, ZipArchive::CREATE) !== true) {
            throw new \Exception('Impossible de créer le fichier ZIP');
        }

        // Ajout du fichier SQL dans le ZIP
        $sqlPath = $tempDir . '/database_export.sql';
        $zip->addFile($sqlPath, 'database_export.sql');

        if (is_dir($imagesFolder)) {
            $this->addFolderToZip($imagesFolder, 'images', $zip);
        }

        if (is_dir($audiosFolder)) {
            $this->addFolderToZip($audiosFolder, 'audios', $zip);
        }

        if (is_dir($sequenceVideosFolder)) {
            $this->addFolderToZip($sequenceVideosFolder, 'sequencevideos', $zip);
        }

        $zip->close();

        $this->deleteDirectory($tempDir);

        $response = new StreamedResponse(function () use ($zipFile) {
            readfile($zipFile);
            unlink($zipFile); // nettoyage après envoi
        });
        $disposition = $response->headers->makeDisposition('attachment', 'global_export.zip');
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Type', 'application/zip');

        return $response;
    }

    private function addFolderToZip(string $folder, string $zipFolder, ZipArchive $zip): void
    {
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($folder),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );
        foreach ($files as $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = $zipFolder . '/' . substr($filePath, strlen($folder) + 1);
                $zip->addFile($filePath, $relativePath);
            }
        }
    }

    private function deleteDirectory(string $dir): void
    {
        if (!file_exists($dir)) {
            return;
        }
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $filePath = "$dir/$file";
            (is_dir($filePath)) ? $this->deleteDirectory($filePath) : unlink($filePath);
        }
        rmdir($dir);
    }

    private function generateSqlData(EntityManagerInterface $em, array $entities): string
    {
        $sqlContent = "-- Export SQL généré le " . date('Y-m-d H:i:s') . "\n";
        $sqlContent .= "-- Assurez-vous de faire une sauvegarde de votre base de données avant d'importer ce fichier\n\n";
        
        // Ajout d'instructions pour désactiver les contraintes de clés étrangères
        $sqlContent .= "SET FOREIGN_KEY_CHECKS=0;\n\n";
        
        // Pour chaque entité, générer les instructions DELETE et INSERT
        foreach ($entities as $entityName => $entityClass) {
            $repository = $em->getRepository($entityClass);
            $records = $repository->findAll();
            
            if (empty($records)) {
                continue;
            }
            
            $tableName = $em->getClassMetadata($entityClass)->getTableName();
            
            $sqlContent .= "-- Suppression des données existantes pour " . $entityName . "\n";
            $sqlContent .= "DELETE FROM `" . $tableName . "`;\n\n";
            
            $sqlContent .= "-- Insertion des données pour " . $entityName . "\n";
            
            foreach ($records as $record) {
                $metadata = $em->getClassMetadata($entityClass);
                $columns = [];
                $values = [];
                
                // Récupération des valeurs de champs simples
                foreach ($metadata->getFieldNames() as $fieldName) {
                    $columnName = $metadata->getColumnName($fieldName);
                    $columns[] = "`" . $columnName . "`";
                    
                    // Convertir le nom du champ en camelCase pour l'appel du getter
                    $getterFieldName = $this->toCamelCase($fieldName);
                    $getter = 'get' . ucfirst($getterFieldName);
                    $value = $record->$getter();
                    
                    if ($value === null) {
                        $values[] = "NULL";
                    } elseif (is_bool($value)) {
                        $values[] = $value ? "1" : "0";
                    } elseif (is_numeric($value)) {
                        $values[] = $value;
                    } else {
                        $values[] = "'" . addslashes($value) . "'";
                    }
                }
                
                // Récupération des associations ManyToOne
                foreach ($metadata->getAssociationMappings() as $fieldName => $mapping) {
                    if ($mapping['type'] == 2) { // ManyToOne
                        $getterFieldName = $this->toCamelCase($fieldName);
                        $associatedEntity = $record->{'get' . ucfirst($getterFieldName)}();
                        
                        if ($associatedEntity) {
                            $columnName = $metadata->getSingleAssociationJoinColumnName($fieldName);
                            $columns[] = "`" . $columnName . "`";
                            $values[] = $associatedEntity->getId();
                        }
                    }
                }
                
                $sqlContent .= "INSERT INTO `" . $tableName . "` (" . implode(", ", $columns) . ") VALUES (" . implode(", ", $values) . ");\n";
            }
            
            $sqlContent .= "\n";
        }
        
        // Ajouter des instructions pour les tables de jointure ManyToMany
        $sqlContent .= $this->generateManyToManySql($em, [
            'contenu_exercice' => ['Contenu', 'Exercice']
            // Ajoutez d'autres tables de jointure si nécessaire
        ]);
        
        // Réactivation des contraintes de clés étrangères
        $sqlContent .= "SET FOREIGN_KEY_CHECKS=1;\n";
        
        return $sqlContent;
    }

    /**
     * Convertit un nom de champ avec underscores en camelCase
     */
    private function toCamelCase(string $string): string
    {
        return lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $string))));
    }

    private function generateManyToManySql(EntityManagerInterface $em, array $joinTables): string
    {
        $sql = "";
        
        foreach ($joinTables as $tableName => $entities) {
            $sql .= "-- Suppression des données existantes pour la table de jointure " . $tableName . "\n";
            $sql .= "DELETE FROM `" . $tableName . "`;\n\n";
            
            // Récupérer les données de la table de jointure par une requête SQL directe
            $conn = $em->getConnection();
            $rows = $conn->fetchAllAssociative("SELECT * FROM " . $tableName);
            
            if (!empty($rows)) {
                $sql .= "-- Insertion des données pour la table de jointure " . $tableName . "\n";
                
                foreach ($rows as $row) {
                    $columns = array_keys($row);
                    $columnsList = "`" . implode("`, `", $columns) . "`";
                    
                    $valuesList = [];
                    foreach ($row as $value) {
                        if ($value === null) {
                            $valuesList[] = "NULL";
                        } else {
                            $valuesList[] = $value;
                        }
                    }
                    
                    $sql .= "INSERT INTO `" . $tableName . "` (" . $columnsList . ") VALUES (" . implode(", ", $valuesList) . ");\n";
                }
                
                $sql .= "\n";
            }
        }
        
        return $sql;
    }
}

