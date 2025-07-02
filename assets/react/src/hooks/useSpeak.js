import { useCallback, useState, useEffect } from 'react';
import useConfig from './useConfig';
import sound1 from '../assets/sons/graphemes/in.mp3';
import sound2 from '../assets/sons/graphemes/an.mp3';
import sound3 from '../assets/sons/graphemes/au.mp3';
import sound4 from '../assets/sons/graphemes/eu.mp3';
import sound5 from '../assets/sons/graphemes/on.mp3';
import sound6 from '../assets/sons/graphemes/ou.mp3';
import sound7 from '../assets/sons/graphemes/oi.mp3';
import sound8 from '../assets/sons/graphemes/eaigue.mp3';
import sound9 from '../assets/sons/graphemes/egrave.mp3';
import sound10 from '../assets/sons/graphemes/ien.mp3';

const graphemeToSoundMap = {
  in: sound1,
  un: sound1,
  an: sound2,
  en: sound2,
  au: sound3,
  eau: sound3,
  eu: sound4,
  oeu: sound4,
  on: sound5,
  ou: sound6,
  oi: sound7,
  'é': sound8,
  'è': sound9,
  ien: sound10,
  _ed: sound8,
  _er: sound8,
  _es: sound8,
  _ez: sound8,
  et: sound9,
  est: sound9,
  ai: sound9,
  ei: sound9,
};

const pronunciationMap = {
  fo: 'pheau',
  fe: 'pheu',
  fu: 'phu',
  'œu': 'eu',
  vi: 'vie',
  ve: 'veu',
  dre: 'dreu',
  bre: 'breu',
  tre: 'treu',
  lun: 'lain',
  lo: 'lau',
  bus: 'busse',
  pha: 'fa',
  pho: 'faux',
  phe: 'feu',
  phy: 'fie',
  phan: 'phant',
  phin: 'faim',
  'phé': 'fée',
  choi: 'choix',
  ple: 'pleu',
  ar: 'arre',
  ol: 'olle',
  ir: 'irre',
  jo: 'jau',
  ja: 'jha',
  be: 'beu',
  che: 'cheu',
  chu: 'shuu',
  pa: 'pas',
  pe: 'peu',
  ble: 'bleu',
  vre: 'vreu',
  to: 'taux',
  tra: 'trah',
  gna: 'nia',
  gne: 'gneu',
  gnu: 'niu',
  za: 'zah',
  ze: 'zeu',
  zi: 'zie',
  cu: 'cul',
  cre: 'creu',
  ac: 'acque',
  ca: 'k',
  gui: 'guille',
  gue: 'gueu',
  ban: 'banc',
  ven: 'vent',
  men: 'ment',
  line: 'lyne',
  am: 'an',
  em: 'an',
  om: 'on',
  ome: 'homme',
  im: 'in',
  coin: 'coing',
  poin: 'poing',
  join: 'joint',
  by: 'bi',
  my: 'mi',
  ly: 'li',
  'tê': 'tè',
  rai: 'rais',
  pei: 'pais',
  sei: 'sais',
  shan: 'champs',
  ge: 'jeu',
  gen: 'gens',
  gi: 'ji',
  gean: 'jean',
};

const replacePronunciation = (text) => {
  return pronunciationMap[text] || text;
};

const isGrapheme = (text) => {
  return graphemeToSoundMap[text] || null;
};

const waitForVoices = async () => {
  return new Promise((resolve) => {
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        setTimeout(checkVoices, 50);
      }
    };
    checkVoices();
  });
};

const useSpeak = () => {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [defaultVoice, setDefaultVoice] = useState(null);
  const config = useConfig();

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await waitForVoices();

      // Définir une voix par défaut en français
      const fallbackVoice = availableVoices.find((v) => (v.lang === 'fr-FR' || v.lang === 'fr'));
      setDefaultVoice(fallbackVoice || null);

      console.log("Voix par défaut définie :", fallbackVoice ? fallbackVoice.name : "Aucune voix par défaut trouvée");

      // Ordre de priorité pour la recherche des voix
      const voicePriorities = [
        'Microsoft Denise Online (Natural) - French (France)',
        'Microsoft Henri Online (Natural) - French (France)',
        'Hortense',
        'Google français',
      ];

      // Rechercher les voix dans l'ordre de priorité
      let foundVoice = null;

      for (const voiceName of voicePriorities) {
        foundVoice = availableVoices.find(
          (v) => v.name.includes(voiceName) && v.lang.includes('fr')
        );

        if (foundVoice) {
          console.log("Voix trouvée :", foundVoice.name);
          setSelectedVoice(foundVoice);
          break;
        }
      }

      if (!foundVoice) {
        setSelectedVoice(fallbackVoice);
        console.log("Veuillez installer une synthèse vocale française...");
      }
    };

    // Charger les voix initialement
    loadVoices();

    // Réagir aux changements de voix disponibles
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text) => {
      window.speechSynthesis.cancel();

      text = replacePronunciation(text);

      const sound = isGrapheme(text);
      if (sound) {
        const audio = new Audio(sound);
        audio.play();
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9; // Légèrement plus lent pour plus de clarté
        utterance.pitch = 1.0; // Ton normal

        // Utiliser la voix sélectionnée ou celle par défaut
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else if (defaultVoice) {
          utterance.voice = defaultVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    },
    [selectedVoice, defaultVoice]
  );

  const speakArray = useCallback(
    (items) => {
      window.speechSynthesis.cancel();

      const playNextItem = (index) => {
        if (index >= items.length) return;
        let contenu, mp3;

        if(typeof items[index] === 'object') {
          mp3 = items[index].sons_url || false
          contenu = items[index].element;
        } else {
          contenu = items[index];
        }

        const text = replacePronunciation(contenu);
        const sound = isGrapheme(text);
        //console.log(items[index],text, sound, mp3)

        const playNext = () => {
          setTimeout(() => {
            playNextItem(index + 1);
          }, 100);
        };

        if (sound) {
          const audio = new Audio(sound);
          audio.onended = playNext;
          audio.play();
        } else if (mp3) {
          const url = `${config.audiosUrl}/${mp3}`;
          const audio = new Audio(url);
          audio.play();
        } else {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'fr-FR';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;

          if (selectedVoice) {
            utterance.voice = selectedVoice;
          } else if (defaultVoice) {
            utterance.voice = defaultVoice;
          }

          utterance.onend = playNext;
          window.speechSynthesis.speak(utterance);
        }
      };

      playNextItem(0);
    },
    [selectedVoice, defaultVoice]
  );

  return { speak, speakArray };
};

export default useSpeak;
