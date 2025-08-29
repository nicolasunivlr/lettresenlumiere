#!/bin/bash

# --- Configuration ---
SOURCE_FILE="contenu_unique.csv"
OUTPUT_DIR="lots_csv"
LINES_PER_FILE=50
OUTPUT_PREFIX="contenu_lot_"

# --- Script ---

# Vérifier si le fichier source existe
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Erreur : Le fichier source '$SOURCE_FILE' n'a pas été trouvé."
    exit 1
fi

# Créer le répertoire de sortie s'il n'existe pas
mkdir -p "$OUTPUT_DIR"
echo "Les fichiers seront sauvegardés dans le dossier : $OUTPUT_DIR"

# Diviser le fichier en lots, en nommant directement les fichiers de sortie
# -l : nombre de lignes par fichier
# -d : utilise des suffixes numériques (00, 01, ...)
# --additional-suffix=.csv : ajoute l'extension .csv à chaque fichier
# Le dernier argument est le préfixe pour les noms de fichiers de sortie
split -l "$LINES_PER_FILE" --numeric-suffixes=1 --additional-suffix=.csv "$SOURCE_FILE" "$OUTPUT_DIR/$OUTPUT_PREFIX"

# Compter le nombre de fichiers générés
FILE_COUNT=$(ls -1q "$OUTPUT_DIR" | wc -l)

echo "Opération terminée."
echo "$FILE_COUNT lots ont été créés avec succès."