<?php

namespace App\Controller\Admin;

use App\Service\DemoModeService;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DemoModeController extends AbstractController
{
    public function __construct(
        private DemoModeService $demoModeService,
    ) {
    }

    #[Route('/admin/demo-mode', name: 'admin_demo_mode_page', methods: ['GET'])]
    public function showPage(): Response
    {
        return $this->render('admin/demo_mode.html.twig', [
            'demoModeEnabled' => $this->demoModeService->isEnabled(),
        ]);
    }

    #[Route('/admin/demo-mode/toggle', name: 'admin_demo_mode_toggle', methods: ['POST'])]
    public function toggle(Request $request, AdminUrlGenerator $adminUrlGenerator): Response
    {
        if (!$this->isCsrfTokenValid('toggle_demo_mode', (string) $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
        } else {
            $enabled = $this->demoModeService->toggle();

            if ($enabled) {
                $this->addFlash('success', 'Le mode démo est maintenant activé : la création de comptes utilisateur est bloquée.');
            } else {
                $this->addFlash('success', 'Le mode démo est maintenant désactivé : la création de comptes utilisateur est de nouveau autorisée.');
            }
        }

        $url = $adminUrlGenerator->setDashboard(DashboardController::class)
            ->setRoute('admin_demo_mode_page')
            ->generateUrl();

        return $this->redirect($url);
    }
}
