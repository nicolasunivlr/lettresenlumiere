# Composants partagés

Ce répertoire contient les éléments partagés de l'application.

## `config`

Contient les configurations partagées à travers l'application.

## `api`

Contient des abbstractions pour interagir avec le backend.

## `components`

Contient des composants d'interface utilisateur réutilisables à travers l'application.

### `ui`

Composants d'interface utilisateur réutilisables, conçus pour être utilisés dans divers contextes de l'application. Ces composants doivent être génériques et ne pas contenir de logique métier spécifique.

### `UI (legacy)`

Composant d'interface utilisateur legacy, à migrer vers `ui` ou à supprimer. Avant de les déplacer dans `ui`, s'assurez qu'ils ne contiennent pas de logique métier spécifique et sont suffisamment génériques pour être réutilisés dans différents contextes.

### `Exercises`

Composants liés aux exercices. Ce répertoire doit être réorganisé pour séparer les composants réutilisables de la logique métier spécifique aux exercices.

### Autres fichiers

Idem que pour `UI legacy`.

## `hooks`

Contient des hooks React personnalisés réutilisables à travers toute l'application.
