<?php

namespace App\Command;

use App\Entity\Contenu;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[AsCommand(
    name: 'lel:rename',
    description: 'Renomme les fichiers en utilisant un slug et mets à jour les références dans la base de données. Utilisez l\'option --force pour renommer les fichiers existants.',
)]
class SlugifyFilesNamesCommand extends Command
{
    private string $publicDir;
    private string $imagesDirName = 'images';

    public function __construct(private EntityManagerInterface $entityManager, private Filesystem $filesystem, private ParameterBagInterface $params)
    {
        parent::__construct();
        $this->publicDir = $this->params->get('kernel.project_dir') . '/public';
    }

    protected function configure(): void
    {
        $this->addOption(
            'force',
            null,
            InputOption::VALUE_NONE,
            'Par défaut, cela n affecte pas les fichiers existants. Utilisez cette option pour forcer le renommage des fichiers existants.'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $slugger = new AsciiSlugger();
        $imagesPath = $this->publicDir . '/' . $this->imagesDirName;

        if (!$this->filesystem->exists($imagesPath)) {
            $io->error(sprintf('Le dossier des images "%s" n\'existe pas.', $imagesPath));
            return Command::FAILURE;
        }

        $finder = new Finder();
        $finder->files()->in($imagesPath);

        $contenuRepository = $this->entityManager->getRepository(Contenu::class);
        $renamedCount = 0;
        $updatedEntitiesCount = 0;

        $io->progressStart(count($finder));

        foreach ($finder as $file) {
            $originalFilename = $file->getFilename();
            $extension = $file->getExtension();
            $filenameWithoutExtension = $file->getFilenameWithoutExtension();

            $slugifiedName = $slugger->slug($filenameWithoutExtension, '-', 'fr')->lower()->toString();
            $newFilename = $slugifiedName . '.' . $extension;

            if ($originalFilename !== $newFilename) {
                $originalFullPath = $file->getRealPath();
                $newFullPath = $imagesPath . '/' . $newFilename;

                // Gérer les conflits de noms (si un fichier slugifié existe déjà)
                $counter = 1;
                while ($this->filesystem->exists($newFullPath)) {
                    $newFilename = $slugifiedName . '-' . $counter . '.' . $extension;
                    $newFullPath = $imagesPath . '/' . $newFilename;
                    $counter++;
                }

                try {
                    if ($input->getOption('force')) {
                        $this->filesystem->rename($originalFullPath, $newFullPath);
                    }
                    $io->writeln(sprintf('Renommé "%s" en "%s"', $originalFilename, $newFilename));
                    $renamedCount++;

                    // Mettre à jour la base de données
                    $contenusToUpdate = $contenuRepository->findBy(['image_url' => $originalFilename]);
                    foreach ($contenusToUpdate as $contenu) {
                        if ($input->getOption('force')) {
                            $contenu->setImageUrl($newFilename);
                        }
                        $updatedEntitiesCount++;
                        $io->writeln(sprintf('  -> Mis à jour image_url pour Contenu ID %d', $contenu->getId()));
                    }

                } catch (\Exception $e) {
                    $io->error(sprintf('Erreur lors du renommage de "%s": %s', $originalFilename, $e->getMessage()));
                    // Remettre le nom original si le renommage a eu lieu mais que la MàJ BDD échoue ?
                    // Pour la simplicité, on ne le fait pas ici, mais c'est à considérer.
                }
            }
            $io->progressAdvance();
        }

        $this->entityManager->flush();
        $io->progressFinish();

        if ($renamedCount > 0) {
            $io->success(sprintf('%d fichier(s) renommé(s) et %d référence(s) en base de données mise(s) à jour.', $renamedCount, $updatedEntitiesCount));
        } else {
            $io->note('Aucun fichier n\'a nécessité de renommage.');
        }

        return Command::SUCCESS;
    }
}
