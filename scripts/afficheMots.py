import time
import csv
import tkinter as tk
from tkinter import font as tkfont
import pyttsx3
import wave
import os
import sys

def display_words_from_csv(file_path, root, label):
    # Initialiser le moteur de synthèse vocale
    engine = pyttsx3.init()
    engine.setProperty('rate', 125)

    # Lire le fichier CSV et afficher les mots un par un
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if row:  # Vérifie si la ligne n'est pas vide
                word = row[0]
                label.config(text=word)
                label.pack(ipadx=50,ipady=50)
                root.update()

                engine.save_to_file(word, 'temp.wav')
                engine.runAndWait()

                # Obtenir la durée du fichier audio temporaire
                with wave.open('temp.wav', 'rb') as wav_file:
                    frames = wav_file.getnframes()
                    rate = wav_file.getframerate()
                    duration = frames / float(rate)

                # Attendre la durée estimée
                time.sleep(duration+1)

def on_key_press(event, csv_files, current_file_index, root, label):
    if event.keysym == 'space':
        if current_file_index[0] < len(csv_files):
            for i in range(3, 0, -1):
                label.config(text=str(i))
                root.update()
                time.sleep(1)
            file_path = os.path.join('lots_csv', csv_files[current_file_index[0]])
            display_words_from_csv(file_path, root, label)
            current_file_index[0] += 1
            if current_file_index[0] < len(csv_files):
                label.config(text=f"Appuyez sur la touche \"Espace\" pour passer au fichier suivant: {csv_files[current_file_index[0]]}\n\nAppuyez sur la touche \"Suppr\" pour relire le fichier actuel: {csv_files[current_file_index[0]-1]}")
                label.pack(ipadx=50,ipady=50)
                root.update()
            else:
                label.config(text=f"Appuyez sur la touche \"Espace\" pour quitter\n\nAppuyez sur la touche \"Suppr\" pour relire le fichier actuel: {csv_files[current_file_index[0]-1]}")
                label.pack(ipadx=50,ipady=50)
                root.update()
        else:
            root.destroy()
            if os.path.exists('temp.wav'):
                os.remove('temp.wav')
    elif event.keysym == 'Delete':  # Suppr
        for i in range(3, 0, -1):
            label.config(text=str(i))
            root.update()
            time.sleep(1)
        if current_file_index[0] > 0:
            current_file_index[0] -= 1
        file_path = os.path.join('lots_csv', csv_files[current_file_index[0]])
        display_words_from_csv(file_path, root, label)
        current_file_index[0] += 1
        if current_file_index[0] < len(csv_files):
            label.config(text=f"Appuyez sur la touche \"Espace\" pour passer au fichier suivant: {csv_files[current_file_index[0]]}\nAppuyez sur la touche Suppr pour relire le fichier actuel: {csv_files[current_file_index[0]-1]}")
            label.pack(ipadx=50,ipady=50)
            root.update()
        else:
            label.config(text=f"Appuyez sur la touche \"Espace\" pour quitter\n\nAppuyez sur la touche \"Suppr\" pour relire le fichier actuel: {csv_files[current_file_index[0]-1]}")
            label.pack(ipadx=50,ipady=50)
            root.update()
    elif event.keysym == 'Escape':
        root.withdraw()
        root.destroy()
        if os.path.exists('temp.wav'):
            os.remove('temp.wav')
        sys.exit()

def main():
    # Créer la fenêtre principale
    root = tk.Tk()
    root.title("Affichage des mots")
    root.attributes('-fullscreen', True)
    root.configure(bg='#111111')

    # Configurer la police avec empâtement
    custom_font = tkfont.Font(family="Times New Roman", size=64, weight="bold")

    # Lister les fichiers CSV dans le dossier lots_csv
    csv_files = sorted([f for f in os.listdir('lots_csv') if f.endswith('.csv')])

    # Index du fichier actuel en référence
    current_file_index = [0]
    label = tk.Label(root, text=f"Fichier: {csv_files[0]}\n Appuyez sur la touche \"Espace\" pour commencer", font=custom_font, bg='#eeeeee')
    label.pack(expand=True, ipadx=50, ipady=50)

    # Lier l'événement de pression de la touche espace
    root.bind('<space>', lambda event: on_key_press(event, csv_files, current_file_index, root, label))
    root.bind('<Delete>', lambda event: on_key_press(event, csv_files, current_file_index, root, label))
    root.bind('<Escape>', lambda event: on_key_press(event, csv_files, current_file_index, root, label))

    # Démarrer la boucle principale de tkinter
    root.mainloop()

if __name__ == "__main__":
    main()
