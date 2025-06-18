<?php

// src/Entity/Etape.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\EtapeRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;



#[ApiResource(
    new Get(),
    new GetCollection(),
    normalizationContext: ['groups' => ['etape:read']],
    denormalizationContext: ['groups' => ['etape:write']],
)]
#[ORM\Entity(repositoryClass: EtapeRepository::class)]
class Etape
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['etape:read', 'sequence:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['etape:read', 'sequence:read'])]
    private ?string $nom = null;

    #[ORM\OneToMany(mappedBy: 'etape', targetEntity: Sequence::class)]
    #[Groups(['etape:read'])]
    private $sequences;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getSequences(): Collection
    {
        return $this->sequences;
    }

    public function addSequence(Sequence $sequence): static
    {
        if (!$this->sequences->contains($sequence)) {
            $this->sequences->add($sequence);
            $sequence->setEtape($this);
        }

        return $this;
    }

    public function removeSequence(Sequence $sequence): static
    {
        if ($this->sequences->removeElement($sequence)) {
            if ($sequence->getEtape() === $this) {
                $sequence->setEtape(null);
            }
        }

        return $this;
    }

    public function __toString(): string
    {
        return $this->nom;
    }
}
