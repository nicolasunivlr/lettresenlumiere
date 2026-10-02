<?php

namespace App\Repository;

use App\Entity\AppSetting;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AppSetting>
 */
class AppSettingRepository extends ServiceEntityRepository
{
    /** Identifiant de la ligne unique de réglages */
    private const SINGLETON_ID = 1;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AppSetting::class);
    }

    /**
     * Récupère la ligne unique de réglages, en la créant si elle n'existe pas encore.
     */
    public function getSettings(): AppSetting
    {
        $settings = $this->find(self::SINGLETON_ID);

        if (!$settings) {
            $settings = new AppSetting();
            $settings->setId(self::SINGLETON_ID);
            $settings->setDemoMode(false);

            /** @var EntityManagerInterface $em */
            $em = $this->getEntityManager();
            $em->persist($settings);
            $em->flush();
        }

        return $settings;
    }
}
