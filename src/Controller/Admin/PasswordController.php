<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\ChangePasswordForm;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class PasswordController extends AbstractController
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    )
    {}

    #[Route('/admin/change-password', name: 'admin_change_password')]
    public function changePassword(
        Request $request,
        AdminUrlGenerator $adminUrlGenerator,
        EntityManagerInterface $entityManager,
        #[CurrentUser]
        User $user
    ): Response
    {
        $form = $this->createForm(ChangePasswordForm::class, $user);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $newPassword = $form->get('password')->getData();
            $confirmPassword = $form->get('confirm_password')->getData();

            if ($newPassword !== $confirmPassword) {
                $this->addFlash('danger', 'Les mots de passe ne correspondent pas.');
                $url = $adminUrlGenerator->setAction('index')
                    ->setDashboard(DashboardController::class)
                    ->setRoute('admin_change_password')
                    ->generateUrl();
                return $this->redirect($url);
            }

            // Hash the new password
            $hashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
            $user->setPassword($hashedPassword);

            // Save the user entity
            $entityManager->flush();

            // Add a success message
            $this->addFlash('success', 'Le mot de passe a été changé avec succès.');

            // Redirect to the dashboard or any other page
            return $this->redirect($adminUrlGenerator->setAction('index')->generateUrl());
        }
        return $this->render('admin/change_password.html.twig', [
            'form' => $form,
        ]);
    }
}
