<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SequenceRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
#[ApiResource(
    normalizationContext: ['groups' => ['sequence:read']],
    denormalizationContext: ['groups' => ['sequence:write']],
    paginationItemsPerPage: 10,
    paginationMaximumItemsPerPage: 50,
)
]
#[ORM\Entity(repositoryClass: SequenceRepository::class)]
class Sequence
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sequence:read', 'etape:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sequence:read', 'sequence:write', 'exercice:read', 'etape:read'])]
    private ?string $nom = null;


    #[ORM\ManyToOne(targetEntity: Etape::class)]
    #[ORM\JoinColumn(name: "etape_id", referencedColumnName: "id", nullable: false)]
    #[Groups(['sequence:write'])]
    private ?Etape $etape = null;

    #[ORM\OneToMany(mappedBy: "sequence", targetEntity: Exercice::class)]
    #[Groups(['sequence:read', 'exercice:read'])]
    private Collection $exercices;

    #[ORM\OneToMany(mappedBy: "sequence", targetEntity: Contenu::class)]
    private Collection $contenus;


    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['sequence:read'])]
    private ?string $video_url = null;

    public function __construct()
    {
        $this->exercices = new ArrayCollection();
        $this->contenus = new ArrayCollection();
    }

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

    public function getEtape(): ?Etape
    {
        return $this->etape;
    }

    public function setEtape(?Etape $etape): static
    {
        $this->etape = $etape;

        return $this;
    }

    public function getExercices(): Collection
    {
        return $this->exercices;
    }

    public function getContenus(): Collection{
        return $this->contenus;
    }


    public function getVideoUrl(): ?string
    {
        return $this->video_url;
    }

    public function setVideoUrl(?string $video_url): static
    {
        $this->video_url = $video_url;

        return $this;
    }

    public function __toString(): string
    {
        return $this->nom; // Ou toute autre propriété pertinente
    }

    public function addExercice(Exercice $exercice): static
    {
        if (!$this->exercices->contains($exercice)) {
            $this->exercices->add($exercice);
            $exercice->setSequence($this);
        }

        return $this;
    }

    public function removeExercice(Exercice $exercice): static
    {
        if ($this->exercices->removeElement($exercice)) {
            if ($exercice->getSequence() === $this) {
                $exercice->setSequence(null);
            }
        }

        return $this;
    }


    public function addContenu(Contenu $contenu): static
    {
        if (!$this->contenus->contains($contenu)) {
            $this->contenus->add($contenu);
            $contenu->setSequence($this);
        }
        return $this;
    }

    public function removeContenu(Contenu $contenu): static
    {
        if ($this->contenus->removeElement($contenu)) {
            if ($contenu->getSequence() === $this) {
                $contenu->setSequence(null);
            }
        }
        return $this;
    }

    // Méthode obsolète à maintenir temporairement pour la compatibilité
}
