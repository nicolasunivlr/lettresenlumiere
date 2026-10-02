<?php

namespace App\Service;

use App\Repository\AppSettingRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Gère l'état du mode démo de l'application.
 * En mode démo, la création de comptes utilisateur depuis le backoffice est bloquée.
 */
class DemoModeService
{
    public function __construct(
        private AppSettingRepository $appSettingRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function isEnabled(): bool
    {
        return $this->appSettingRepository->getSettings()->isDemoMode();
    }

    public function setEnabled(bool $enabled): void
    {
        $settings = $this->appSettingRepository->getSettings();
        $settings->setDemoMode($enabled);
        $this->entityManager->flush();
    }

    public function toggle(): bool
    {
        $settings = $this->appSettingRepository->getSettings();
        $settings->setDemoMode(!$settings->isDemoMode());
        $this->entityManager->flush();

        return $settings->isDemoMode();
    }
}
