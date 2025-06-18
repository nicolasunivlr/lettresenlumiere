<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\CouleurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CouleurRepository::class)]
#[ApiResource(
    new Get(),
    new GetCollection(),
)]
class Couleur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $code = null;




    // La relation OneToMany avec ContenuFormat
    #[ORM\OneToMany(mappedBy: 'couleur', targetEntity: ContenuFormat::class)]
    private Collection $contenuFormats;

    public function __construct()
    {
        $this->contenuFormats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;
        return $this;
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
            $contenuFormat->setCouleur($this);
        }

        return $this;
    }

    public function removeContenuFormat(ContenuFormat $contenuFormat): static
    {
        if ($this->contenuFormats->removeElement($contenuFormat)) {
            if ($contenuFormat->getCouleur() === $this) {
                $contenuFormat->setCouleur(null);
            }
        }

        return $this;
    }


}
