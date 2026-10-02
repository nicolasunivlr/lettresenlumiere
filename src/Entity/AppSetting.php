<?php

namespace App\Entity;

use App\Repository\AppSettingRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Réglages globaux de l'application (ligne unique, id = 1).
 */
#[ORM\Entity(repositoryClass: AppSettingRepository::class)]
class AppSetting
{
    #[ORM\Id]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Mode démo : empêche la création de nouveaux comptes utilisateur depuis le backoffice.
     */
    #[ORM\Column]
    private bool $demoMode = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;
        return $this;
    }

    public function isDemoMode(): bool
    {
        return $this->demoMode;
    }

    public function setDemoMode(bool $demoMode): static
    {
        $this->demoMode = $demoMode;
        return $this;
    }
}
