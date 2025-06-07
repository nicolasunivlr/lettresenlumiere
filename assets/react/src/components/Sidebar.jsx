import CircleProgress from './UI/CircleProgress';

const Sidebar = (props) => {
  const { exercices, onClick, disabled } = props;

  const firstExerciseFalse = exercices.find(
    (exercice) => !exercice.done || exercice.done === 'pending'
  );

  return (
    <div className='sidebar-container'>
      <div className='sidebar'>
        {exercices.map((exercice, index) => (
          <CircleProgress
            key={`circle-${exercice.exercice_id}`}
            score={exercice.score}
            active={exercice === firstExerciseFalse}
            onClick={() => disabled ? null : onClick(exercice.exercice_id)}
            number={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
