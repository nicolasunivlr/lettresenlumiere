# Mise en place de l'environnement de développement

## Méthode 1 (recommandée) - Avec la stack devPHP de N. Trugeon

TODO
Voir [Lien](...)

### Importer le projet

```bash
cd /path/to/devPhpLP/
# On s'assure qu'aucun service n'est actif durant l'installation
make down 
cd projets/
git clone git@gitlab.univ-lr.fr:lpmiaw-2025-2026/thunderwave/lettresenlumiere.git
cd ../..
# Configuration + lancement des services
make existingProject lettresenlumiere 
# On entre dans le container
make bash 
```

### Installation des dépendances (depuis le container)

```bash
cd /var/www/projets/lettresenlumiere
npm install
composer install
```

### Mise en place de la base de donnée

#### 1. Exécuter les migrations

Toujours depuis le container, lancer la commande `php bin/console d:m:m`

#### 2. Charger les données (avec Adminer)

Aller sur [http://localhost:8306](http://localhost:8306)

- **Système** : MySQL/MariaDB
- **Serveur** : db
- **Utilisateur** : root
- **Mot de passe** : root
- **Base de donnée** : lettresenlumiere

Copier l'intégralité des requêtes depuis [bdd.sql](bdd.sql) dans l'outil [**"Requête SQL"**](http://localhost:8306/?server=db&username=root&db=lettresenlumiere&sql=) d'Adminer.


### Lancer le serveur de développement (toujours depuis le container)

```bash
npm run watch
```

Aller sur [https://lettresenlumiere.localhost:8443/](https://lettresenlumiere.localhost:8443/)


Welcome on board! :smile:


