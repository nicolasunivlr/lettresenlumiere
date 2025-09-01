<?php

namespace App\Command;

use App\Entity\Contenu;
use App\Entity\Exercice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsCommand(
    name: 'app:update-audio-url',
    description: 'Met à jour les URLs des fichiers audio depuis un fichier de mapping CSV.',
)]
class UpdateAudioUrlCommand extends Command
{
    private string $projectDir;

    public function __construct(private EntityManagerInterface $entityManager, ParameterBagInterface $params)
    {
        parent::__construct();
        $this->projectDir = $params->get('kernel.project_dir');
    }

    protected function configure(): void
    {
        $this
            ->addArgument('entity', InputArgument::REQUIRED, 'Nom de l\'entité à mettre à jour')
            ->addArgument('mapping-file', InputArgument::OPTIONAL, 'Chemin du fichier CSV de mapping', 'mots_sons_mapping.csv');

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $mappingFileName = $input->getArgument('mapping-file');
        $entity = $input->getArgument('entity');
        $csvPath = $this->projectDir . '/' . $mappingFileName;

        if (!file_exists($csvPath)) {
            $io->error(sprintf('Le fichier de mapping "%s" n\'a pas été trouvé.', $csvPath));
            return Command::FAILURE;
        }

        $io->title('Mise à jour des URLs audio');
        $io->text('Lecture du fichier de mapping : ' . $mappingFileName);

        if ($entity === 'Contenu') {
            $io->text('Entité cible : Contenu');
            $repository = $this->entityManager->getRepository(Contenu::class);
        } elseif ($entity === 'Exercice') {
            $io->text('Entité cible : Exercice');
            $repository = $this->entityManager->getRepository(Exercice::class);
        } else{
            $io->error(sprintf('L\'entité "%s" n\'est pas supportée.', $entity));
            return Command::FAILURE;
        }

        $handle = fopen($csvPath, 'r');

        // Ignorer la ligne d'en-tête
        fgetcsv($handle);

        $rows = [];
        while (($data = fgetcsv($handle)) !== false) {
            $rows[] = $data;
        }
        fclose($handle);

        $io->progressStart(count($rows));

        $updatedCount = 0;
        $notFoundCount = 0;

        foreach ($rows as $row) {
            $originalWord = $row[0];
            $mp3Filename = $row[1];
            if ($entity === 'Contenu') {
                $contenus = $repository->findByCharBinary($originalWord);
            } elseif ($entity === 'Exercice') {
                $contenus = $repository->findBy(['consigne' => $originalWord]);
            }

            if (count($contenus) > 0) {
                foreach ($contenus as $contenu) {
                    $contenu->setAudioUrl($mp3Filename);
                    $updatedCount++;
                }
            } else {
                $io->warning(sprintf('Le mot %s du fichier CSV n\'a pas été trouvé dans la base de données.', $contenu->getContenu()));
                $notFoundCount++;
            }

            $io->progressAdvance();
        }

        $io->progressFinish();

        $io->text('Sauvegarde des modifications en base de données...');
        $this->entityManager->flush();

        $io->success(sprintf('%d enregistrement(s) mis à jour.', $updatedCount));
        if ($notFoundCount > 0) {
            $io->warning(sprintf('%d mot(s) du fichier CSV n\'ont pas été trouvés dans la base de données.', $notFoundCount));
        }

        return Command::SUCCESS;
    }
}
