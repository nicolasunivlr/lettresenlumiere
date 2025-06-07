const CircleProgress = (props) => {
  const { score, active, onClick, number } = props;

  const getCircleColor = (score) => {
    switch (true) {
      case score <= 25:
        return '#b91c1c'; //v.$rouge
      case score <= 50:
        return 'orange';
      case score <= 75:
        return 'yellow';
      case score <= 100:
        return '#166534'; //v.$vert
    }
  };

  return (
    <div
      className={active ? 'circle circle--active' : 'circle'}
      style={{
        backgroundColor: getCircleColor(score),
        color: score > 75 || score <= 25 ? 'white' : '',
      }}
      onClick={onClick}
    >
      {number}
    </div>
  );
};

export default CircleProgress;
