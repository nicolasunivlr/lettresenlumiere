import Arrow from '../../assets/images/chevron_accordion.svg';
import { useState, useEffect } from 'react';

const ScrollDownArrow = () => {
  const [showArrow, setShowArrow] = useState(true);
  const handleScroll = () => {
    // Afficher la flèche si on est tout en haut de la page
    if (window.pageYOffset === 0) {
      setShowArrow(true);
      return;
    }

    const scrollPosition = window.pageYOffset;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    setShowArrow(scrollPosition < maxScroll - 200);
  };

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.4, // 40vh
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {showArrow && (
        <div className='container-arrow' onClick={scrollDown}>
          <img src={Arrow} alt='Défiler vers le bas' />
        </div>
      )}
    </>
  );
};

export default ScrollDownArrow;
