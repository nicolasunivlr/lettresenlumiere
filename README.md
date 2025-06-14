# Lettres en lumière

## TODO
- [X] Enlever les accents dans les noms de fichiers
- [ ] Problème de fichier sql après le dump pour le réimport dans windows !

# Lettres en lumière

## Description

Lettres en lumière est une application d'aide à la lecture pour un public adulte.
Il a été imaginé pour aider les personnes en détention à lire et à écrire.
Il peut fonctionner sans connexion internet.

## Installation

### Prérequis

L'installation a été testée sur les systèmes suivants :
*  Windows 7 avec Wamp 3.3.0
*  Windows 11 avec Wamp 3.3.7

Vous trouverez ci-dessous les logiciels requis pour faire fonctionner l'application :

### Étapes d'installation

1.  **Installez Wamp :**
    
2. **Téléchargez le zip du projet :**
Le zip du projet est disponible dans la partie "Releases" du dépôt GitHub.
   * Téléchargez la dernière version stable de l'application Lettres en lumière.
   * Le fichier sera nommé `lettresenlumiere.zip`.
3.  **Extraire le zip dans le dossier C:\wamp64\www\lettresenlumiere :**

4 **Configuration de l'application :**
    * Lancez Wamp et assurez-vous qu'il est en ligne (icône verte dans la barre des tâches).
    * Lancez `create_data.bat` dans `C:\wamp\www\lettresenlumiere\` (double clic)
    * Relancez les services Wamp (clic sur l'icône Wamp dans la barre des tâches et sélectionnez "Redémarrer tous les services").

## Utilisation

Pour une utilisation optimale de l'application, nous vous recommandons les navigateurs suivants :
* Edge (la synthèse vocale fonctionne mieux)
* Chrome

1.  **Accéder à l'application :**
    Ouvrez votre navigateur et allez à l'URL configurée `http://localhost/lettresenlumiere`.

## Partie Technique

### Technologies Utilisées

*   **Backend :** PHP sous Symfony
*   **Frontend :** React.js
*   **Base de données :** MariaDB
*   **Serveur Web :** Apache (inclus dans Wamp)