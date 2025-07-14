<?php

namespace App\Controller\Admin;

use App\Entity\Exercice;
use Doctrine\ORM\EntityRepository;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use App\Repository\ExerciceRepository;

class ExerciceCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Exercice::class;
    }

    public function __construct(private ExerciceRepository $exerciceRepository)
    {
    }

    public function configureFields(string $pageName): iterable
    {

        yield AssociationField::new('sequence')
            ->setLabel('Séquence')
            ->setFormTypeOptions([
                'choice_label' => 'nom',
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('s')
                        ->orderBy('s.nom', 'ASC');
                },
            ])
            ->setRequired(true);

        // Liste déroulante des types d'exercice sans doublons
        yield ChoiceField::new('type_exercice', 'Type d\'exercice')
            ->setChoices($this->getUniqueExerciceTypes());

        // Input text pour la consigne
        yield TextField::new('consigne')->setLabel('Consigne');
        yield NumberField::new('ordre')->setLabel('Ordre')
            ->setHelp('Ordre d\'affichage de l\'exercice dans la séquence');
    }

    private function getUniqueExerciceTypes(): array
    {
        $exercices = $this->exerciceRepository->findAll();
        $types = [];

        foreach ($exercices as $exercice) {
            $type = $exercice->getTypeExercice();
            if ($type && !in_array($type, $types)) {
                $types[$type] = $type;
            }
        }

        return $types;
    }

}
