# Lettres en lumière

## TODO
- [X] Enlever les accents dans les noms de fichiers
- [X] Problème de fichier sql après le dump pour le réimport dans windows !
- [ ] Concernant les sons enregistrés, ça marche bien pour tous les exercices, sauf pour les types B (trouve la bonne syllabe ou le bon mot) et E (écris la syllabe ou le mot sans modèle). C'est la voix de synthèse qui reprend le dessus. Voir par exemple séquence IL - OR (étape1).
- [ ] A propos des curseurs quand l'utilisateur doit écrire les items avec ou sans modèle (types C et E) : le curseur clignote c'est très bien pour voir où l'utilisateur se trouve dans son écrit. Mais problème sur tous les types C (syllabes, mots ou phrases, avec modèle), une fois le modèle disparu, on ne peut pas écrire directement, on est obligé de d'abord faire un clic dans la case sinon ça ne marche pas.
Exemple : étape 1 séquence [il - or]  exercice 3 (type C), alors que dans l'exercice 5 (type E) ça marche très bien (pas besoin de cliquer dans la case avant d'écrire)
- [ ] De plus, ça pose également un problème sur le type C2bis ou sur les types C2 ou C3 quand on doit écrire un mot ou une phrase. On a maintenant la possibilité de revoir le modèle sans que le contenu qu'on a commencé à écrire disparaisse, c'est très bien. Mais, du coup, une fois le modèle disparu, le contenu de ce qu'on a écrit juste avant est toujours présent, mais on doit d'abord cliquer sur la case pour pouvoir continuer d'écrire, et le curseur reste bloqué au début, alors qu'en fait le curseur devrait être à l'endroit où on s'est arrêté. Remarque : ça marche mieux sur le type E, même si après avoir réécouté le modèle on est quand même obligé de recliquer sur la case, mais au moins le curseur est bien placé à l'endroit où on s'est arrêter.
Exemple étape 14 séquence [ti = si] exercice 4 (type C2bis) : obliger de cliquer d'abord dans la case sinon ça ne marche pas, et le curseur est mal placé ce qui est très perturbant. Remarque, dans la même séquence [ti = si] l'exercice 6 (type E2bis) fonctionne très bien c'est parfait.
Toujours dans la même séquence, exercice 8 (type C2), si on commence à écrire le mot après avoir vu le modèle (toujours obliger de d'abord cliquer dans la case pour écrire) et si on clique pour revoir le modèle, après on se retrouve dans la même situation que l'exercice 4 (type C2bis), le curseur est mal placé, on doit d'abord cliquer dans la case, le curseur reste au début.
Idem à l'exercice 13 (type C3)
- [ ] Autre correction à faire (si possible) sur tous les types F : ce serait bien si on avait la possibilité de redéposer les étiquettes à leur place d'origine en-dessous (sous le mot ou la phrase). J'ai vu mes apprenants essayer de le faire, mais comme ça ne marche pas, ils déplacent les étiquettes à l'intérieur de l'item (mot ou phrase) mais du coup c'est un peu plus compliqué pour eux.
Exemple étape 14 séquence [ti = si] exercice 7 (type F1), exercice 9 (type F2) ou exercice12 (type F3)
- [X] Merci pour la barre de recherche dans la page des étapes, c'est parfait ! Juste si on pouvait modifier le texte : "Rechercher une séquence" (à la place de "Rechercher un exercice").
- [X] Je te mets en pièce jointe le document à joindre à côté de la barre de recherche. Je ne sais pas quoi écrire avec le lien vers le pdf mais ça doit être bref ("Contenu" ou "Aide" par exemple?)
- [X] Je ne sais pas si la forme est bonne, tu peux bien entendu modifier le document si tu penses pouvoir faire mieux. 
- [ ] Si possible, sur la page d'accueil, ne serait-ce pas mieux si on décalait l'onglet "credits" en haut à droite (espace vide) ? Car sur mon pc, l'onglet "credits" chevauche ce qui est en dessous, ça se superpose avec l'onglet "graphèmes" c'est pas top. Aussi, pourrait-on ajouter l'accent aigu à "Crédits" sur la page d'accueil ? Sinon à l'intérieur de la page "Crédits", j'aimerais supprimer le mot "exceptionnel" (même si c'est vrai, leur travail a vraiment été exceptionnel, mais ça manque un peu d'humilité). Tu pourrais d'ailleurs ajouter ton nom aussi, et modifier si besoin le contenu de cette page si tu veux ajouter des choses.
- [ ] Dernière chose, dans le paramétrage des couleurs, je ne sais pas si c'est facile ou pas à modifier, mais j'aurais aimé :
- [ ] avoir un vert un tout petit peu plus clair, plus vif (là il est trop foncé, on le distingue à peine du noir)
- [ ] avoir un gris plus foncé (là il est trop clair, on ne voit pas assez les lettres)
- [ ] avoir un jaune un tout petit peu plus foncé si possible

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
