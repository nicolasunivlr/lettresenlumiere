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

    public function createEntity(string $entityFqcn): User
    {
        $user = new User();
        // Créer l'AccountProfile dès la création de l'entité pour que les champs imbriqués fonctionnent
        $accountProfile = new AccountProfile();
        $accountProfile->setUser($user);
        $user->setAccountProfile($accountProfile);
        
        return $user;
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

        // Champs du profil utilisateur (AccountProfile)
        $fields[] = TextField::new('accountProfile.firstname')
            ->setLabel('Prénom')
            ->setRequired(true)
            ->setHelp('Prénom de l\'utilisateur')
            ->formatValue(function ($value, $entity) {
                return $entity->getAccountProfile()?->getFirstname() ?? '-';
            });

        $fields[] = TextField::new('accountProfile.lastname')
            ->setLabel('Nom')
            ->setRequired(true)
            ->setHelp('Nom de famille de l\'utilisateur')
            ->formatValue(function ($value, $entity) {
                return $entity->getAccountProfile()?->getLastname() ?? '-';
            });


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
                ->setHelp('Laissez vide pour ne pas modifier le mot de passe')
                ->setFormTypeOption('mapped', false)
                ->setFormTypeOption('attr', ['value' => ""]);
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
            // Sauvegarder le mot de passe actuel avant la mise à jour
            $originalEntity = $entityManager->getUnitOfWork()->getOriginalEntityData($entityInstance);
            $currentPassword = $originalEntity['password'] ?? null;
            
            // Récupérer le nouveau mot de passe depuis le formulaire
            $request = $this->getContext()->getRequest();
            $formData = $request->request->all();
            
            // Essayer différentes clés possibles pour le formulaire
            $plainPassword = null;
            if (isset($formData['User']['password']) && !empty($formData['User']['password'])) {
                $plainPassword = $formData['User']['password'];
            } elseif (isset($formData['password']) && !empty($formData['password'])) {
                $plainPassword = $formData['password'];
            }
            
            if ($plainPassword) {
                // Hasher le nouveau mot de passe
                $hashedPassword = $this->passwordHasher->hashPassword(
                    $entityInstance,
                    $plainPassword
                );
                $entityInstance->setPassword($hashedPassword);
            } elseif ($currentPassword) {
                // Conserver le mot de passe actuel si aucun nouveau n'est fourni
                $entityInstance->setPassword($currentPassword);
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