const CircleProgress = (props) => {
  const { score, active, onClick, number } = props;

  // Vérification si le score est valide
  const isScoreAvailable = score !== null && score !== undefined;

  const getCircleColor = (score) => {
    if (!isScoreAvailable) return 'transparent'; // Pas de couleur si score est null/undefined

    switch (true) {
      case score <= 25:
        return '#b91c1c';
      case score <= 50:
        return 'orange';
      case score <= 75:
        return 'yellow';
      case score <= 100:
        return '#166534';
      default:
        return 'transparent'; // Si score est en dehors de l'intervalle
    }
  };

  return (
    <div
      className={active ? 'circle circle--active' : 'circle'}
      style={{
        backgroundColor: getCircleColor(score),
        color: isScoreAvailable && (score > 75 || score <= 25) ? 'white' : '',
        borderColor: isScoreAvailable ? 'transparent' : '#ccc', // Ajouter une bordure pour les cercles vides
      }}
      onClick={onClick}
    >
      {number}
    </div>
  );
};

export default CircleProgress;
