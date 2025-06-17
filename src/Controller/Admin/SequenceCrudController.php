<?php

namespace App\Controller\Admin;

use App\Entity\Sequence;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;

class SequenceCrudController extends AbstractCrudController
{
    private AdminUrlGenerator $adminUrlGenerator;

    public function __construct(AdminUrlGenerator $adminUrlGenerator)
    {
        $this->adminUrlGenerator = $adminUrlGenerator;
    }

    public static function getEntityFqcn(): string
    {
        return Sequence::class;
    }

    public function configureActions(Actions $actions): Actions
    {
        $addExercice = Action::new('addExercice', 'Ajouter un exercice')
            ->linkToCrudAction('addExercice')
            ->displayAsLink();

        return $actions
            ->add(Crud::PAGE_DETAIL, $addExercice)
            ->add(Crud::PAGE_INDEX, Action::DETAIL);
    }

    public function configureFields(string $pageName): iterable
    {
        yield TextField::new('nom')->setLabel('Nom de la séquence');

        yield AssociationField::new('exercices')
            ->setLabel('Exercices')
            ->setFormTypeOption('by_reference', false)
            ->hideOnForm();
    }

    public function addExercice(AdminContext $context): Response
    {
        // Vérifier si l'entité existe dans le contexte
        if (!$context->getEntity() || !$context->getEntity()->getInstance()) {
            // Si l'entité n'est pas disponible, rediriger vers la liste des séquences
            return $this->redirect($this->adminUrlGenerator
                ->setController(self::class)
                ->setAction(Action::INDEX)
                ->generateUrl());
        }

        $sequence = $context->getEntity()->getInstance();

        // Rediriger vers la page de création d'un nouvel exercice avec la séquence présélectionnée
        return $this->redirect($this->adminUrlGenerator
            ->setController(ExerciceCrudController::class)
            ->setAction(Action::NEW)
            ->set('sequence', $sequence->getId())
            ->generateUrl());
    }
}
