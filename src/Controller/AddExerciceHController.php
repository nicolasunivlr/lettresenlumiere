<?php

namespace App\Controller;

use App\Controller\Admin\ExerciceCrudController;
use App\Entity\Exercice;
use App\Repository\ExerciceRepository;
use App\Repository\SequenceRepository;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AddExerciceHController extends AbstractController
{
    private ExerciceRepository $exerciceRepository;
    private SequenceRepository $sequenceRepository;
    private EntityManagerInterface $entityManager;
    private AdminUrlGenerator $adminUrlGenerator;

    public function __construct(
        ExerciceRepository $exerciceRepository,
        SequenceRepository $sequenceRepository,
        EntityManagerInterface $entityManager,
        AdminUrlGenerator $adminUrlGenerator
    ) {
        $this->exerciceRepository = $exerciceRepository;
        $this->sequenceRepository = $sequenceRepository;
        $this->entityManager = $entityManager;
        $this->adminUrlGenerator = $adminUrlGenerator;
    }

    #[Route('/admin/add-exercice-h', name: 'admin_add_exercice_h')]
    public function addExerciceH(): Response
    {
        $sequences = $this->sequenceRepository->findAll();
        $addedExercices = 0;

        foreach ($sequences as $sequence) {
            // Récupérer les exercices de la séquence, triés par "ordre"
            $exercices = $this->exerciceRepository->findBy(
                ['sequence' => $sequence],
                ['ordre' => 'ASC']
            );

            // Assigner un ordre si nécessaire pour tous les exercices existants
            $ordre = 1;
            foreach ($exercices as $exercice) {
                // Si l'ordre est null, on lui assigne une valeur
                if ($exercice->getOrdre() === null) {
                    $exercice->setOrdre($ordre++);
                    $this->entityManager->persist($exercice);
                }
            }

            // Mettre à jour les exercices avec des ordres null
            $this->entityManager->flush();

            $hasC2bis = null;
            $hasE2bis = null;
            $existingH = null;

            // Identifier les positions de C.2 bis et E.2 bis
            foreach ($exercices as $exercice) {
                if ($exercice->getTypeExercice() === 'C.2 bis') {
                    $hasC2bis = $exercice;
                }
                if ($exercice->getTypeExercice() === 'E.2 bis') {
                    $hasE2bis = $exercice;
                }
                if ($exercice->getTypeExercice() === 'H') {
                    $existingH = $exercice;
                }
            }

            // Si on a C.2 bis et E.2 bis, mais pas encore de H, on l'insère entre les deux
            if ($hasC2bis && $hasE2bis && !$existingH) {
                $newExercice = new Exercice();
                $newExercice->setTypeExercice('H');
                $newExercice->setConsigne('Remet la bonne syllabe dans l\'ordre');
                $newExercice->setSequence($sequence);

                // On place l'exercice H juste après C.2 bis
                $newExercice->setOrdre($hasC2bis->getOrdre() + 1);

                // Persister le nouvel exercice H
                $this->entityManager->persist($newExercice);
                $addedExercices++;

                // Décaler les exercices suivants après l'exercice H
                foreach ($exercices as $exercice) {
                    // Si l'exercice a un ordre plus élevé que celui de H, on le décale d'une position
                    if ($exercice->getOrdre() > $hasC2bis->getOrdre()) {
                        $exercice->setOrdre($exercice->getOrdre() + 1);
                        $this->entityManager->persist($exercice);
                    }
                }
            }
        }

        // Enregistrer les modifications en base
        $this->entityManager->flush();

        // Retourner un message de succès et rediriger
        $this->addFlash('success', "Ajout de {$addedExercices} exercices de type H terminé avec succès.");

        return $this->redirect($this->adminUrlGenerator
            ->setController(ExerciceCrudController::class)
            ->setAction('index')
            ->generateUrl());
    }
}
