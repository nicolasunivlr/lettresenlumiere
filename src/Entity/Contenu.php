<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\ContenuRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
    ],
    normalizationContext: ['groups' => ['contenu:read']],
    denormalizationContext: ['groups' => ['contenu:write']]
)]
#[ORM\Entity(repositoryClass: ContenuRepository::class)]
class Contenu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['contenu:read', 'exercice:read', 'contenu:write', 'sequence:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['contenu:read', 'contenu:write', 'exercice:read'])]
    private ?string $contenu = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['contenu:read', 'contenu:write', 'sequence:read'])]
    private ?string $image_url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['contenu:read', 'contenu:write', 'sequence:read'])]
    private ?string $audio_url = null;

    #[ORM\ManyToMany(targetEntity: Exercice::class, inversedBy: 'contenus')]
    #[ORM\JoinTable(name: 'contenu_exercice')]
    #[Groups(['contenu:read', 'contenu:write'])]
    private Collection $exercices;

    #[ORM\ManyToOne(targetEntity: Sequence::class, inversedBy: 'contenus')]
    #[ORM\JoinColumn(name: "sequence_id", referencedColumnName: "id", nullable: false)]
    #[Groups(['contenu:read', 'contenu:write'])]
    private ?Sequence $sequence = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['sequence:read'])]
    private ?string $syllabes = null;

    /**
     * @var Collection<int, ContenuFormat>
     */
    #[ORM\OneToMany(targetEntity: ContenuFormat::class, mappedBy: 'contenu', cascade: ["persist", "remove"], orphanRemoval: true)]
    #[Groups(['contenu:read', 'contenu:write', 'sequence:read'])]
    private Collection $contenuFormats;

    public function __construct()
    {
        $this->exercices = new ArrayCollection();
        $this->contenuFormats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;
        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->image_url;
    }

    public function setImageUrl(?string $image_url): static
    {
        $this->image_url = $image_url;
        return $this;
    }

    public function getAudioUrl(): ?string
    {
        return $this->audio_url;
    }

    public function setAudioUrl(?string $audio_url): static
    {
        $this->audio_url = $audio_url;
        return $this;
    }

    public function getExercices(): Collection
    {
        return $this->exercices;
    }

    public function addExercice(Exercice $exercice): self
    {
        if (!$this->exercices->contains($exercice)) {
            $this->exercices->add($exercice);
        }
        return $this;
    }

    public function removeExercice(Exercice $exercice): self
    {
        $this->exercices->removeElement($exercice);
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

    public function getSyllabes(): ?string
    {
        return $this->syllabes;
    }

    public function setSyllabes(?string $syllabes): static
    {
        $this->syllabes = $syllabes;
        return $this;
    }

    public function getLettres(): string
    {
        $lettres = [];
        foreach ($this->contenuFormats as $contenuFormat) {
            if ($contenuFormat->getLettres()) {
                $lettres[] = $contenuFormat->getLettres();
            }
        }
        return implode(', ', $lettres);
    }

    /**
     * @return Collection<int, ContenuFormat>
     */
    public function getContenuFormats(): Collection
    {
        return $this->contenuFormats;
    }

    public function addContenuFormat(ContenuFormat $contenuFormat): static
    {
        if (!$this->contenuFormats->contains($contenuFormat)) {
            $this->contenuFormats->add($contenuFormat);
            $contenuFormat->setContenu($this);
        }

        return $this;
    }

    public function removeContenuFormat(ContenuFormat $contenuFormat): static
    {
        if ($this->contenuFormats->removeElement($contenuFormat)) {
            if ($contenuFormat->getContenu() === $this) {
                $contenuFormat->setContenu(null);
            }
        }

        return $this;
    }
}

