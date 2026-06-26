<?php

namespace App\Controller\Admin;

use App\Entity\Contenu;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Security\Permission;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Logout\LogoutUrlGenerator;
use function Symfony\Component\Translation\t;

class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);
        return $this->redirect($adminUrlGenerator->setController(ContenuCrudController::class)->generateUrl());
    }

    public function configureActions(): Actions
    {
        $actions = parent::configureActions();
        return $actions
            ->setPermission(Action::DELETE, 'ROLE_ADMIN')
            ->update(Crud::PAGE_INDEX, Action::EDIT, function (Action $action) {
                return $action->setIcon('fa fa-edit')
                    ->addCssClass('btn btn-sm edit-icon')
                    ->setLabel(false);
            })
            ->update(Crud::PAGE_INDEX, Action::DELETE, function (Action $action) {
                return $action->setIcon('fa fa-trash')
                    ->addCssClass('btn btn-sm delete-icon')
                    ->setLabel(false);
            });
    }

    public function configureCrud(): Crud
    {
        $crud = parent::configureCrud();
        return $crud
            ->showEntityActionsInlined();
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Lettres en lumière');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Tableau de bord', 'fa fa-gauge');

        yield MenuItem::linkTo(EtapeCrudController::class,'Etape', 'fa fa-stairs');

        yield MenuItem::linkTo(ContenuCrudController::class,'Contenus', 'fa fa-folder-open');

        yield MenuItem::linkTo(SequenceCrudController::class, 'Séquence', 'fa fa-list-ol');

        yield MenuItem::linkTo(ExerciceCrudController::class, 'Exercice', 'fa fa-dumbbell');

        yield MenuItem::linkTo(UserCrudController::class, 'Utilisateurs', 'fa fa-user');

        yield MenuItem::linkTo(CouleurCrudController::class, 'Couleur', 'fa fa-palette');

        // Ajoutez un nouvel élément de menu pour l'exportation globale
        yield MenuItem::linkToRoute('Export Global', 'fa fa-download', 'admin_global_export');

        // Dans la méthode configureMenuItems()
        yield MenuItem::linkToRoute('Import Global', 'fa fa-upload', 'admin_global_import');

        yield MenuItem::linkToRoute('MAJ modèle', 'fa fa-up-long', 'admin_maj_site_page');

        yield MenuItem::linkToRoute('Retour au site', 'fa fa-arrow-left', 'app_default');
    }

    public function configureUserMenu(UserInterface $user): UserMenu
    {
        $userMenuItems = [];

        if (class_exists(LogoutUrlGenerator::class)) {
            $userMenuItems[] = MenuItem::section();
            $userMenuItems[] = MenuItem::linkToRoute('Changement de mot de passe', 'fa fa-key', 'admin_change_password');
            $userMenuItems[] = MenuItem::linkToLogout(t('user.sign_out', domain: 'EasyAdminBundle'), 'internal:sign-out');
        }
        if ($this->isGranted(Permission::EA_EXIT_IMPERSONATION)) {
            $userMenuItems[] = MenuItem::linkToExitImpersonation(t('user.exit_impersonation', domain: 'EasyAdminBundle'), 'internal:user-lock');
        }

        $userName = method_exists($user, '__toString') ? (string) $user : $user->getUserIdentifier();

        return UserMenu::new()
            ->displayUserName()
            ->displayUserAvatar()
            ->setName($userName)
            ->setAvatarUrl(null)
            ->setMenuItems($userMenuItems);
    }
}
