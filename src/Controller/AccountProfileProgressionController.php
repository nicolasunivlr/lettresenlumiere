<?php

namespace App\Controller;

use App\Repository\AccountProfileRepository;
use App\Repository\EtapeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AccountProfileProgressionController extends AbstractController
{
    #[Route('/api/account-profile/{idaccountprofile}/allProgressions', name: 'api_account_profile_all_progressions', methods: ['GET'])]
    public function getAllProgressions(
        int $idaccountprofile,
        AccountProfileRepository $accountProfileRepository,
        EtapeRepository $etapeRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        // Récupération du profil
        $accountProfile = $accountProfileRepository->find($idaccountprofile);
        
        if (!$accountProfile) {
            return $this->json([
                'error' => 'Account profile not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Récupération de toutes les progressions de ce profil en une seule requête
        $progressions = $em->getRepository(\App\Entity\Progression::class)
            ->findBy(['accountProfile' => $accountProfile]);
        
        // Création d'un index des progressions par exercice ID pour accès rapide
        $progressionsByExercice = [];
        foreach ($progressions as $progression) {
            $exerciceId = $progression->getExercice()->getId();
            $progressionsByExercice[$exerciceId] = $progression->getScore();
        }
        
        // Récupération de toutes les étapes avec leurs séquences et exercices
        $etapes = $etapeRepository->findAll();
        
        $result = [];
        
        foreach ($etapes as $etape) {
            $etapeData = [
                'id' => $etape->getId(),
                'nom' => $etape->getNom(),
                'sequences' => []
            ];
            
            // Pour chaque séquence de l'étape
            foreach ($etape->getSequences() as $sequence) {
                $exercices = $sequence->getExercices();
                $scores = [];
                
                // Récupération des scores depuis l'index
                foreach ($exercices as $exercice) {
                    $exerciceId = $exercice->getId();
                    if (isset($progressionsByExercice[$exerciceId])) {
                        $scores[] = $progressionsByExercice[$exerciceId];
                    }
                }
                
                // Calcul de la moyenne
                $moyenne = count($scores) > 0 ? round(array_sum($scores) / count($scores)) : null;
                
                $etapeData['sequences'][] = [
                    'id' => $sequence->getId(),
                    'nom' => $sequence->getNom(),
                    'score_moyen' => $moyenne
                ];
            }
            
            $result[] = $etapeData;
        }
        
        return $this->json($result);
    }


    #[Route('/api/account-profile/{idaccountprofile}/sequences/{idsequence}/results', name: 'api_account_profile_sequence_results', methods: ['GET'])]
    public function getSequenceResults(
        int $idaccountprofile,
        int $idsequence,
        AccountProfileRepository $accountProfileRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        // Récupérer le profil
        $accountProfile = $accountProfileRepository->find($idaccountprofile);
        if (!$accountProfile) {
            return $this->json(['error' => 'Account profile not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer la séquence
        $sequence = $em->getRepository(\App\Entity\Sequence::class)->find($idsequence);
        if (!$sequence) {
            return $this->json(['error' => 'Sequence not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer les exercices de la séquence
        $exercices = $sequence->getExercices();

        // Récupérer les progressions (scores) pour ce compte et ces exercices
        $progressions = $em->getRepository(\App\Entity\Progression::class)
            ->findBy(['accountProfile' => $accountProfile]);

        // Index par exerciceId
        $progressionsByExercice = [];
        foreach ($progressions as $progression) {
            $progressionsByExercice[$progression->getExercice()->getId()] = $progression->getScore();
        }

        // Préparer le résultat
        $result = [];
        foreach ($exercices as $exercice) {
            $result[] = [
                'id' => $exercice->getId(),
                'consigne' => $exercice->getConsigne(),
                'score' => $progressionsByExercice[$exercice->getId()] ?? null,
            ];
        }

        return $this->json($result);
    }

}
