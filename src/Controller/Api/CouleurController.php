<?php

namespace App\Controller\Api;

use App\Repository\CouleurRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class CouleurController extends AbstractController
{
    //#[Route('/api/custom/couleur', name: 'custom_couleur', methods: ['GET'])]
    public function getCustomCouleur(CouleurRepository $couleurRepository): JsonResponse{
           $couleur = $couleurRepository->findAll();
           $data = [];

           foreach ($couleur as $coul) {
               $data[] = [
                   'code' => $coul->getCode(),
               ];

           }

            return $this->json(['couleur' => $data]);
    }
}
