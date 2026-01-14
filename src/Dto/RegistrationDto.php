<?php

namespace App\Dto;

use App\Entity\User;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;


final class RegistrationDto
{
  #[Assert\NotBlank]
  private ?string $username = null;

  #[Assert\NotBlank]
  private ?string $password = null;

  #[Assert\NotBlank]
  private ?string $confirmPassword = null;

  #[Assert\NotBlank]
  private ?string $firstname = null;

  #[Assert\NotBlank]
  private ?string $lastname = null;

  public function __construct(array $data)
  {
    $this->username = $data['username'] ?? null;
    $this->password = $data['password'] ?? null;
    $this->confirmPassword = $data['confirmPassword'] ?? null;
    $this->firstname = $data['firstname'] ?? null;
    $this->lastname = $data['lastname'] ?? null;
  }

  public function getPassword(): ?string
  {
    return $this->password;
  }

  public function getConfirmPassword(): ?string
  {
    return $this->confirmPassword;
  }

  #[Assert\Callback]
  public function validatePasswords(ExecutionContextInterface $context): void
  {
    if ($this->password !== $this->confirmPassword) {
      $context
        ->buildViolation('Les mots de passe ne correspondent pas.')
        ->atPath('confirmPassword')
        ->addViolation();
    }
  }

  public function getUsername(): ?string
  {
    return $this->username;
  }

  public function getFirstname(): ?string
  {
    return $this->firstname;
  }

  public function getLastname(): ?string
  {
    return $this->lastname;
  }
}
