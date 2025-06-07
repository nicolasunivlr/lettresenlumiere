// src/hooks/useConfig.js
import { useState } from 'react';

const useConfig = () => {
  // pas besoin de defaultBaseUrl, car tout est imbriqué dans l'application
  const defaultBaseUrl = process.env.NODE_ENV === 'production'
            ? '/lettresenlumiere'
            : '';

  // Chemins relatifs
  const paths = {
    apiEtapes: '/api/custom/etapes',
    apiSequences: '/api/custom/sequences',
    imagesUrl: '/images',
    videosUrl: '/sequencevideos',
    audiosUrl: '/audios',
  };

  // Vérifier si window.appConfig existe dès l'initialisation
  const baseUrl =
    window.appConfig && window.appConfig.apiBaseUrl
      ? window.appConfig.apiBaseUrl
      : defaultBaseUrl;

  // Initialiser directement avec les bonnes valeurs
  const [config] = useState({
    apiBaseUrl: baseUrl,
    apiEtapes: `${baseUrl}${paths.apiEtapes}`,
    apiSequences: `${baseUrl}${paths.apiSequences}`,
    imagesUrl: `${baseUrl}${paths.imagesUrl}`,
    videosUrl: `${baseUrl}${paths.videosUrl}`,
    audiosUrl: `${baseUrl}${paths.audiosUrl}`,
  });

  return config;
};

export default useConfig;
