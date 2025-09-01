# Script de conversion et découpage audio pour les consignes d'exercices, de mots et de phrases.
# Permet de traiter tous les lots de fichiers audio/csv présents dans les dossiers d'entrée.

import os
import csv
import secrets
from pydub import AudioSegment
from pydub.silence import split_on_silence
from slugify import slugify

# --- PARAMÈTRES À CONFIGURER ---

INPUT_DIR_CSV = "lots_csv"
INPUT_DIR_AUDIO = "lots_audio"
OUTPUT_DIR_MAPPING_CSV = "correspondances_csv"
OUTPUT_DIR_AUDIO_FILES = "../public/audios"

CSV_COLUMN_INDEX = 0

# Paramètres de détection de silence
MIN_SILENCE_LEN_MS = 700
SILENCE_THRESHOLD_DBFS = -40
EXTRA_CHUNK_PADDING_MS = 200

def read_filenames_from_csv(csv_path, column_index):
    if not os.path.exists(csv_path):
        print(f"Erreur : Le fichier CSV '{csv_path}' n'a pas été trouvé.")
        return None
    filenames = []
    try:
        with open(csv_path, mode='r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            for row in reader:
                if row and len(row) > column_index:
                    filenames.append(row[column_index])
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV : {e}")
        return None
    print(f"{len(filenames)} noms de fichiers lus depuis '{csv_path}'.")
    return filenames

def write_mapping_csv(output_path, data):
    try:
        # S'assurer que le dossier de sortie existe
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, mode='w', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(['son_original', 'fichier_mp3'])
            writer.writerows(data)
        print(f"\nFichier de mapping '{output_path}' généré avec succès.")
    except Exception as e:
        print(f"\nErreur lors de la création du fichier CSV de mapping : {e}")

def generate_unique_slug(text):
    """
    Génère un slug unique. Si le slug existe déjà, ajoute un suffixe numérique.
    """
    base_slug = slugify(text)
    if not base_slug: # Si le slug est vide, utiliser un slug par défaut
        base_slug = "son"

    unique_id = secrets.token_hex(6)
    slug = f"{base_slug}-{unique_id}"
    return slug

def split_and_export_audio(source_path, output_dir, filenames, min_silence_len, silence_thresh):
    if not os.path.exists(source_path):
        print(f"Erreur : Le fichier source '{source_path}' n'a pas été trouvé.")
        return None
    os.makedirs(output_dir, exist_ok=True)

    print(f"\nChargement du fichier audio : {source_path}")
    sound = AudioSegment.from_file(source_path)

    print("Détection des silences et découpage en cours...")
    chunks = split_on_silence(
        sound, min_silence_len=min_silence_len, silence_thresh=silence_thresh, keep_silence=200
    )

    if len(chunks) != len(filenames):
        print("\n--- ATTENTION ! ---")
        print(f"Le script a détecté {len(chunks)} segments audio, mais vous avez fourni {len(filenames)} noms.")
        print("Veuillez vérifier votre enregistrement, le fichier CSV ou les paramètres de silence.")
        return None

    print(f"\nExportation de {len(chunks)} fichiers dans le dossier '{output_dir}'...")
    csv_mapping_data = []

    current_pos = 0
    for i, chunk in enumerate(chunks):
        original_name = filenames[i]
        slug_name = generate_unique_slug(original_name)
        mp3_filename = f"{slug_name}.mp3"
        output_file_path = os.path.join(output_dir, mp3_filename)

        # Ajout de 100ms du son original après le chunk
        chunk_duration = len(chunk)
        extra = sound[current_pos + chunk_duration : current_pos + chunk_duration + EXTRA_CHUNK_PADDING_MS]
        chunk_plus = chunk + extra

        print(f"  -> Exportation de '{output_file_path}'")
        chunk_plus.export(output_file_path, format="mp3", bitrate="192k")
        csv_mapping_data.append([original_name, mp3_filename])

        current_pos += chunk_duration

    print("\nOpération d'exportation audio terminée !")
    return csv_mapping_data


def process_all_lots():
    """
    Fonction principale qui parcourt et traite tous les lots.
    """
    if not os.path.isdir(INPUT_DIR_CSV):
        print(f"Erreur : Le dossier d'entrée CSV '{INPUT_DIR_CSV}' n'existe pas.")
        return

    csv_files = [f for f in os.listdir(INPUT_DIR_CSV) if f.endswith('.csv')]
    if not csv_files:
        print(f"Aucun fichier CSV trouvé dans '{INPUT_DIR_CSV}'.")
        return

    print(f"--- Début du traitement de {len(csv_files)} lot(s) ---")

    for csv_filename in csv_files:
        # Déduire le nom de base (ex: 'contenu_lot_01' -> 'lot_01')
        base_name = csv_filename.replace('contenu_', '').replace('.csv', '')
        print(f"\n\n--- Traitement du lot : {base_name} ---")

        # Construire les chemins des fichiers
        csv_path = os.path.join(INPUT_DIR_CSV, csv_filename)
        audio_path = os.path.join(INPUT_DIR_AUDIO, f"{base_name}.wav")
        output_csv_path = os.path.join(OUTPUT_DIR_MAPPING_CSV, f"lot_sons_{base_name}.csv")

        # Vérifier si le fichier audio correspondant existe
        if not os.path.exists(audio_path):
            print(f"Attention : Fichier audio '{audio_path}' non trouvé pour le CSV '{csv_filename}'. Lot ignoré.")
            continue

        names = read_filenames_from_csv(csv_path, CSV_COLUMN_INDEX)

        if names:
            mapping_data = split_and_export_audio(
                audio_path,
                OUTPUT_DIR_AUDIO_FILES,
                names,
                MIN_SILENCE_LEN_MS,
                SILENCE_THRESHOLD_DBFS
            )
            if mapping_data:
                write_mapping_csv(output_csv_path, mapping_data)

    print("\n\n--- Traitement de tous les lots terminé. ---")


if __name__ == "__main__":
    process_all_lots()