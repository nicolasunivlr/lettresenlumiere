<?php

namespace App\Form;

use App\Entity\ContenuFormat;
use App\Entity\Couleur;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

class ContenuFormatType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('lettres', TextType::class, [
                'label' => 'Lettres à colorer',
                'help' => 'Ex: "3-5" pour colorer les lettres de la position 3 à 5',
                'attr' => [
                    'placeholder' => 'Ex: 3-5 ou 2',
                    'class' => 'form-control'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez spécifier les lettres à colorer',
                    ]),
                    new Regex([
                        'pattern' => '/^\d+(-\d+)?$/',
                        'message' => 'Format invalide. Utilisez "3" pour une lettre ou "3-5" pour une plage.',
                    ]),
                ]
            ])
            ->add('couleur', EntityType::class, [
                'class' => Couleur::class,
                'choice_label' => function(Couleur $couleur) {
                    // Utiliser un carré Unicode ou un emoji au lieu d'un span HTML
                    return '■ ' . $couleur->getCode();
                },
                'choice_attr' => function(Couleur $couleur) {
                    // Ajouter un style directement sur l'option
                    return [
                        'style' => 'color: ' . $couleur->getCode() . '; font-weight: bold; border-left: 10px solid ' . $couleur->getCode() . '; padding-left: 5px;',
                        'data-color' => $couleur->getCode()
                    ];
                },
                'placeholder' => 'Choisir une couleur',
                'required' => true,
                'attr' => [
                    'class' => 'form-control couleur-select'
                ]
            ])
            // Ajout du champ pour la mise en gras
            ->add('bold', CheckboxType::class, [
                'label' => 'Texte en gras',
                'required' => false,
                'attr' => [
                    'class' => 'form-check-input'
                ]
            ]);
    }


    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContenuFormat::class,
        ]);
    }
}