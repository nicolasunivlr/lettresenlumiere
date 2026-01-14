<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Entity\AccountProfile;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    // Configure les champs affichés dans les formulaires et listes
    public function configureFields(string $pageName): iterable
    {
        $fields = [
            IdField::new('id')->hideOnForm(),
            TextField::new('username')
                ->setLabel('Nom d\'utilisateur')
                ->setRequired(true),
        ];

        // Champ mot de passe différent selon la page en cours
        if ($pageName === 'new') {
            $fields[] = TextField::new('password')
                ->setLabel('Mot de passe')
                ->setRequired(true)
                ->setHelp('Le mot de passe sera hashé automatiquement');
        } elseif ($pageName === 'edit') {
            $fields[] = TextField::new('password')
                ->setLabel('Nouveau mot de passe')
                ->setRequired(false)
                ->setHelp('Laissez vide pour ne pas modifier le mot de passe');
        }

        // Champ rôles (Administrateur/Utilisateur)
        $fields[] = ChoiceField::new('roles')
            ->setLabel('Rôles')
            ->setChoices([
                'Utilisateur' => 'ROLE_USER',
                'Administrateur' => 'ROLE_ADMIN',
            ])
            ->allowMultipleChoices()
            ->setRequired(true)
            ->setHelp('Sélectionnez un ou plusieurs rôles');

        return $fields;
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            // Hasher le mot de passe si fourni
            if ($entityInstance->getPassword()) {
                $hashedPassword = $this->passwordHasher->hashPassword(
                    $entityInstance,
                    $entityInstance->getPassword()
                );
                $entityInstance->setPassword($hashedPassword);
            }

            // Créer l'AccountProfile associé à l'utilisateur
            if (!$entityInstance->getAccountProfile()) {
                $accountProfile = new AccountProfile();
                $accountProfile->setUser($entityInstance);
                $entityInstance->setAccountProfile($accountProfile);
                $entityManager->persist($accountProfile);
            }
        }

        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            // Si un nouveau mot de passe est fourni, le hasher
            $plainPassword = $entityInstance->getPassword();
            if (!empty($plainPassword)) {
                $hashedPassword = $this->passwordHasher->hashPassword(
                    $entityInstance,
                    $plainPassword
                );
                $entityInstance->setPassword($hashedPassword);
            } else {
                // Récupérer le mot de passe actuel depuis la base de données
                $originalEntity = $entityManager->getUnitOfWork()->getOriginalEntityData($entityInstance);
                if (isset($originalEntity['password'])) {
                    $entityInstance->setPassword($originalEntity['password']);
                }
            }

            // S'assurer qu'un AccountProfile existe
            if (!$entityInstance->getAccountProfile()) {
                $accountProfile = new AccountProfile();
                $accountProfile->setUser($entityInstance);
                $entityInstance->setAccountProfile($accountProfile);
                $entityManager->persist($accountProfile);
            }
        }

        parent::updateEntity($entityManager, $entityInstance);
    }
}