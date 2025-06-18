<?php

namespace App\Entity;

use App\Repository\ContenuFormatRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;

#[ORM\Entity(repositoryClass: ContenuFormatRepository::class)]
class ContenuFormat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sequence:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sequence:read'])]
    private ?string $lettres = null;

    // La relation ManyToOne vers Couleur
    #[ORM\ManyToOne(targetEntity: Couleur::class, inversedBy: 'contenuFormats')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['sequence:read'])]
    private ?Couleur $couleur = null;

    #[ORM\ManyToOne(targetEntity: Contenu::class, inversedBy: 'contenuFormats')]
    private ?Contenu $contenu = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['sequence:read'])]
    private ?bool $bold = null;

    public function __toString(): string
    {
        // Si la couleur est définie et les lettres aussi, on retourne un format plus lisible
        if ($this->couleur && $this->lettres) {
            return sprintf('Lettres : \'%s\', Couleur: %s', 
                $this->lettres, 
                $this->couleur->getCode()
            );
        }
        // Si on n'a pas d'information, on retourne un libellé générique
        return 'Nouveau format';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLettres(): ?string
    {
        return $this->lettres;
    }

    public function setLettres(string $lettres): static
    {
        $this->lettres = $lettres;
        return $this;
    }

    public function getCouleur(): ?Couleur
    {
        return $this->couleur;
    }

    public function setCouleur(?Couleur $couleur): static
    {
        $this->couleur = $couleur;
        return $this;
    }

    public function getContenu(): ?Contenu
    {
        return $this->contenu;
    }

    public function setContenu(?Contenu $contenu): static
    {
        $this->contenu = $contenu;
        return $this;
    }

    public function getContenuFormatsLettres(Contenu $contenu): array
    {
        $contenuFormats = $contenu->getContenuFormats()->toArray();

        $lettres = [];

        foreach ($contenuFormats as $contenuFormat) {
            if ($contenuFormat instanceof ContenuFormat) {
                $lettres[] = $contenuFormat->getLettres();
            }
        }

        return $lettres;
    }

    public function isBold(): ?bool
    {
        return $this->bold;
    }
    
    // Ajout de cette méthode pour compatibilité
    public function getBold(): ?bool
    {
        return $this->isBold();
    }

    public function setBold(?bool $bold): static
    {
        $this->bold = $bold;

        return $this;
    }
}
