<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Attribute\Route;

final class UpdateGitAndDatabaseController extends AbstractController
{
    public function __construct(
        private ParameterBagInterface $params,
        private Filesystem $filesystem,
        #[Autowire('%env(DATABASE_URL)%')]
        private $databaseUrl,
        #[Autowire('%env(GITUSER)%')]
        private string $user
    )
    {}

    #[Route('/admin/maj-site', name: 'admin_maj_site_page', methods: ['GET'])]
    public function showMajPage(): Response
    {
        return $this->render('admin/maj_page.html.twig');
    }

    #[Route('/admin/maj-site/execute', name: 'admin_execute_maj_site', methods: ['POST'])]
    public function executeMaj(AdminUrlGenerator $adminUrlGenerator): Response
    {
        try {
            $backupFile = $this->executeBackupDbAction();
            $this->addFlash('success', 'La sauvegarde de la base de données a été effectuée avec succès : ' . $backupFile);
        } catch (ProcessFailedException $exception) {
            $this->addFlash('danger', 'La sauvegarde de la base de données a échoué. Détails : ' . $exception->getProcess()->getErrorOutput());
        } catch (\Exception $e) {
            $this->addFlash('danger', 'Une erreur inattendue est survenue lors de la mise à jour : ' . $e->getMessage());
        }
        $url = $adminUrlGenerator->setAction('index')
            ->setDashboard(DashboardController::class)
            ->setRoute('admin_maj_site_page')
            ->generateUrl();
        return $this->redirect($url);
    }

    private function executeBackupDbAction(): string
    {
        if (!$this->databaseUrl) {
            throw new \Exception("La variable d'environnement DATABASE_URL n'est pas configurée.");
        }

        $parsedUrl = parse_url($this->databaseUrl);

        if (!$parsedUrl || !isset($parsedUrl['scheme']) || $parsedUrl['scheme'] !== 'mysql') {
            throw new \Exception("DATABASE_URL n'est pas une URL MySQL valide ou n'est pas configurée correctement.");
        }

        $dbUser = $parsedUrl['user'] ?? null;
        $dbPassword = $parsedUrl['pass'] ?? null;
        $dbName = isset($parsedUrl['path']) ? ltrim($parsedUrl['path'], '/') : null;
        $dbHost = $parsedUrl['host'] ?? '127.0.0.1';
        $dbPort = $parsedUrl['port'] ?? null;

        if (!$dbUser || !$dbName) { // Le mot de passe peut être vide pour certains setups locaux
            throw new \Exception("Les paramètres de base de données (utilisateur, nom) ne sont pas correctement configurés.");
        }

        $projectDir = $this->params->get('kernel.project_dir');

        $backupFile = $projectDir . '/bdd.sql';

        // Commande pour exporter la structure de toutes les tables
        $commandStructure = [
            'mysqldump',
            '--host=' . $dbHost,
        ];
        if ($dbPort) {
            $commandStructure[] = '--port=' . $dbPort;
        }
        $commandStructure[] = '--user=' . $dbUser;
        if ($dbPassword) {
            $commandStructure[] = '--password=' . $dbPassword;
        }
        $commandStructure[] = '--no-data'; // Exporter uniquement la structure
        $commandStructure[] = $dbName;

        $processStructure = new Process($commandStructure);
        $processStructure->setTimeout(3600);
        $processStructure->run();

        if (!$processStructure->isSuccessful()) {
            throw new ProcessFailedException($processStructure);
        }
        $structureDump = $processStructure->getOutput();

        // Commande pour exporter les données de toutes les tables SAUF la table user
        $commandData = [
            'mysqldump',
            '--host=' . $dbHost,
        ];
        if ($dbPort) {
            $commandData[] = '--port=' . $dbPort;
        }
        $commandData[] = '--user=' . $dbUser;
        if ($dbPassword) {
            $commandData[] = '--password=' . $dbPassword;
        }
        $commandData[] = '--no-create-info'; // Ne pas exporter la structure (déjà fait)
        $commandData[] = '--ignore-table=' . $dbName . '.user'; // Ignorer la table user pour les données
        $commandData[] = $dbName;

        $processData = new Process($commandData);
        $processData->setTimeout(3600);
        $processData->run();

        if (!$processData->isSuccessful()) {
            throw new ProcessFailedException($processData);
        }
        $dataDump = $processData->getOutput();
        $sqlDump = $structureDump . $dataDump;
        // supprimer la ligne contenant la chaine \- du texte
        $sqlDump = preg_replace('/^\s*\/\*M!999999\\\\- enable the sandbox mode \*\/\s*\R?/m', '', $sqlDump);

        // Écrire la structure puis les données dans le fichier de sauvegarde
        $this->filesystem->dumpFile($backupFile, $structureDump . $sqlDump);

        $gitPullCommand = [
            'sudo',
            '-u', $this->user,
            '/usr/bin/git',
            '-C', $projectDir,
            'pull'
        ];
        $this->executeGitCommands($gitPullCommand, $projectDir);

        $gitAddCommand = [
            'sudo',
            '-u', $this->user,
            '/usr/bin/git',
            '-C', $projectDir,
            'add', '.'
        ];

        $this->executeGitCommands($gitAddCommand, $projectDir);

        $gitCommitCommand = [
            'sudo',
            '-u', $this->user,
            '/usr/bin/git',
            '-C', $projectDir,
            'commit', '-m', 'Mise à jour du site depuis le serveur de production.'
        ];
        $this->executeGitCommands($gitCommitCommand, $projectDir);

        $gitPushCommand = [
            'sudo',
            '-u', $this->user,
            '/usr/bin/git',
            '-C', $projectDir,
            'push'
        ];
        $this->executeGitCommands($gitPushCommand, $projectDir);

        return $backupFile;
    }

    private function executeGitCommands(array $command, string $projectDir): void
    {
        $process = new Process($command);
        $process->setWorkingDirectory($projectDir);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }
    }
}
