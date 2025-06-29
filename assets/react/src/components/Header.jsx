import logoLettres from '../assets/images/Logolettresenlumiere.png';
import QuitButton from './UI/QuitButton';
import PageTitle from './UI/PageTitle';
import Consigne from './Instruction';
import Search from "./Search";
import VideoModal from './UI/VideoModal';
import BilanIcon from '../assets/images/bilan-icon.svg';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const {
    pageName,
    sequence,
    link,
    consigne,
    video,
    openBilan,
    haveQuitButton,
    isVideoOpenOnMount,
    onSearchTermChange,
  } = props;
  const navigate = useNavigate();

  return (
    <header className='header'>
      {pageName ? (
        <PageTitle
          title={pageName}
          sequence={sequence}
          onClick={
            pageName && pageName.split(' ')[0] === 'Étape'
              ? () => navigate(`/etapes/${pageName.split(' ')[1]}`)
              : undefined
          }
        />
      ) : (
        <img src={logoLettres} alt='Page des étapes' className='header__logo' />
      )}
      {consigne && <Consigne consigne={consigne} />}
      {openBilan && (
        <img
          src={BilanIcon}
          onClick={openBilan}
          alt='Bilan'
          className='h-24 w-24 cursor-pointer ml-4'
        />
      )}
      {video && (
        <VideoModal sequence={video} isOpenOnMount={isVideoOpenOnMount} />
      )}
      { pageName === "Progression" ? (
        <Search onSearchChange={onSearchTermChange} />
        ) : null }
      {haveQuitButton === undefined || haveQuitButton === true ? (
        <QuitButton link={link} className='py-4 px-4 w-96' />
      ) : null}
    </header>
  );
};

export default Header;
