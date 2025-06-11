<?php
// Ce script est destiné à être exécuté dans un environnement WAMP pour nettoyer le cache, configurer la base de données et importer un fichier SQL.

// Fonction pour supprimer récursivement un dossier et son contenu
function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (is_dir($dir . "/" . $object)) {
                    rrmdir($dir . "/" . $object);
                } else {
                    unlink($dir . "/" . $object);
                }
            }
        }
        rmdir($dir);
        return true;
    }
    return false;
}

// Chemin vers le dossier à nettoyer (imitation cache:clear)
$cachePath = __DIR__ . '\\var\\cache\\prod';

// Vérifier si le dossier existe et le supprimer
if (is_dir($cachePath)) {
    echo "Nettoyage du cache: suppression de $cachePath\n";
    if (rrmdir($cachePath)) {
        echo "Le dossier de cache a été supprimé avec succès.\n";
    } else {
        echo "ERREUR: Impossible de supprimer le dossier de cache $cachePath\n";
    }
} else {
    echo "Pas de dossier cache à nettoyer ($cachePath)\n";
}

// Déterminer le chemin de base de WAMP dynamiquement
$wampBaseDir = dirname(dirname(__FILE__));
echo "Base de WAMP: $wampBaseDir\n";

// Trouver la version la plus récente de PHP dans les dossiers WAMP
$phpDirs = glob($wampBaseDir . '\\bin\\php\\php*', GLOB_ONLYDIR);
if (!empty($phpDirs)) {
    $latestPhpDir = $phpDirs[count($phpDirs) - 1];
    $phpExecutable = $latestPhpDir . '\\php.exe';
} else {
    echo "ERREUR: Aucun dossier PHP trouvé\n";
    exit(1);
}

// Vérifier les arguments
if ($argc < 2) {
    echo "Usage: \"$phpExecutable\" import-sql.php chemin/vers/fichier.sql\n";
    exit(1);
}

$sqlFile = $argv[1];

// Récupérer les paramètres de connexion depuis le fichier de configuration WAMP
$mariadbDirs = glob($wampBaseDir . '\\bin\\mariadb\\mariadb*', GLOB_ONLYDIR);
if (!empty($mariadbDirs)) {
    $latestMariadbDir = $mariadbDirs[count($mariadbDirs) - 1];
    $wampConfigFile = $latestMariadbDir . '\\my.ini';
} else {
    echo "ERREUR: Aucun dossier MariaDB trouvé\n";
    exit(1);
}

if (file_exists($wampConfigFile)) {
    $config = parse_ini_file($wampConfigFile, true);
    $dbHost = $config['client']['host'] ?? 'localhost';
    $dbPort = $config['client']['port'] ?? '3307';
    $dbUser = $config['client']['user'] ?? 'root';
    $dbPass = $config['client']['password'] ?? '';
    $dbName = 'back_lel'; // Nom de la base de données à ajuster si nécessaire
} else {
    echo "ERREUR: Fichier de configuration WAMP introuvable\n";
    exit(1);
}

// Mettre à jour le fichier .env.local
$envFilePath = __DIR__ . '\\.env.local';
// Ensure back directory exists

$databaseUrl = sprintf(
    'mysql://%s%s@%s:%s/%s?serverVersion=10.4.27-MariaDB',
    $dbUser,
    !empty($dbPass) ? ":$dbPass" : '',
    $dbHost,
    $dbPort,
    $dbName
);

echo "Mise à jour de $envFilePath avec DATABASE_URL\n";

// Delete the file if it exists
if (file_exists($envFilePath)) {
    echo "Suppression du fichier existant...\n";
    if (!unlink($envFilePath)) {
        echo "ERREUR: Impossible de supprimer le fichier existant $envFilePath\n";
        exit(1);
    }
}

// Create a new file with the DATABASE_URL
$envContent = "DATABASE_URL=$databaseUrl\n";
echo "Création du fichier avec: DATABASE_URL=$databaseUrl\n";

if (file_put_contents($envFilePath, $envContent) === false) {
    echo "ERREUR: Impossible de créer $envFilePath\n";
    exit(1);
}

// Display the content of the .env.local file after update
echo "Contenu actuel de $envFilePath:\n";
echo file_get_contents($envFilePath);

// Recherche automatique du chemin vers l'exécutable MariaDB
$mariadbDirs = glob($wampBaseDir . '\\bin\\mariadb\\mariadb*', GLOB_ONLYDIR);
if (!empty($mariadbDirs)) {
    $mariadbPath = $mariadbDirs[count($mariadbDirs) - 1] . '\\bin\\mysql.exe';
}


echo "Utilisation de: $mariadbPath\n";

if (!file_exists($mariadbPath)) {
    echo "ERREUR: L'exécutable MariaDB n'a pas été trouvé\n";
    exit(1);
}

// Supprimer complètement la base de données si elle existe
$dropDbCommand = sprintf(
    '"%s" -h%s -P%s -u%s %s -e "DROP DATABASE IF EXISTS `%s`;" 2>&1',
    $mariadbPath,
    $dbHost,
    $dbPort,
    $dbUser,
    !empty($dbPass) ? "-p$dbPass" : '',
    $dbName
);

echo "Suppression de la base de données: $dbName\n";
$output = [];
$returnCode = 0;
exec($dropDbCommand, $output, $returnCode);

if ($returnCode !== 0) {
    echo "Erreur lors de la suppression de la base de données:\n";
    foreach ($output as $line) {
        echo $line . "\n";
    }
    // Ne pas sortir en cas d'erreur, continuer avec la création
}

// Créer une nouvelle base de données vide
$createDbCommand = sprintf(
    '"%s" -h%s -P%s -u%s %s -e "CREATE DATABASE `%s`;" 2>&1',
    $mariadbPath,
    $dbHost,
    $dbPort,
    $dbUser,
    !empty($dbPass) ? "-p$dbPass" : '',
    $dbName
);

echo "Création d'une nouvelle base de données: $dbName\n";
$output = [];
$returnCode = 0;
exec($createDbCommand, $output, $returnCode);

if ($returnCode !== 0) {
    echo "Erreur lors de la création de la base de données:\n";
    foreach ($output as $line) {
        echo $line . "\n";
    }
    exit(1);
}

// Commande avec mariadb.exe
$command = sprintf(
    '"%s" -h%s -P%s -u%s %s < "%s" 2>&1',
    $mariadbPath,
    $dbHost,
    $dbPort,
    $dbUser,
    $dbName,
    $sqlFile
);

// Ajout du mot de passe si nécessaire
if (!empty($dbPass)) {
    $command = sprintf(
        '"%s" -h%s -P%s -u%s -p%s %s < "%s" 2>&1',
        $mariadbPath,
        $dbHost,
        $dbPort,
        $dbUser,
        $dbPass,
        $dbName,
        $sqlFile
    );
}

echo "Exécution de la commande: $command\n";
$output = [];
$returnCode = 0;
exec($command, $output, $returnCode);

if ($returnCode !== 0) {
    echo "Erreur lors de l'importation SQL:\n";
    foreach ($output as $line) {
        echo $line . "\n";
    }
    exit(1);
} else {
    echo "Importation SQL réussie!\n";
}

// Ajouter fichier env.js dans le dossier public/js
$envJsPath = __DIR__ . '\\public\\js\\env.js';
$envJsContent = "const BASE_ROUTE = '/lettresenlumiere';\nexport default BASE_ROUTE;\n";
if (file_put_contents($envJsPath, $envJsContent) === false) {
    echo "ERREUR: Impossible de créer $envJsPath\n";
    exit(1);
} else {
    echo "Fichier env.js créé avec succès dans $envJsPath\n";
}

// Get server's IP address
function getServerIP() {
    // For Windows (WAMP is primarily on Windows)
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $output = [];
        exec('ipconfig', $output);
        foreach ($output as $line) {
            if (strpos($line, 'IPv4') !== false && strpos($line, '127.0.0.1') === false) {
                preg_match('/\d+\.\d+\.\d+\.\d+/', $line, $matches);
                if (!empty($matches)) {
                    return $matches[0];
                }
            }
        }
    }
    return gethostbyname(gethostname());
}

// Get the server IP
$serverIp = getServerIP();

// Display the server IP in a highlighted format
echo "\n";
echo "============================================\n";
echo "     IP DU SERVEUR: $serverIp     \n";
echo "============================================\n";
echo "\n";
