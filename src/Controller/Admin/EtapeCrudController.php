<?php

namespace App\Controller\Admin;

use App\Entity\Etape;
use App\Repository\EtapeRepository;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Doctrine\ORM\EntityManagerInterface;

class EtapeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Etape::class;
    }

    public function __construct(private EtapeRepository $etapeRepository)
    {
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('nom')->setLabel('Nom de l\'étape')->setFormTypeOptions([
                'disabled' => 'disabled'
            ]),
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof Etape) {
            $dernierEtape = $this->etapeRepository->findOneBy([], ['id' => 'DESC']);

            $nouveauNumero = $dernierEtape ? intval(preg_replace('/[^0-9]/', '', $dernierEtape->getNom())) + 1 : 1;

            $entityInstance->setNom("Etape " . $nouveauNumero);
        }

        parent::persistEntity($entityManager, $entityInstance);
    }




}
