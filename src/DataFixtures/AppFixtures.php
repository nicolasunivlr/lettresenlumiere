<?php

namespace App\DataFixtures;

use App\Entity\Etape;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        for ($i = 1; $i <= 18; $i++) {
            $etape = new Etape();
            $etape->setNom('Étape ' . $i);
            $manager->persist($etape);
            $this->addReference('etape'.$i, $etape);

        }

        $manager->flush();
    }
}
