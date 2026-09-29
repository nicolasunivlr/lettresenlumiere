# Lettre en lumière - Front-end

## Avant-propos

Ce projet utilise **React** (v19) et adopte une architecture d'application à page unique (SPA) avec **React Router** pour la gestion de la navigation. L'organisation du code suit une structure orientée par fonctionnalités.

## Structure du projet

```
src/
├── api/
├── app/
├── assets/
├── features/
├── shared/
├── scss/
└── main.scss
```

## Détails des dossiers

- **api/** : Contient des données statiques utilisées pour les séquences spécifiques `Alphabet` et `Graphème`.

- **app/** : Contient les composants liés à la structure globale de l'application. Le routage est défini dans `app.jsx`, et les pages individuelles sont situées dans le dossier `pages/`.

- **features/** : Contient des modules réutilisables et spécifiques à certaines fonctionnalités.

- **shared/** : Contient des composants et des utilitaires partagés à travers l'application.

- **scss/** : Contient les fichiers de styles SCSS, organisés par niveaux de spécificité (généraux, composants, pages).

## Fonctionnalités métier

- **auth** : Contient les éléments liés à l'authentification, tels que les composants de connexion et d'inscription, ainsi que les services d'authentification.

- **profile** : Regroupe les composants et services liés à la gestion du profil utilisateur. C'est ici que les implémentations `GuestProfile` et `AccountProfile` sont situées, permettant de différencier les profils des utilisateurs invités et connectés. L'approche polymorphe est utilisée pour gérer les différences de comportement et d'affichage entre ces deux types de profils, tout en partageant une interface commune.

- **exercises** : Contient les éléments liés aux exercices, tels que les composants d'affichage. `ExerciseRenderer` qui gère la logique d'affichage des différents types d'exercices, agit en tant que moteur de rendu pour les exercices, en déterminant quel composant spécifique utiliser en fonction du type d'exercice.

- **sequences** : Gestion de la logique lors de l'exécution d'une séquence.


