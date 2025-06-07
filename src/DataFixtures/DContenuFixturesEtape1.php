<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Contenu;
use Doctrine\Common\DataFixtures\ReferenceRepository;
use OutOfBoundsException;

class DContenuFixturesEtape1 extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $contenus = [
            //contenu etape 1
            'contenu1' => ['a', 'e', 'i'],
            'contenu2' => ['a', 'e', 'i', 'o', 'u', 'é'],
            'contenu3' => ['la', 'le', 'li', 'lo', 'lu', 'lé'],
            'contenu4' => ['salé', 'sali', 'lavé', 'lune', 'pile', 'vélo'],
            'contenu5' => ['ra', 're', 'ri', 'ro', 'ru', 'ré'],
            'contenu6' => ['le rire', 'la rame', 'lire', 'doré', 'la robe', 'la rue'],
            'contenu7' => ['il', 'ir', 'al', 'ar', 'ol', 'or'],
            'contenu7_intrus' => ['li', 'ri', 'la', 'ra', 'lo', 'ro', 'lu', 'ru', 'le', 're'],
            'contenu8' => ['il rit', 'il lit', 'il rame', 'or'],
            'contenu9' => ['le lit', 'le lot', 'la rue', 'le rat', 'le riz', 'le rot'],

            //contenu etape 2
            'contenu10' => ['fa', 'fe', 'fi', 'fo', 'fu', 'fé'],
            'contenu11' => ['le café', 'le défilé', 'la fumée', 'la rafale', 'affolé'],
            'contenu12' => ['ja', 'je', 'ji', 'jo', 'ju', 'jé'],
            'contenu13' => ['jeté', 'joli', 'le judo', 'la jupe', 'je fume'],
            'contenu14' => ['il', 'ir', 'al', 'ar', 'ul', 'ur', 'ol', 'or'],
            'contenu15' => ['il a mal', 'le sol', 'le fil', 'le mur', 'le bar', 'l\'or'],
            'contenu16' => ['un', 'une', 'le', 'la', 'je', 'il'],
            'contenu17' => ['la lune', 'une pile', 'un vélo', 'il rame', 'un robot', 'une rue', 'un café', 'le défilé', 'la fumée', 'une rafale', 'le judo', 'une jupe', 'je fume', 'le sol', 'le fil', 'un mur', 'un bar'],
            'contenu16_bilan' =>  ['un', 'une', 'le', 'la', 'je'],

            //contenu etape 3
            'contenu18' => ['va', 've', 'vi', 'vo', 'vu' , 'vé'],
            'contenu19' => ['un vélo', 'il vole', 'il lave', 'la vie', 'une rive' , 'il va'],
            'contenu20' => ['un vélo', 'il vole', 'il lave', 'la vie', 'une revue' , 'il va'],
            'contenu21' => ['vélo', 'vole', 'lave', 'rive'],
            'contenu22' => ['ba', 'be', 'bi', 'bo', 'bu', 'bé'],
            'contenu23' => ['un bébé', 'un lavabo', 'un bol', 'une robe', 'un robot', 'il bave'],
            'contenu24' => ['un bébé', 'un lavabo', 'un bol', 'une robe', 'un robot', 'il bave'],
            'contenu25' => ['bébé', 'lavabo', 'robe', 'bave'],
            'contenu26' => ['bou', 'vou', 'jou', 'fou', 'lou', 'rou'],
            'contenu27' => ['il joue', 'la foule', 'une roue', 'un bijou', 'la boue', 'il roule'],
            'contenu28' => ['foule', 'roule', 'bijou'],
            'contenu29' => ['un fil', 'un bol', 'un bar', 'le jour', 'un four'],
            'contenu30' => ['la barbe', 'une fourmi', 'il filme', 'une larme'],

            //contenu etape 4
            'contenu31' => ['cha', 'che', 'chi', 'cho', 'chu', 'ché', 'chou'],
            'contenu32' => ['un chat', 'la bouche', 'un chou', 'une vache', 'un cheval', 'une fiche'],
            'contenu33' => ['la bouche', 'un cheval', 'un achat', 'du chocolat', 'une chute', 'la Chine'],
            'contenu34' => ['bouche', 'cheval', 'vache', 'fiche'],
            'contenu35' => ['pa', 'pe', 'pi', 'po', 'pu', 'pé', 'pou'],
            'contenu36' => ['une poche', 'la purée', 'il parle', 'une pile', 'un pavé', 'une jupe'],
            'contenu37' => ['un tapis', 'la soupe', 'une épée'],
            'contenu38' => ['poche', 'parle', 'pile', 'pavé', 'jupe'],
            'contenu39' => ['pla', 'bla', 'ple', 'ble', 'pro', 'bro', 'vre'],
            'contenu40' => ['un plat', 'un bras', 'le prix', 'un pro', 'il plie', 'un livre'],
            'contenu41' => ['une table', 'un arbre'],
            'contenu42' => ['est', 'il est', 'elle est', 'c\'est'],
            'contenu43' => ['il est fort', 'elle est partie', 'c\'est joli', 'il est midi', 'elle est malade', 'c\'est libre'],

            //contenu etape 5
            'contenu44' => ['ta', 'te', 'ti', 'to', 'tu', 'té', 'tou'],
            'contenu45' => ['un tapis', 'une tache', 'elle est partie', 'une tarte', 'une télé', 'une vitre'],
            'contenu46' => ['la data', 'un tube', 'une tomate', 'un tapis', 'une tache', 'il est parti', 'une tarte', 'une télé', 'une vitre'],
            'contenu47' => ['tapis', 'tache', 'parti', 'tarte', 'télé', 'vitre'],
            'contenu48' => ['ma', 'me', 'mi', 'mo', 'mu', 'mé', 'mou'],
            'contenu49' => ['la fumée', 'un matelas', 'un mur', 'une mouche', 'une fourmi', 'il marche'],
            'contenu50' => ['une moto', 'une tomate'],
            'contenu51' => ['moto', 'tomate', 'mouche', 'fourmi', 'marche', 'matelas'],
            'contenu52' => ['da', 'de', 'di', 'do', 'du', 'dé', 'dou'],
            'contenu53' => ['mardi', 'elle est malade', 'il est midi', 'un dé', 'la date', 'la douche'],
            'contenu54' => ['il dort', 'il est tordu', 'mardi', 'elle est malade', 'il est midi', 'elle déchire', 'la date', 'la douche'],
            'contenu55' => ['mardi', 'malade', 'midi', 'dé', 'douche', 'date'],
            'contenu56' => ['eu', 'deu', 'feu', 'jeu', 'bleu', 'pleu'],
            'contenu57' => ['un euro', 'deux', 'jeudi', 'un feu', 'un feutre', 'un jeu'],




        ];

        $plagesIndex = [
            //contenu etape 1  [idMinExercice, idMaxExercice, contenu, idSequence]
            [0, 5, 'contenu1', 0],
            [6, 11, 'contenu2', 1],
            [12, 17, 'contenu3', 2],
            [18, 21, 'contenu4', 2],
            [22, 27, 'contenu5', 3],
            [28, 31, 'contenu6', 3],
            [32, 37, 'contenu7', 4],
            [38, 39, 'contenu8', 4],
            [40, 40, 'contenu2', 5],
            [41, 41, ['contenu3', 'contenu2'], 5],
            [42, 42, ['contenu5', 'contenu3'], 5],
            [43, 43, ['contenu7', 'contenu7_intrus'], 5],
            [44, 44, 'contenu9',  5],


            //contenu etape 2
            [45, 50, 'contenu9', 6],
            [51, 56, 'contenu10', 7],
            [57, 58, 'contenu11', 7],
            [59, 60, 'contenu11', 7],
            [61, 66, 'contenu12', 8],
            [67, 68, 'contenu13', 8],
            [69, 70, 'contenu13', 8],
            [71, 76, 'contenu14', 9],
            [77, 78, 'contenu15', 9],
            [79, 80, 'contenu15', 9],
            [81, 86, 'contenu16', 10],
            [87, 87, 'contenu17', 10],
            [88, 88, ['contenu10', 'contenu5'], 11],
            [89, 89, ['contenu12', 'contenu10'], 11],
            [90, 90, ['contenu14', 'contenu5', 'contenu3'], 11],
            [91, 91, ['contenu16_bilan', 'contenu14'], 11],


            //contenu etape 3
            [92, 97, ['contenu18'], 12],
            [92, 97, ['contenu18'], 12],
            [98, 100, ['contenu19'], 12],
            [101, 102, ['contenu20'], 12],
            [103, 105, ['contenu21'], 12],
            [106, 111, ['contenu22'], 13],
            [112, 115, ['contenu23'], 13],
            [116, 118, ['contenu25'], 13],
            [119, 124, ['contenu26'], 14],
            [125, 128, ['contenu27'], 14],
            [129, 131, ['contenu28'], 14],
            [132, 137, ['contenu29'], 15],
            [138, 141, ['contenu30'], 15],
            [142, 142, ['contenu18' , 'contenu22', 'contenu5'], 16],
            [143, 143, ['contenu22', 'contenu18' ,'contenu5'], 16],
            [144, 144, ['contenu26', 'contenu22', 'contenu18' ,'contenu5'], 16],
            [145, 145, ['contenu29', 'contenu22', 'contenu18' ,'contenu5'], 16],

            //contenu etape 4
            [146, 151, ['contenu31'], 17],
            [152, 154, ['contenu32'], 17],
            [155, 156, ['contenu33'], 17],
            [157, 159, ['contenu34'], 17],
            [160, 165, ['contenu35'], 18],
            [166, 168, ['contenu36'], 18],
            [169, 170, ['contenu36', 'contenu37'], 18],
            [171, 173, ['contenu38'], 18],
            [174, 179, ['contenu39'], 19],
            [180, 182, ['contenu40'], 19],
            [183, 184, ['contenu40', 'contenu41'], 19],
            [185, 190, ['contenu42'], 20],
            [191, 194, ['contenu43'], 20],
            [195, 195, ['contenu31'], 21],
            [196, 196, ['contenu35'], 21],
            [197, 197, ['contenu39'], 21],
            [198, 198, ['contenu42'], 21],

            //contenu etape 5









        ];

        $lesExercices = $this->getReferenceByPrefixForExercice('exercice_', 0, 50);
        $sequences = $this->getReferenceByPrefixForSequence('sequence', 50);

        if (empty($lesExercices)) {
            throw new \Exception("Aucun exercice n'a été trouvé.");
        }

        foreach ($plagesIndex as [$start, $end, $contenuKey, $sequenceIndex]) {
            foreach (range($start, $end) as $index) {
                if (isset($lesExercices[$index])) {

                    $exercice = $lesExercices[$index];
                    $contenusArray = [];
                    if (is_array($contenuKey)) {
                        foreach ($contenuKey as $key) {
                            if (isset($contenus[$key])) {
                                $contenusArray = array_merge($contenusArray, $contenus[$key]);
                            }
                        }
                    } else {
                        $contenusArray = $contenus[$contenuKey] ?? [];
                    }
                    $this->createContenus($contenusArray, $exercice, $sequences[$sequenceIndex], $manager);
                }
            }
        }

        $manager->flush();
    }

    public function createContenus(array $contenusArray, $exercice, $sequence, ObjectManager $manager): void
    {
        foreach ($contenusArray as $contenu) {
            $leContenu = new Contenu();
            $leContenu->setContenu($contenu);
            $leContenu->setAudioUrl("");
            $leContenu->setImageUrl("");
            $leContenu->setExercice($exercice);
            $leContenu->setSequence($sequence);
            $manager->persist($leContenu);
        }
    }

    private function getReferenceByPrefixForExercice(string $prefix,int $min, int $max)
    {
        $references = [];
        for ($i = $min; $i <= $max; $i++) {
            $index = 0;
            while (true) {
                $refName = $prefix . $i . '_' . $index;
                try {
                    $references[] = $this->getReference($refName);
                } catch (OutOfBoundsException $e) {
                    break;
                }
                $index++;
            }
        }
        return $references;
    }


    private function getReferenceByPrefixForSequence(string $prefix, int $max)
    {
        $references = [];
        for ($i = 0; $i <= $max; $i++) {
            $refName = $prefix . $i;
            try {
                $references[] = $this->getReference($refName);
            } catch (OutOfBoundsException $e) {
            }
        }
        return $references;
    }
}
