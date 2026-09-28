import { useEffect } from 'react';
import { ITEM_STATUS } from '../../constants/exerciseAttempts';

/**
 * Retourne le modificateur de classe CSS correspondant au statut d'un item.
 * Statuts possibles : pending (non fait, sans couleur), success (réussi,
 * vert), partial (réussi après plusieurs essais, jaune), failed (échec après
 * 4 essais, rouge).
 *
 * Compatibilité ascendante : si l'item n'a pas de `status` mais un ancien
 * booléen `isFinished`, on le traduit en success/pending.
 */
const getStatusClass = (item) => {
  const status =
    item?.status ??
    (item?.isFinished === true ? ITEM_STATUS.SUCCESS : ITEM_STATUS.PENDING);

  switch (status) {
    case ITEM_STATUS.SUCCESS:
      return 'progress__part--true';
    case ITEM_STATUS.PARTIAL:
      return 'progress__part--partial';
    case ITEM_STATUS.FAILED:
      return 'progress__part--false';
    default:
      return '';
  }
};

const ProgressBar = (props) => {
  const { content } = props;

  useEffect(() => {}, [content]);

  return (
    <div className='exercice__footer'>
      <ul className='progress'>
        {content.map((item, index) => (
          <li
            key={index}
            className={`progress__part ${getStatusClass(item)}`}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressBar;
