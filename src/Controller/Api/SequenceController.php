<?php

namespace App\Controller\Api;

use App\Repository\SequenceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class SequenceController extends AbstractController
{
    //#[Route('/api/custom/sequences', name: 'custom_sequence', methods: ['GET'])]
    public function getCustomSequences(SequenceRepository $sequenceRepository): JsonResponse
    {
        $sequences = $sequenceRepository->findAll();
        $data = [];

        foreach ($sequences as $sequence) {
            $sequenceData = [
                'sequence_id' => $sequence->getId(),
                'nom'         => $sequence->getNom(),
                'video_url'   => $sequence->getVideoUrl(),
                'exercices'   => [],
            ];

            // Convertir la collection en tableau puis trier par ordre croissant
            $exercices = $sequence->getExercices()->toArray();
            usort($exercices, function ($a, $b) {
                return $a->getOrdre() <=> $b->getOrdre();
            });

            foreach ($exercices as $exercice) {
                $exerciceData = [
                    'exercice_id' => $exercice->getId(),
                    'type'        => $exercice->getTypeExercice(),
                    'consigne'    => $exercice->getConsigne(),
                    'contenus'    => [],
                ];

                foreach ($exercice->getContenus() as $contenu) {
                    $formatsData = [];
                    foreach ($contenu->getContenuFormats() as $format) {
                        $formatsData[] = [
                            'id'      => $format->getId(),
                            'lettres' => $format->getLettres(),
                            'couleur' => $format->getCouleur() ? [
                                'code' => $format->getCouleur()->getCode(),
                                'bold' => $format->isBold(),
                            ] : ($format->isBold() ? [
                                'bold' => true
                            ] : null),
                        ];
                    }
                    $contenuData = [
                        'contenu_id'    => $contenu->getId(),
                        'element'       => $contenu->getContenu(),
                        'image_url'     => $contenu->getImageUrl(),
                        'video_url'     => $contenu->getAudioUrl(),
                        'sons_url'      => $contenu->getAudioUrl(),
                        'syllabes'      => $contenu->getSyllabes(),
                        'contenuFormats'=> $formatsData,
                    ];
                    $exerciceData['contenus'][] = $contenuData;
                }

                $sequenceData['exercices'][] = $exerciceData;
            }

            $data[] = $sequenceData;
        }

        return new JsonResponse($data);
    }

    //#[Route('/api/custom/sequences/{id}', name: 'custom_sequence_id', methods: ['GET'])]
    public function getCustomSequenceId(SequenceRepository $sequenceRepository, string $id): JsonResponse
    {
        $sequence = $sequenceRepository->find($id);
        $data = [];

        if ($sequence) {
            $sequenceData = [
                'sequence_id' => $sequence->getId(),
                'nom'         => $sequence->getNom(),
                'video_url'   => $sequence->getVideoUrl(),
                'exercices'   => [],
            ];

            // Convertir la collection en tableau puis trier par ordre croissant
            $exercices = $sequence->getExercices()->toArray();
            usort($exercices, function ($a, $b) {
                return $a->getOrdre() <=> $b->getOrdre();
            });

            foreach ($exercices as $exercice) {
                $exerciceData = [
                    'exercice_id' => $exercice->getId(),
                    'type'        => $exercice->getTypeExercice(),
                    'consigne'    => $exercice->getConsigne(),
                    'contenus'    => [],
                ];

                foreach ($exercice->getContenus() as $contenu) {
                    $formatsData = [];
                    foreach ($contenu->getContenuFormats() as $format) {
                        $formatsData[] = [
                            'id'      => $format->getId(),
                            'lettres' => $format->getLettres(),
                            'couleur' => $format->getCouleur() ? [
                                'code' => $format->getCouleur()->getCode(),
                                'bold' => $format->isBold(),
                            ] : ($format->isBold() ? [
                                'bold' => true
                            ] : null),
                        ];
                    }

                    $contenuData = [
                        'contenu_id'    => $contenu->getId(),
                        'element'       => $contenu->getContenu(),
                        'image_url'     => $contenu->getImageUrl(),
                        'video_url'     => $contenu->getAudioUrl(),
                        'sons_url'      => $contenu->getAudioUrl(),
                        'syllabes'      => $contenu->getSyllabes(),
                        'contenuFormats'=> $formatsData,
                    ];
                    $exerciceData['contenus'][] = $contenuData;
                }

                $sequenceData['exercices'][] = $exerciceData;
            }

            $data[] = $sequenceData;
        } else {
            $data[] = 'Séquence non existante';
        }

        return new JsonResponse($data);
    }
}
