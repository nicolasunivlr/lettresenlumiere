<?php

namespace App\Controller\Admin;

use App\Entity\Couleur;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ColorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class CouleurCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Couleur::class;
    }


    public function configureFields(string $pageName): iterable
    {
        yield ColorField::new('code', 'Couleur')
            ->setFormTypeOptions([
                'required' => false,
            ]);

    }

}