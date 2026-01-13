<?php

namespace App\Controller;

use App\Dto\RegistrationDto;
use App\Entity\AccountProfile;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ApiSecurityController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user): Response
    {

        if (null === $user) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Missing credentials'
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        if (!$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Invalid login request: check that the Content-Type header is "application/json"'
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $accountProfile = $user->getAccountProfile();
        // Ne doit pas arriver car on lie un User à un AccountProfile dès la création du User
        if (null === $accountProfile) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Your user account is not linked to an account profile.'
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $this->json([
            'success' => true,
            'message' => 'You have been logged in',
            'data' => [
                'id' => $user->getId(),
                'username' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
                'accountId' => $accountProfile->getId(),
            ],
        ]);
    }


    #[Route('/api/check', name: 'api_check', methods: ['GET'])]
    public function check(#[CurrentUser] ?User $user): Response
    {
        if (null === $user) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'You must be logged in to access this ressource.'
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        return $this->json([
            'success' => true,
            'message' => 'You are logged in',
            'data' => [
                'id' => $user->getId(),
                'username' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
                'accountId' => $user->getAccountProfile()->getId(),
            ],
        ]);
    }

    /**
     * @throws \Exception
     */
    #[Route('/api/logout', name: 'api_logout')]
    public function logout(): Response
    {
        throw new \Exception('This should not be reached!');
    }


    #[Route('/api/logout_target', name: 'api_logout_target')]
    public function logoutTarget(): Response
    {
        // Redirection vers le formulaire de login React après déconnexion
        return $this->redirect('/login');
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $hasher, ValidatorInterface $validator, EntityManagerInterface $em, UserRepository $userRepo): Response
    {
        // Obtention des données envoyées dans le corps de la requête (en traitant l'erreur de désérialisation JSON)
        try {
            $registrationData = $request->toArray();
        } catch (JsonException $e) {
            return $this->json(
                [
                    'success' => false,
                    'message' => $e->getMessage()
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Transport des données dans un DTO pour validation
        $dto = new RegistrationDto($registrationData);
        $validationErrors = [];

        // 1. Validation des données du DTO
        $violations = $validator->validate($dto);

        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $validationErrors[] = [
                    'property' => $violation->getPropertyPath(),
                    'message' => $violation->getMessage(),
                ];
            }
        }

        // 2. Unicité du nom d'utilisateur
        $existingUser = $userRepo->findOneBy(['username' => $dto->getUsername()]);
        if (null !== $existingUser) {
            $validationErrors[] = [
                'property' => 'username',
                'message' => 'Ce nom d\'utilisateur est déjà pris.',
            ];
        }

        // S'il y a des erreurs de validation, on les renvoie
        if (count($validationErrors) > 0) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Validation errors occurred.',
                    'errors' => $validationErrors,
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        // On peut enfin créer l'utilisateur
        $user = new User();
        $user->setUsername($dto->getUsername());
        $hashedPassword = $hasher->hashPassword($user, $dto->getPassword());
        $user->setPassword($hashedPassword);

        // On lui associe un profil de compte
        $accountProfile = new AccountProfile();
        $accountProfile->setFirstname($dto->getFirstname());
        $accountProfile->setLastname($dto->getLastname());
        $accountProfile->setUser($user);
        $user->setAccountProfile($accountProfile);

        $em->persist($user);
        $em->persist($accountProfile);

        $em->flush();

        return $this->json(
            [
                'success' => true,
                'message' => "User registered successfully.",
                'data' => [
                    'id' => $user->getId(),
                    'username' => $user->getUserIdentifier(),
                    'roles' => $user->getRoles(),
                    'accountId' => $accountProfile->getId(),
                ],
            ]
        );
    }
}
