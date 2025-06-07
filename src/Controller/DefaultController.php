<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function index(): Response
    {
        return $this->render("default/index.html.twig", [
        ]);
    }

    #[Route('/admin/maj-site', name: 'admin_maj_site')]
    public function maj(): Response
    {
        $this->addFlash('danger', 'Le site a rencontré un problème lors de la mis à jour !');
        $this->addFlash('success', 'Le site a été mis à jour avec succès !');
        return $this->redirectToRoute('admin');
    }
}
