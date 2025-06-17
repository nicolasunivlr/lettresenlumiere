import etapeImg from '../../assets/images/layoutexercices/etape.png';
import aideSequence from '../../assets/docs/aideSequences.pdf';
import bilanIcon from '../../assets/images/bilan-icon.svg';

const PageTitle = (props) => {
  const { title, sequence, onClick } = props;

  return (
    <>
      <div className='header__infos'>
        <div
          onClick={onClick && onClick}
          style={onClick && { cursor: 'pointer' }}
          className='header__etape'
        >
          <img src={etapeImg} alt='' />
          <p className=''>{title}</p>
        </div>
        { sequence ? (
            <p className='header__sequence'> {sequence}</p>
        ) : title === "Progression" ? (
            <p className='header__sequence'>
                <a
                    href={aideSequence} // Le chemin public du PDF fourni par file-loader
                    title="Aide pour les séquences"
                    target="_blank" // Ouvre dans un nouvel onglet
                    rel="noopener noreferrer" // Pour la sécurité
                    style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                    <img alt="Bilan" className="h-24 w-24 cursor-pointer ml-4"
                         src={bilanIcon}/>
                </a>
            </p>
        ): ''}
      </div>
    </>
  );
};

export default PageTitle;
