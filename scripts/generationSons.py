# Script de génération de fichiers audio à partir d'un fichier CSV par l'IA
# Peu concluant pour l'instant, mais il est fonctionnel.
# Certains mots sont mal prononcés, mais la plupart sont corrects.
# Limitation : l'API d'ElevenLabs ne permet pas de générer des fichiers audio pour des mots uniques, il faut fournir un texte plus long.
# Limitation : le plan gratuit d'ElevenLabs limite le nombre de requêtes par mois.
import os
import csv
import secrets
import requests
import time
from dotenv import load_dotenv
from slugify import slugify

load_dotenv(".env.local")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = os.getenv("VOICE_ID")

if not API_KEY or not VOICE_ID:
    print("--- ERREUR CRITIQUE ---")
    print("La clé API (ELEVENLABS_API_KEY) ou l'ID de la voix (VOICE_ID) n'a pas été trouvé.")
    print("Veuillez vérifier que votre fichier .env est présent et correctement configuré.")
    sys.exit(1)

CSV_INPUT_FILE = "contenu_unique.csv"
OUTPUT_DIR = "sons_generes"
OUTPUT_CSV_MAPPING_FILE = "mots_sons_mapping.csv"

CSV_WORD_COLUMN_INDEX = 0
CSV_IPA_COLUMN_INDEX = 1

# --- CORPS DU SCRIPT ---

def read_words_from_csv(csv_path):
    """Lit les mots et leurs transcriptions phonétiques optionnelles depuis le CSV."""
    if not os.path.exists(csv_path):
        print(f"Erreur : Le fichier CSV '{csv_path}' n'a pas été trouvé.")
        return None
    items = []
    try:
        with open(csv_path, mode='r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            next(reader, None) # Ignorer l'en-tête
            for row in reader:
                if not row or row[0].strip().startswith('#'):
                    continue
                if len(row) > CSV_WORD_COLUMN_INDEX:
                    word = row[CSV_WORD_COLUMN_INDEX].strip()
                    ipa = row[CSV_IPA_COLUMN_INDEX].strip() if len(row) > CSV_IPA_COLUMN_INDEX and row[CSV_IPA_COLUMN_INDEX].strip() else None
                    items.append({"word": word, "ipa": ipa})
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV : {e}")
        return None
    print(f"{len(items)} éléments lus depuis '{csv_path}'.")
    return items

def write_mapping_csv(output_path, data):
    try:
        with open(output_path, mode='w', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(['mot_original', 'fichier_mp3'])
            writer.writerows(data)
        print(f"\nFichier de mapping '{output_path}' généré avec succès.")
    except Exception as e:
        print(f"\nErreur lors de la création du fichier CSV de mapping : {e}")

def generate_unique_slug(text):
    base_slug = slugify(text) if slugify(text) else "son"
    unique_id = secrets.token_hex(4)
    return f"{base_slug}-{unique_id}"

def generate_audio_files(items, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    print(f"\nGénération de {len(items)} fichiers audio dans '{output_dir}'...")

    api_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
    }
    csv_mapping_data = []
    max_retries = 2

    for i, item in enumerate(items):
        original_word = item["word"]
        text_to_speak = item["ipa"] if item["ipa"] else original_word
        slug_name = generate_unique_slug(original_word)
        mp3_filename = f"{slug_name}.mp3"
        output_file_path = os.path.join(output_dir, mp3_filename)

        print(f"  ({i+1}/{len(items)}) Traitement de '{original_word}' (prononcé '{text_to_speak}')...")

        data = {
            "text": text_to_speak,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": { "stability": 0.5, "similarity_boost": 0.75 }
        }

        success = False
        for attempt in range(max_retries):
            try:
                response = requests.post(api_url, json=data, headers=headers, timeout=60)
                response.raise_for_status()

                with open(output_file_path, 'wb') as f:
                    f.write(response.content)

                csv_mapping_data.append([original_word, mp3_filename])
                print(f"    -> Succès. Fichier '{mp3_filename}' généré.")
                success = True
                break  # Sort de la boucle de relance en cas de succès

            except requests.exceptions.RequestException as e:
                print(f"    Tentative {attempt + 1}/{max_retries} échouée : {e}")
                if attempt + 1 < max_retries:
                    time.sleep(2)  # Attend 2 secondes avant de réessayer
                else:
                    csv_mapping_data.append([original_word, "Échec de génération"])
                    print(f"    Échec final pour le mot '{original_word}'. Passage au suivant.")

        if success:
            time.sleep(1.2) # Pause entre chaque mot pour respecter les limites de l'API

    print("\nOpération de génération audio terminée !")
    return csv_mapping_data


if __name__ == "__main__":
    print("--- Démarrage de la génération des fichiers audio ---")
    items_to_process = read_words_from_csv(CSV_INPUT_FILE)

    if items_to_process:
        mapping_data = generate_audio_files(items_to_process, OUTPUT_DIR)
        if mapping_data:
            write_mapping_csv(OUTPUT_CSV_MAPPING_FILE, mapping_data)