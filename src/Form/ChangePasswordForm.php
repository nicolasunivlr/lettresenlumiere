<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\PasswordStrength;

class ChangePasswordForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('password', PasswordType::class, [
                'constraints' => [
                    new PasswordStrength(),
                ],
                'mapped' => false,
                'label' => 'Nouveau mot de passe',
                'label_attr' => ['class' => 'form-label'],
                'attr' => [
                    'autocomplete' => 'new-password',
                    'class' => 'form-control',
                ],
            ])
            ->add('confirm_password', PasswordType::class, [
                'mapped' => false,
                'label' => 'Confirmer le mot de passe',
                'label_attr' => ['class' => 'form-label'],
                'attr' => [
                    'autocomplete' => 'new-password',
                    'class' => 'form-control',
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
