<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

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
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(): Response
    {
        return $this->json(
            [
                'success' => false,
                'message' => 'User registration is not allowed.'
            ],
            Response::HTTP_FORBIDDEN
        );
    }
}
