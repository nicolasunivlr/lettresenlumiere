import { Link } from 'react-router-dom';

const OKButton = (props) => {
  const { onClick, link } = props;

  return (
    <Link to={link}>
      <div className='okButton font-regular' onClick={onClick}>
        <p>OK</p>
      </div>
    </Link>
  );
};
export default OKButton;
