<?php

namespace App\Controller\Api;

use App\Entity\Exercice;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ExerciceController extends AbstractController
{
    private ManagerRegistry $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    #[Route('/api/exercices/{sequenceId}', name: 'api_exercices', methods: ['GET'])]
    public function getExercicesBySequence(int $sequenceId): JsonResponse
    {
        $repository = $this->doctrine->getRepository(Exercice::class);
        $exercices = $repository->findBy(['sequence' => $sequenceId]);

        $data = [];
        foreach ($exercices as $exercice) {
            $data[] = [
                'id' => $exercice->getId(),
                'type_exercice' => $exercice->getTypeExercice(),
            ];
        }

        return new JsonResponse($data);
    }




}
