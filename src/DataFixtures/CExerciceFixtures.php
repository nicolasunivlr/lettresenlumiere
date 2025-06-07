<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Exercice;

class CExerciceFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $types = [
            'type1' => ['A.1', 'B.1', 'C.1', 'D.1', 'E.1', 'G.1'],
            'type2' => ['A.2', 'B.2'],
            'type3' => ['C.2 bis', 'E.2 bis'],
            'type4' => ['G.1(A - E - I - O - U - É)', 'G.1(L)', 'G.1(R)', 'G.1(IL - OR)', 'G.1(LETTRE MUETTE)'],
            'type5' => ['E.2 bis'],
            'type6' => ['G.1(F)', 'G.1(J)', 'G.1(IL - FIL)', 'G.1(UN - UNE)'],
            'type7' => ['A.2', 'B.2', 'G.2'],
            'type8' => ['F.1', 'F.2', 'E.2'],
            'type9' => ['A.2', 'B.2', 'C.2', 'D.2', 'E.2', 'G.2'],
            'type10' => ['G.1(V)', 'G.1(B)', 'G.1(OU)', 'G.1(BAR)'],
            'type11' => ['G.1(CH)', 'G.1(P)', 'G.1(BRA)', 'G.1(IL EST - ELLE EST - C\'EST)'],
            'type12' => ['G.1(T)', 'G.1(M)', 'G.1(D)', 'G.1(EU)'],
            'type14' => ['F.1', 'F.2', 'E.2','G.2'],
            'type15' => ['G.1(DRA)', 'G.1(N)', 'G.1(GN)', 'G.1(Z)'],
            'type16' => ['A.2', 'B.2', 'D.2'],
            'type17' => ['C.2', 'F.2', 'E.2', 'G.2'],
            'type18' => ['F.3', 'C.3'],
            'type19' => ['G.2(S SS)', 'G.2(S Z)', 'G.2(DES LES MES)', 'G.2(C K QU)', 'G.2(G GU)'],
            'type20' => ['G.2(UN)', 'G.2(AN EN)', 'G.2(ON)', 'G.2(IN)', 'G.2(AM EM OM IM)'],
            'type21' => ['G.2(OI)', 'G.2(OIN)', 'G.2(UI)', 'G.2(Y I)'],
            'type22' => ['G.2(À Â Ô)', 'G.2(O AU EAU)', 'G.2(EU Œ)', 'G.2(IL A EU)', 'G.2(-NT)'],
            'type23' => ['G.2(È Ê Ë)', 'G.2(ELL ERR ESS)', 'G.2(ES ER EC)', 'G.2(-ER -EZ -ET)', 'G.2(AI EI)'],
            'type24' => ['G.2(PH)', 'G.2(H)', 'G.2(CE CI Ç)', 'G.2(GE GI GE)'],
            'type25' => ['G.2(I)', 'G.2(X)', 'G.2(AIN EIN)', 'G.2(YN YM UM)', 'G.2(IEN ÉEN)'],
            'type26' => ['G.2(TION)', 'G.2(AY OY EY UY)', 'G.2(-IL)', 'G.2(-ILLE)'],
            'type27' => ['G.2(LL)', 'G.2(BB DD FF PP)', 'G.2(CC GG)', 'G.2(MM NN)'],
            'type28' => ['G.2(-AMM -EMM)', 'G.2(Ï)', 'G.2(W)', 'G.2(-ER -ET)'],
            'type29' => ['G.2(LETTRES FINALES)', 'G.2(MOTS IRRÉGULIERS 1)', 'G.2(CK CU CQU CH)', 'G.2(GUA QUA)'],
            'type30' => ['G.2(MOTS IRRÉGULIERS 2)', 'G.2(OO)', 'G.2(MOTS ANGLAIS)', 'G.2(MOTS IRRÉGULIERS 3)'],
            'type31' => ['A.2', 'B.2', 'C.2', 'D.2', 'G.2'],


        ];

        $sequenceData = [
            //Exercice type pour etape 1
            0 => $types['type1'],
            1 => $types['type1'],
            2 => array_merge($types['type1'], $types['type2'], $types['type3']),
            3 => array_merge($types['type1'], $types['type2'], $types['type3']),
            4 => array_merge($types['type1'], $types['type2']),
            5 => $types['type4'],

            //Exercice type pour etape 2
            6 => array_merge($types['type31'], $types['type5']),
            7 => array_merge($types['type1'], $types['type2'], $types['type3']),
            8 => array_merge($types['type1'], $types['type2'], $types['type3']),
            9 => array_merge($types['type1'], $types['type2'], $types['type3']),
            10 => array_merge($types['type1'], $types['type5']),
            11 => $types['type6'],

            //Exercice type pour etape 3
            12 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            13 => array_merge($types['type1'], $types['type2'], $types['type3'], $types['type8']),
            14 => array_merge($types['type1'], $types['type2'], $types['type3'], $types['type8']),
            15 => array_merge($types['type9'], $types['type2'], $types['type3']),
            16 => $types['type10'],

            //Exercice type pour etape 4
            17 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            18 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            19 => array_merge($types['type1'], $types['type7'], $types['type3']),
            20 => array_merge($types['type1'], $types['type2'], $types['type3']),
            21 => $types['type11'],

            //Exercice type pour etape 5
            22 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            23 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            24 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            25 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            26 => $types['type12'],

            //Exercice type pour etape 6
            27 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type8']),
            28 => array_merge($types['type1'], $types['type2'], $types['type3'], $types['type14']),
            29 => array_merge($types['type1'], $types['type2'], $types['type3'], $types['type14']),
            30 => array_merge($types['type1'], $types['type7'], $types['type3'], $types['type14']),
            31 => $types['type15'],

            //Exercice type pour etape 7
            32 => array_merge($types['type1'], $types['type7'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            33 => array_merge($types['type7'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            34 => array_merge($types['type1'] ,$types['type7'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            35 => array_merge([$types['type1'][0], $types['type1'][1]], [$types['type1'][0], $types['type1'][1]], [$types['type1'][2], $types['type1'], $types['type1'][3], $types['type1'][4], $types['type1'][5]], [$types['type9'][0], $types['type9'][1], $types['type9'][4]], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            36 => array_merge([$types['type1'][0], $types['type1'][1]], [$types['type1'][0], $types['type1'][1]], [$types['type1'][2], $types['type1'][3], $types['type1'][4], $types['type1'][5]], [$types['type9'][0], $types['type9'][1], $types['type9'][4]], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            37 => $types['type19'],

            //Exercice type pour etape 8
            38 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            39 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            40 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            41 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            42 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            43 => $types['type20'],

            //Exercice type pour etape 9
            44 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            45 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            46 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            47 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            48 => $types['type21'],

            //Exercice type pour etape 10
            49 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            50 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            51 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            52 => array_merge($types['type16'], $types['type3'], [$types['type17'][0], $types['type17'][2], $types['type17'][3]], $types['type18']),
            53 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            54 => $types['type22'],
            //Exercice type pour etape 11
            55 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            56 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            57 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            58 => array_merge($types['type16'], $types['type3'], [$types['type17'][0], $types['type17'][2], $types['type17'][3]], [$types['type8'][0]], $types['type18']),
            59 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            60 => $types['type23'],

            //Exercice type pour etape 12
            61 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            62 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            63 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            64 => array_merge($types['type1'], $types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            65 => $types['type24'],

            //Exercice type pour etape 13
            66 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            67 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            68 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            69 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            70 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            71 => $types['type25'],

            //Exercice type pour etape 14
            72 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            73 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            74 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            75 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            76 => $types['type26'],

            //Exercice type pour etape 15
            77 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            78 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            79 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            80 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            81 => $types['type27'],

            //Exercice type pour etape 16
            82 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            83 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            84 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            85 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            86 => $types['type28'],

            //Exercice type pour etape 17
            87 => array_merge($types['type16'], $types['type3'], $types['type17'], $types['type18']),
            88 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            89 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            90 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            91 => $types['type29'],

            //Exercice type pour etape 18
            92 => array_merge($types['type16'], $types['type3'], $types['type17'], $types['type18']),
            93 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            94 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            95 => array_merge($types['type16'], $types['type3'], [$types['type8'][0]], $types['type17'], $types['type18']),
            96 => $types['type30'],
        ];

        $instructions = [
            'A.1' => 'Écoute et répète.',
            'A.2' => 'Écoute et répète.',
            'B.1' => 'Trouve la bonne syllabe.',
            'B.2' => 'Trouve le bon mot.',
            'C.1' => 'Écris la syllabe.',
            'C.2' => 'Écris le mot.',
            'C.2 bis' => 'Écris la syllabe manquante.',
            'C.3' => 'Écris la phrase (avec modèle).',
            'D.1' => 'Trouve les 3 écritures de la même syllabe.',
            'D.2' => 'Trouve les 3 écritures du même mot.',
            'E.1' => 'Écris la syllabe (sans modèle).',
            'E.2' => 'Écris le mot (sans modèle).',
            'E.2 bis' => 'Écris la syllabe manquante (sans modèle).',
            'F.1' => 'Mets les syllabes dans l\'ordre.',
            'F.2' => 'Mets les lettres du mot dans l\'ordre.',
            'F.3' => 'Mets les mots de la phrase dans l\'ordre.',
            'G.1' => 'Trouve la bonne syllabe le plus vite possible.',
            'G.2' => 'Trouve le bon mot le plus vite possible.',
            'H.1' => 'Mets les syllabes dans l\'ordre.',
            'H.2' => 'Mets les syllabes du mot dans l\'ordre.',
            'H.3' => 'Mets les mots dans l\'ordre.',

        ];

        $sequences = [];
        for ($i = 1; $i <= 97; $i++) {
            dump('sequence' . $i);
            $sequences[] = $this->getReference('sequence' . $i);
        }

        dump($sequenceData[44]);


        foreach ($sequenceData as $sequenceIndex => $typesToAdd) {
            if (isset($sequences[$sequenceIndex])) {
                $this->addExercicesForSequence($manager, $sequences[$sequenceIndex], $typesToAdd, $sequenceIndex, $instructions);
            }
        }

        $manager->flush();
    }
    private function addExercicesForSequence(ObjectManager $manager, $sequence, array $types, int $sequenceIndex, array $instructions): void {
        foreach ($types as $index => $type) {
            $exercice = new Exercice();

            if (is_array($type)) {
                $typeExercice = implode(',', $type);
                $firstType = $type[0];
            } else {
                $typeExercice = (string) $type;
                $firstType = $type;
            }

            $exercice->setTypeExercice($typeExercice);
            $exercice->setSequence($sequence);

            // Modification spécifique pour la séquence 0
            if ($sequenceIndex === 0) {
                $consignesSpecifiques = [
                    'A.1' => 'Écoute et répète.',
                    'B.1' => 'Trouve la bonne lettre.',
                    'C.1' => 'Écris la lettre.',
                    'D.1' => 'Trouve les 3 écritures de la même lettre.',
                    'E.1' => 'Choisis la bonne réponse.',
                    'G.1' => 'Trouve la bonne lettre le plus vite possible.'
                ];

                $exercice->setConsigne($consignesSpecifiques[$firstType] ?? $instructions[$firstType] ?? '');
            } else {
                // Comportement standard pour les autres séquences
                if (isset($instructions[$firstType])) {
                    $exercice->setConsigne($instructions[$firstType]);
                }
            }

            $this->addReference('exercice_' . $sequenceIndex . '_' . $index, $exercice);
            $manager->persist($exercice);
        }
    }
}
