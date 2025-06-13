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

        // Construction de la commande mysqldump
        // L'utilisation de --password= directement en ligne de commande peut être un risque de sécurité.
        // Pour une meilleure sécurité, envisagez d'utiliser un fichier d'options MySQL (my.cnf)
        // ou des variables d'environnement que mysqldump peut lire (ex: MYSQL_PWD).
        $command = [
            'mysqldump',
            '--host=' . $dbHost,
            '--user=' . $dbUser,
            '--ignore-table='.$dbName.'.user'
        ];

        // Ajouter le mot de passe seulement s'il est défini
        if ($dbPassword) {
            $command[] = '--password=' . $dbPassword;
        }

        $command[] = $dbName;

        $process = new Process($command);

        // Augmenter le timeout si nécessaire pour les grosses bases de données
        $process->setTimeout(3600); // 1 heure, par exemple
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        // Écrire la sortie dans le fichier de sauvegarde
        $this->filesystem->dumpFile($backupFile, $process->getOutput());

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
