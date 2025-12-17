import { Link } from 'react-router-dom';

const QuitButton = (props) => {
  const { link, className } = props;

  return (
    <Link
      to={link}
      className={`quitButton items-center ${className ? `${className}` : ''}`}
    >
      <p className='font-regular'>QUITTER</p>
      <span className=''>&times;</span>
    </Link>
  );
};

export default QuitButton;
