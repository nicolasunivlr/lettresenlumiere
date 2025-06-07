<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Sequence;

class BSequenceFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $nomSequences = [
            'A - E - I',
            'O - U - É',
            'L',
            'R',
            'IL - OR',
            'BILAN 1'
        ];

        $nomSequences2 = [
            'LETTRE MUETTE',
            'F',
            'J',
            'IL - FIL',
            'UN - UNE',
            'BILAN 2'
        ];

        $nomSequences3 = [
            'V',
            'B',
            'OU',
            'BAR',
            'BILAN 3'
        ];

        $nomSequences4 = [
            'CH',
            'P',
            'BRA',
            'IL EST - ELLE EST - C\'EST',
            'BILAN 4'
        ];

        $nomSequences5 = [
            'T',
            'M',
            'D',
            'EU',
            'BILAN 5'
        ];

        $nomSequences6 = [
            'DRA',
            'N',
            'GN',
            'Z',
            'BILAN 6'
        ];

        $nomSequences7 = [
            'S - SS',
            'S - Z',
            'DES - LES - MES - TES - SES',
            'C - K - QU',
            'G - GU',
            'BILAN 7'
        ];

        $nomSequences8 = [
            'UN',
            'AN - EN',
            'ON',
            'IN',
            'AM - EM - OM - IM',
            'BILAN 8'
        ];

        $nomSequences9 = [
            'OI',
            'OIN',
            'UI',
            'Y - I',
            'BILAN 9'
        ];

        $nomSequences10 = [
            'À - Â - Ô',
            'O - AU - EAU',
            'EU - ŒU',
            'IL - A - EU',
            '-NT',
            'BILAN 10'
        ];

        $nomSequences11 = [
            'È - Ê - Ë',
            'ELL - ERR - ESS',
            'ES - ER - EC',
            '-ER -EZ -ET',
            'AI - EI',
            'BILAN 11'
        ];

        $nomSequences12 = [
            'PH',
            'H',
            'CE - CI - Ç',
            'a changer manque de donnée',
            'BILAN 12'
        ];

        $nomSequences13 = [
            'CIEL - PIED',
            'X',
            'AIN - EIN',
            'YN - YM - UM',
            'IEN - ÉEN',
            'BILAN 13'
        ];

        $nomSequences14 = [
            'TI = SI',
            'AY - OY - EY - UY',
            '-IL',
            '-ILLE',
            'BILAN 14'
        ];

        $nomSequences15 = [
            'LL',
            'FF - PP - RR - TT',
            'CC - GG',
            'MM - NN',
            'BILAN 15'
        ];

        $nomSequences16 = [
            '-AMM -EMM',
            'Ï',
            'W',
            '-ER -ET',
            'BILAN 16'
        ];

        $nomSequences17 = [
            'LETTRES FINALES',
            'MOTS IRRÉGULIERS 1',
            'CK - CU - CQU - CH',
            'GUA - QUA',
            'BILAN 17'
        ];

        $nomSequences18 = [
            'MOTS IRRÉGULIERS 2',
            'OO',
            'MOTS ANGLAIS',
            'MOTS IRRÉGULIERS 3',
            'BILAN 18'
        ];




        $etape1 = $this->getReference('etape1');
        $etape2 = $this->getReference('etape2');
        $etape3 = $this->getReference('etape3');
        $etape4 = $this->getReference('etape4');
        $etape5 = $this->getReference('etape5');
        $etape6 = $this->getReference('etape6');
        $etape7 = $this->getReference('etape7');
        $etape8 = $this->getReference('etape8');
        $etape9 = $this->getReference('etape9');
        $etape10 = $this->getReference('etape10');
        $etape11 = $this->getReference('etape11');
        $etape12 = $this->getReference('etape12');
        $etape13 = $this->getReference('etape13');
        $etape14 = $this->getReference('etape14');
        $etape15 = $this->getReference('etape15');
        $etape16 = $this->getReference('etape16');
        $etape17 = $this->getReference('etape17');
        $etape18 = $this->getReference('etape18');

        $sequenceCounter = 1;

        for ($i = 1; $i <= 79; $i++) {
            $video_url = "/SEQUENCE" . $i . ".mp4";

        }

        $videoCounter = 1;


        if ($etape1) {
            foreach ($nomSequences as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape1);
                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);

                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape2){
            foreach ($nomSequences2 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape2);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }


                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape3){
            foreach ($nomSequences3 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape3);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }


                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape4){
            foreach ($nomSequences4 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape4);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape5){
            foreach ($nomSequences5 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape5);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }
        if($etape6){
            foreach ($nomSequences6 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape6);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape7){
            foreach ($nomSequences7 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape7);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape8){
            foreach ($nomSequences8 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape8);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape9){
            foreach ($nomSequences9 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape9);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape10){
            foreach ($nomSequences10 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape10);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape11){
            foreach ($nomSequences11 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape11);
                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }


        if($etape12){
            foreach ($nomSequences12 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape12);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape13){
            foreach ($nomSequences13 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape13);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape14){
            foreach ($nomSequences14 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape14);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape15){
            foreach ($nomSequences15 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape15);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape16){
            foreach ($nomSequences16 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape16);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape17){
            foreach ($nomSequences17 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape17);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        if($etape18){
            foreach ($nomSequences18 as $index => $nomSequence) {
                $sequence = new Sequence();
                $sequence->setNom($nomSequence);
                $sequence->setEtape($etape18);

                if(stripos($nomSequence, "BILAN") !== false) {
                    $sequence->setVideoUrl(null);
                }else{
                    $sequence->setVideoUrl("/SEQUENCE" . $videoCounter . ".mp4");
                    $videoCounter++;
                }

                $manager->persist($sequence);
                $this->addReference('sequence'.$sequenceCounter, $sequence);
                $sequenceCounter++;
            }
        }

        $manager->flush();
    }
}
