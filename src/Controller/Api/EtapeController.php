<?php

namespace App\Controller\Api;


use App\Repository\SequenceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class EtapeController extends AbstractController
{
    #[Route('/api/custom/etapes', name: 'custom_etapes', methods: ['GET'])]
    public function getCustomEtape(SequenceRepository $sequenceRepository): JsonResponse{
        $sequence = $sequenceRepository->findAll();
        $data=[];

        foreach ($sequence as $seq){
            $etape_id = $seq->getEtape()->getId();
            $etape_nom = $seq->getEtape()->getNom();

            if(!isset($data[$etape_id])){
                $data[$etape_id] = [
                    'etape_id' => $etape_id,
                    'nom' => $etape_nom,
                    'sequences' => [],
                ];
            }
            $data[$etape_id]['sequences'][] = [
                'sequence_id' => $seq->getId(),
                'nom' => $seq->getNom(),
            ];
        }
        $data = array_values($data);
        return new JsonResponse($data);
    }
}
