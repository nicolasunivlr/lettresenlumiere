import FlecheRefaire from '../../assets/images/icones/fleche-refaire.png';

const RedoButton = (props) => {
  const { onClick } = props;

  return (
    <div className='redoButton font-regular' onClick={onClick}>
      <img src={FlecheRefaire} alt='' />
    </div>
  );
};

export default RedoButton;
