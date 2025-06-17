# Lettres en lumière

## TODO
- [X] Enlever les accents dans les noms de fichiers
- [X] Problème de fichier sql après le dump pour le réimport dans windows !
- [X] Concernant les sons enregistrés, ça marche bien pour tous les exercices, sauf pour les types B (trouve la bonne syllabe ou le bon mot) et E (écris la syllabe ou le mot sans modèle). 
C'est la voix de synthèse qui reprend le dessus. Voir par exemple séquence IL - OR (étape1).
- [X] InputLabel : le focus n'est pas fonctionnel, on doit cliquer pour l'activer.
- [ ] DraggleList : avoir une zone de drop dans la liste de départ pour remettre les lettres/syllables/mots dans la position d'origine. 
Exemple étape 14 séquence [ti = si] exercice 7 (type F1), exercice 9 (type F2) ou exercice12 (type F3)
- [X] Merci pour la barre de recherche dans la page des étapes, c'est parfait ! Juste si on pouvait modifier le texte : "Rechercher une séquence" (à la place de "Rechercher un exercice").
- [X] Je te mets en pièce jointe le document à joindre à côté de la barre de recherche. Je ne sais pas quoi écrire avec le lien vers le pdf mais ça doit être bref ("Contenu" ou "Aide" par exemple?)
- [X] Je ne sais pas si la forme est bonne, tu peux bien entendu modifier le document si tu penses pouvoir faire mieux. 
- [X] Si possible, sur la page d'accueil, ne serait-ce pas mieux si on décalait l'onglet "credits" en haut à droite (espace vide) ? Car sur mon pc, l'onglet "credits" chevauche ce qui est en dessous, ça se superpose avec l'onglet "graphèmes" c'est pas top. Aussi, pourrait-on ajouter l'accent aigu à "Crédits" sur la page d'accueil ? Sinon à l'intérieur de la page "Crédits", j'aimerais supprimer le mot "exceptionnel" (même si c'est vrai, leur travail a vraiment été exceptionnel, mais ça manque un peu d'humilité). Tu pourrais d'ailleurs ajouter ton nom aussi, et modifier si besoin le contenu de cette page si tu veux ajouter des choses.
- [X] avoir un vert un tout petit peu plus clair, plus vif (là il est trop foncé, on le distingue à peine du noir)
- [X] avoir un gris plus foncé (là il est trop clair, on ne voit pas assez les lettres)
- [X] avoir un jaune un tout petit peu plus foncé si possible

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
