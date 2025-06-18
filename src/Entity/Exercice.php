<?php

// src/Entity/Exercice.php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\ExerciceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
    ],
    normalizationContext: ['groups' => ['exercice:read']],
    denormalizationContext: ['groups' => ['exercice:write']],
)]
#[ORM\Entity(repositoryClass: ExerciceRepository::class)]
class Exercice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['exercice:read', 'sequence:read', 'contenu:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['exercice:read', 'sequence:read'])]
    #[SerializedName("type")]
    private ?string $type_exercice = null;

    #[ORM\ManyToOne(targetEntity: Sequence::class, inversedBy: 'exercices')]
    #[ORM\JoinColumn(name: "sequence_id", referencedColumnName: "id", nullable: false)]
    #[Groups(['exercice:read', 'exercice:write'])]
    private ?Sequence $sequence = null;

    #[ORM\ManyToMany(mappedBy: 'exercices', targetEntity: Contenu::class)]
    #[Groups(['exercice:read', 'sequence:read'])]
    private Collection $contenus;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(['exercice:read', 'exercice:write', 'sequence:read'])]
    private ?string $consigne = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['exercice:read', 'exercice:write'])]
    private ?int $ordre = null;

    public function __construct()
    {
        $this->contenus = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeExercice(): ?string
    {
        return $this->type_exercice;
    }

    public function setTypeExercice(string $type_exercice): static
    {
        $this->type_exercice = $type_exercice;
        return $this;
    }

    public function getSequence(): ?Sequence
    {
        return $this->sequence;
    }

    public function setSequence(?Sequence $sequence): static
    {
        $this->sequence = $sequence;
        return $this;
    }

    public function getContenus(): Collection
    {
        return $this->contenus;
    }

    public function getConsigne(): ?string
    {
        return $this->consigne;
    }

    public function setConsigne(?string $consigne): static
    {
        $this->consigne = $consigne;
        return $this;
    }

    public function getOrdre(): ?int
    {
        return $this->ordre;
    }

    public function setOrdre(?int $ordre): static
    {
        $this->ordre = $ordre;
        return $this;
    }

    public function __toString(): string
    {
        return $this->type_exercice;
    }

    public function addContenu(Contenu $contenu): static
    {
        if (!$this->contenus->contains($contenu)) {
            $this->contenus[] = $contenu;
            $contenu->addExercice($this);
        }

        return $this;
    }

    public function removeContenu(Contenu $contenu): static
    {
        if ($this->contenus->removeElement($contenu)) {
            $contenu->removeExercice($this);
        }

        return $this;
    }

}
