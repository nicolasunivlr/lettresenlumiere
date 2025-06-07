<?php

/**
 * Formulaire pour l'importation globale des données
 * 
 * Ce formulaire permet de télécharger un fichier ZIP contenant une exportation
 * globale de l'application (SQL + médias). Il assure que:
 * - Le fichier téléchargé est bien au format ZIP
 * - Le MIME type correspond à un fichier compressé
 * 
 * Le formulaire est composé de:
 * - Un champ de téléchargement de fichier avec contraintes de validation
 * - Un bouton de soumission
 * 
 * Utilisé par GlobalImportController pour gérer l'importation des données.
 */

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class GlobalImportType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('importFile', FileType::class, [
                'label' => 'Fichier ZIP à importer',
                'mapped' => false,
                'constraints' => [
                    new File([
                        'mimeTypes' => [
                            'application/zip',
                            'application/x-zip-compressed',
                        ],
                        'mimeTypesMessage' => 'Veuillez télécharger un fichier ZIP valide',
                    ]),
                ],
                'required' => true,
                'help' => 'Sélectionnez un fichier ZIP contenant une exportation globale du système.'
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Importer',
                'attr' => [
                    'class' => 'btn btn-primary'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
        ]);
    }
}
