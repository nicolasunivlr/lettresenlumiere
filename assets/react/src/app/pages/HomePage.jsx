import logo from '../assets/images/logoLettresEnLumieres.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { useUser } from '../contexts/UserContext';
import lockedIcon from '../assets/images/user-lock.svg';
import lockedOpenIcon from '../assets/images/user.svg';

const Home = () => {
  return (
    <div className='home'>
      <motion.img
        src={logo}
        alt='logo'
        className='home__logo'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className='home__selection'
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Link to='/login' className='home__link'>
          <p className='font-regular'>Identifié</p>
          <img src={lockedIcon} alt='Mode Identifié' />
        </Link>
        <Link to='/mainmenu' className='home__link'>
          <p className='font-regular'>Libre</p>
          <img src={lockedOpenIcon} alt='Mode Libre' />
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
