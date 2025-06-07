import logoBrain from '../assets/images/brainLogo.png';
import { Link } from 'react-router-dom';
import logoUpArrow from '../assets/images/purple-up-arrow.png';
import logoLeL from '../assets/images/Logolettresenlumiere.png';
import { motion } from 'framer-motion';
import RedirectButton from '../components/UI/RedirectButton';

const MainMenu = () => {
  return (
    <div className='index'>
      <img src={logoLeL} alt='Logo Brain' className='index__logo' />
      <main>
        <motion.div
          className='part'
          initial={{ y: -500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RedirectButton
            link='/etapes'
            className='homeButtonHaut h-32'
            label='Progression'
            image={logoUpArrow}
          />
        </motion.div>
        <div className='contenuPrincipal'>
          <motion.div
            className='part'
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RedirectButton
              link='/alphabet'
              text=' A B C - a b c'
              className='homeButtonGauche'
              label='Alphabet'
            />
          </motion.div>

          <motion.div
            className='index__logoBrain'
            initial={{ y: 100 }}
            animate={{
              y: [-10, 0, -10],
              transition: { duration: 1.5, repeat: Infinity },
            }}
          >
            <img src={logoBrain} alt='Logo Brain' />
          </motion.div>

          <motion.div
            className='part'
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RedirectButton
              link='/graphemes'
              text='an on in'
              className='homeButtonDroite'
              label='Graphèmes'
            />
          </motion.div>
        </div>
        <p className='home__credits'>
          <Link to='/credits'>Credits</Link>
        </p>
      </main>
    </div>
  );
};

export default MainMenu;
