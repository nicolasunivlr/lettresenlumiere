<?php

namespace App\Form;

use App\Entity\Couleur;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\TextType;  // Utilisation de TextType pour "lettres"
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CouleurType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Champ pour le code couleur, avec un sélecteur de couleur
            ->add('code', ColorType::class, [
                'label' => 'Couleur',
                'required' => false,
            ])

            // Champ pour les lettres associées, ici un champ texte simple
            ->add('lettres', TextType::class, [
                'label' => 'Lettres associées',
                'required' => false,  // Vous pouvez ajuster cela selon vos besoins
            ])

            // Champ pour le texte en gras, case à cocher (booléen)
            ->add('bold', CheckboxType::class, [
                'label' => 'Texte en gras',
                'required' => false,
                'data' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // On associe le formulaire à l'entité Couleur
            'data_class' => Couleur::class,
        ]);
    }
}


