<?php

namespace App\Controller\Admin;

use App\Entity\Sequence;
use App\Repository\EtapeRepository;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Config\KeyValueStore;
use Symfony\Component\HttpFoundation\Response;

class SequenceCrudController extends AbstractCrudController
{

    public function __construct(private AdminUrlGenerator $adminUrlGenerator, private EtapeRepository $etapeRepository)
    {
    }

    public static function getEntityFqcn(): string
    {
        return Sequence::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        $crud->setDefaultSort(['etape' => 'ASC', 'ordre' => 'ASC']);
        $crud->overrideTemplate('crud/index', 'admin/crud/index_etape.html.twig');
        return $crud;
    }

    public function configureFilters(Filters $filters): Filters
    {
        $filters->add('etape');
        return $filters;
    }

    public function configureResponseParameters(KeyValueStore $responseParameters): KeyValueStore
    {
        if (Crud::PAGE_INDEX === $responseParameters->get('pageName')) {
            $responseParameters->set('etapes', $this->etapeRepository->findAll());
        }

        return $responseParameters;
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

        yield AssociationField::new('etape')->setLabel('Étape');
        yield NumberField::new('ordre')->setLabel('Ordre')
            ->setHelp('Ordre d\'affichage de la séquence dans l\'étape');

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
