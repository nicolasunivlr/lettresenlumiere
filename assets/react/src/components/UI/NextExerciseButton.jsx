import FlecheDroite from '../../assets/images/icones/flèche-droite.png';

const NextExerciseButton = (props) => {
  const { onClick } = props;

  return (
    <div className='nextExercise font-regular' onClick={onClick}>
      <img src={FlecheDroite} alt='' />
    </div>
  );
};

export default NextExerciseButton;
