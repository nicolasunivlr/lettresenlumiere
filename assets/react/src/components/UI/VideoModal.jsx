import { useState, useRef, useEffect } from 'react';
import camera from '../../assets/images/camera.svg';
import useConfig from '../../hooks/useConfig';

const VideoModal = (props) => {
  const { sequence, title, isOpenOnMount } = props;
  const [isOpen, setIsOpen] = useState(isOpenOnMount ?? false);
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const config = useConfig();

  useEffect(() => {
    if (isOpen && videoRef.current) {
      try {
        // Stocker la promesse de lecture pour pouvoir l'annuler si nécessaire
        playPromiseRef.current = videoRef.current.play();

        // Gestion des erreurs lors de la lecture
        if (playPromiseRef.current) {
          playPromiseRef.current.catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Erreur de lecture vidéo:', error);
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors de la tentative de lecture vidéo:', error);
      }
    } else if (videoRef.current) {
      try {
        // S'assurer que la promesse précédente est traitée avant de manipuler la vidéo
        const handlePause = async () => {
          if (playPromiseRef.current) {
            try {
              await playPromiseRef.current;
            } catch (error) {
              // Ignorer les erreurs AbortError qui sont attendues
              if (error.name !== 'AbortError') {
                console.error(
                  "Erreur lors de l'attente de la promesse de lecture:",
                  error
                );
              }
            }
          }

          // Vérifier que la référence existe toujours avant de manipuler
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        };

        handlePause();
      } catch (error) {
        console.error('Erreur lors de la pause de la vidéo:', error);
      }
    }

    // Nettoyer lors du démontage du composant
    return () => {
      // Récupérer et traiter la promesse en cours si elle existe
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          })
          .catch((error) => {
            // Ignorer les erreurs AbortError qui sont attendues lors du démontage
            if (error.name !== 'AbortError') {
              console.error(
                'Erreur lors du nettoyage de la lecture vidéo:',
                error
              );
            }
          });
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!sequence.video_url) {
      setIsOpen(false);
    }
  }, [sequence]);

  // Définir les composants internes séparément
  const CameraButton = () => (
    <img
      className='h-30 w-30 camera'
      src={camera}
      alt='Camera'
      onClick={() => setIsOpen(true)}
      style={{ cursor: 'pointer' }}
    />
  );

  const VideoContent = () => (
    <div
      className='modal opened'
      id='videoModal'
      onClick={() => setIsOpen(false)}
    >
      <div
        className='modal-content__video'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='videoBox h-full'>
          <div className='videoBox__header'>
            <h2>{sequence?.nom ?? title}</h2>
            <span
              className='close'
              id='closeModal'
              onClick={() => setIsOpen(false)}
              style={{ cursor: 'pointer' }}
            >
              &times;
            </span>
          </div>
          <video
            ref={videoRef}
            autoPlay
            width='100%'
            src={`${config.videosUrl}${sequence?.video_url}`}
            title={sequence?.nom ?? 'Video sequence'}
            type='video/mp4'
            controls
          />
        </div>
      </div>
    </div>
  );

  // Retourner seulement les composants nécessaires
  if (isOpen) {
    return (
      <>
        <CameraButton />
        <VideoContent />
      </>
    );
  }

  return <CameraButton />;
};

export default VideoModal;
