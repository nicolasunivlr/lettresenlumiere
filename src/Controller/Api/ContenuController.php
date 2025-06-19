<?php

namespace App\Controller\Api;

use App\Entity\Exercice;
use App\Entity\Sequence;
use App\Repository\ContenuRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ContenuController extends AbstractController
{
    //#[Route('/api/update-images', name: 'update_contenu_images', methods: ['POST'])]
    public function updateImages(ContenuRepository $contenuRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        // Définir le dossier des images
        $imageDir = $this->getParameter('kernel.project_dir') . '/public/images/';
        $images = array_diff(scandir($imageDir), ['.', '..']); // Liste des fichiers images
        $updated = 0;
        $updatedContents = [];

        $contenus = $contenuRepository->createQueryBuilder('c')
            ->where('c.image_url IS NULL OR c.image_url = :empty')
            ->setParameter('empty', '')
            ->getQuery()
            ->getResult();

        foreach ($contenus as $contenu) {
            $contentName = $contenu->getContenu();

            foreach ($images as $image) {
                // On récupère le nom du fichier sans son extension
                $imageName = pathinfo($image, PATHINFO_FILENAME);

                // Comparaison directe en ignorant la casse
                if (strcasecmp($contentName, $imageName) === 0) {
                    $contenu->setImageUrl('images/' . $image);
                    $entityManager->persist($contenu);
                    $updated++;

                    $updatedContents[] = [
                        'id' => $contenu->getId(),
                        'contenu' => $contenu->getContenu(),
                        'image_url' => $contenu->getImageUrl()
                    ];
                    break; // Une image par contenu, on passe au suivant
                }
            }
        }

        if ($updated > 0) {
            $entityManager->flush();
        }

        return $this->json([
            'message' => "$updated images mises à jour",
            'updated_contents' => $updatedContents
        ]);
    }

    //#[Route('/api/test/bilan', name: 'test_bilan', methods: ['GET'])]
    public function getBilanTest(EntityManagerInterface $entityManager): JsonResponse
    {
        $sequences = $entityManager->getRepository(Sequence::class)
            ->createQueryBuilder('s')
            ->where('s.nom LIKE :bilan')
            ->setParameter('bilan', 'BILAN%')
            ->getQuery()
            ->getResult();

        if (!$sequences) {
            return $this->json(['message' => 'Aucune séquence BILAN trouvée.'], 404);
        }

        $bilans = $entityManager->getRepository(Exercice::class)
            ->createQueryBuilder('e')
            ->leftJoin('e.contenus', 'c')
            ->addSelect('c')
            ->where('e.sequence IN (:sequences)')
            ->andWhere('e.type_exercice LIKE :typeExercice')
            ->setParameter('sequences', $sequences)
            ->setParameter('typeExercice', 'G.%')
            ->getQuery()
            ->getResult();

        if (!$bilans) {
            return $this->json(['message' => 'Aucun exercice de type G. trouvé.'], 404);
        }

        $groupedBilans = [
            'bilan_1_6' => [],
            'bilan_7_12' => [],
            'bilan_13_18' => []
        ];

        // Parcours des bilans pour récupérer les données
        foreach ($bilans as $bilan) {
            $sequence = $bilan->getSequence();
            $numeroBilan = (int) filter_var($sequence->getNom(), FILTER_SANITIZE_NUMBER_INT);

            // Initialisation des contenus pour ce bilan
            $contenusData = [];
            foreach ($bilan->getContenus()->toArray() as $contenu) {
                // On prépare les données des contenus comme dans l'exemple de la route custom
                $contenusData[] = [
                    'contenu_id' => $contenu->getId(),
                    'element' => $contenu->getContenu(),
                    'image_url' => $contenu->getImageUrl(),
                    'video_url' => $contenu->getAudioUrl(),
                    'sons_url' => $contenu->getAudioUrl(),
                    'syllabes' => $contenu->getSyllabes(),
                    'couleur' => $contenu->getCouleur() ? [
                        'code' => $contenu->getCouleur()->getCode(),
                        'lettre' => $contenu->getCouleur()->getLettres(),
                        'bold' => $contenu->getContenuFormats()->isBold(),
                    ] : null,
                ];
            }

            // Création des données pour ce bilan
            $bilanData = [
                'id' => $bilan->getId(),
                'type_exercice' => $bilan->getTypeExercice(),
                'sequence' => [
                    'id' => $sequence->getId(),
                    'nom' => $sequence->getNom()
                ],
                'contenus' => $contenusData,  // On ajoute les contenus ici
                'consigne' => $bilan->getConsigne()
            ];

            // Classification du bilan selon son numéro
            if ($numeroBilan >= 1 && $numeroBilan <= 6) {
                $groupedBilans['bilan_1_6'][] = $bilanData;
            } elseif ($numeroBilan >= 7 && $numeroBilan <= 12) {
                $groupedBilans['bilan_7_12'][] = $bilanData;
            } elseif ($numeroBilan >= 13 && $numeroBilan <= 18) {
                $groupedBilans['bilan_13_18'][] = $bilanData;
            }
        }

        // Renvoi de la réponse JSON avec les bilans groupés
        return $this->json($groupedBilans, 200, [], ['groups' => 'exercice:read']);
    }




}
