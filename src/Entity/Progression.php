<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\ProgressionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;


#[ORM\Entity(repositoryClass: ProgressionRepository::class)]
#[ApiResource]
#[UniqueEntity(
    fields: ['accountProfile', 'exercice'],
    message: 'Cet utilisateur a déjà une progression pour cet exercice.'
)]
class Progression
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['progression:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['progression:read'])]
    private ?int $score = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['progression:read'])]
    private ?Exercice $exercice = null;

    #[ORM\ManyToOne(inversedBy: 'progression')]
    #[ORM\JoinColumn(nullable: false)]
    private ?AccountProfile $accountProfile = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;

        return $this;
    }

    public function getExercice(): ?Exercice
    {
        return $this->exercice;
    }

    public function setExercice(?Exercice $exercice): static
    {
        $this->exercice = $exercice;

        return $this;
    }

    public function getAccountProfile(): ?AccountProfile
    {
        return $this->accountProfile;
    }

    public function setAccountProfile(?AccountProfile $accountProfile): static
    {
        $this->accountProfile = $accountProfile;

        return $this;
    }
}
