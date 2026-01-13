<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    /**
     * Route racine pour servir l'application React
     */
    #[Route('/', name: 'app_default')]
    public function index(): Response
    {
        return $this->render("default/index.html.twig", [
        ]);
    }

    /**
     * Route catch-all pour servir l'application React sur toutes les routes React
     * Cette route doit être en dernier pour ne pas intercepter les routes API et admin
     */
    #[Route('/{reactRouting}', name: 'app_react_catchall', requirements: ['reactRouting' => '^(?!api|admin|build|_profiler|_wdt).+'], priority: -1)]
    public function reactRouting(string $reactRouting): Response
    {
        return $this->render("default/index.html.twig", [
        ]);
    }
}
