<?php

namespace App\Controller\Admin;

use App\Entity\Contenu;
use App\Form\ContenuFormatType;
use Doctrine\ORM\EntityRepository;
use EasyCorp\Bundle\EasyAdminBundle\Config\Asset;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Form\Type\FileUploadType;
use Symfony\Component\Validator\Constraints\File;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;


class ContenuCrudController extends AbstractCrudController
{

    public static function getEntityFqcn(): string
    {
        return Contenu::class;
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(EntityFilter::new('sequence')->setLabel('Séquence'));
    }


    public function configureFields(string $pageName): iterable
    {
        yield TextField::new('contenu')
            ->setLabel('Contenu')
            ->setFormTypeOptions([
                'attr' => ['class' => 'd-inline-block w-50'], // Ajoutez des classes Bootstrap pour la mise en page
            ]);

        yield AssociationField::new('sequence')
            ->setFormTypeOptions([
                'choice_label' => 'nom',
                'attr' => ['class' => 'sequence-select'],
            ])
            ->setRequired(true)
            ->setLabel('Séquence')
            ->formatValue(fn ($v, $entity) => $entity->getSequence() ? $entity->getSequence()->getNom() : '-');

        yield AssociationField::new('exercices', 'Exercices')
            ->setFormTypeOptions([
                'choice_label' => 'type_exercice',
                'multiple' => true,
                'expanded' => true,
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('e')
                        ->orderBy('e.ordre', 'ASC');
                },
                'attr' => ['class' => 'exercice-checkboxes'],
                'group_by' => function ($exercice) {
                    return $exercice->getSequence()->getNom();
                },
            ])
            ->setRequired(true);

        yield CollectionField::new('contenuFormats')
            ->setEntryType(ContenuFormatType::class)
            ->setFormTypeOption('by_reference', false) // Important pour que addContenuFormat soit appelé
            ->allowAdd()
            ->allowDelete()
            ->setLabel('Formats du contenu (coloration des lettres)')
            ->setHelp('Spécifiez les lettres à colorer et choisissez une couleur')
            ->onlyOnForms();

        yield TextField::new('lettres')
            ->setLabel('Lettres colorées')
            ->hideOnForm()
            ->formatValue(function ($v, $entity) {
                // Personnaliser l'affichage des lettres avec les couleurs associées
                $formatsData = [];
                foreach ($entity->getContenuFormats() as $format) {
                    if ($format->getCouleur()) {
                        $color = $format->getCouleur()->getCode();
                        $formatsData[] = sprintf(
                            '<span style="color: %1$s; font-weight: bold;">■</span> Lettres %2$s',
                            $color,
                            $format->getLettres()
                        );
                    } else {
                        $formatsData[] = sprintf('Lettres %s', $format->getLettres());
                    }
                }
                return implode('<br>', $formatsData);
            })
            ->setTemplatePath('admin/field/colored_square.html.twig');

        yield ImageField::new('image_url')
            ->setLabel('Image')
            ->setBasePath('images/')
            ->setUploadDir('public/images/')
            ->setRequired(false)
            ->setFormTypeOptions([
                'empty_data' => null, // modification ici pour renvoyer null et non une chaîne
                'data_class' => null,
                'attr' => ['placeholder' => 'Laisser vide si non utilisé'],
            ])
            ->setUploadedFileNamePattern('[slug]-[timestamp].[extension]');


            yield ImageField::new('audioUrl')
                ->setFormType(FileUploadType::class)
                ->setLabel('Fichier Audio')
                ->setBasePath('/audios/')
                ->setUploadDir('public/audios/')
                ->setRequired(false)
                ->setHelp('Formats acceptés : MP3, WAV')
                ->setHtmlAttribute('accept','audio/mp3, audio/wav')
                ->setFileConstraints(new File([
                    'mimeTypes' => [
                        'audio/mpeg',
                        'audio/vnd.wav',
                        'audio/wav',  // Pour WAV
                        'audio/x-wav',
                    ],
                    'mimeTypesMessage' => 'Veuillez télécharger un fichier audio valide (MP3 ou WAV).',
                ]))
                ->setUploadedFileNamePattern('[slug]-[timestamp].[extension]');
                



        yield TextField::new('syllabes')->setLabel('Syllabes');
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof Contenu) {
            $request = $this->getContext()->getRequest();
            $formData = $request->get('Contenu');

            // On n'a plus besoin de gérer manuellement les contenuFormats car EasyAdmin le fait automatiquement
            // grâce au CollectionField et à by_reference = false

            // Gestion des syllabes
            $hasSyllabeExercice = false;
            foreach ($entityInstance->getExercices() as $exercice) {
                if (in_array($exercice->getTypeExercice(), ['C.2 bis', 'E.2 bis'])) {
                    $hasSyllabeExercice = true;
                    break;
                }
            }

            if (!$hasSyllabeExercice) {
                $entityInstance->setSyllabes(null);
            } else {
                $syllabes = $formData['syllabes'] ?? null;
                if ($syllabes) {
                    $entityInstance->setSyllabes($syllabes);
                } else {
                    $entityInstance->setSyllabes(null);
                }
            }
        }

        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $this->persistEntity($entityManager, $entityInstance);
    }

    public function configureAssets(Assets $assets): Assets
    {
        return $assets
            ->addJsFile(Asset::new('js/needCouleur.js')->defer()->htmlAttr('type', 'module'))
            ->addJsFile(Asset::new('js/syllab-picker.js')->defer())
            ->addJsFile(Asset::new('js/audio-tester.js')->defer())
            ->addJsFile(Asset::new('js/dynamic-filter-crud-contenu.js')->defer()->htmlAttr('type', 'module'))
            ->addJsFile(Asset::new('js/preview-image.js')->defer()->htmlAttr('type', 'module'))
            ->addJsFile(Asset::new('js/choices.min.js')->defer())
            ->addJsFile(Asset::new('js/local-storage.js')->defer())
            ->addJsFile(Asset::new('js/select-color-contenuFormat.js')->defer())
            ->addJsFile(Asset::new('js/color-letter-picker.js')->defer())
            ->addCssFile(Asset::new('css/stylesCrud.css'))
            ->addCssFile(Asset::new('css/choices.min.css'));
    }
}
