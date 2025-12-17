import { Link } from 'react-router-dom';

const Error = ({
                       title = 'Erreur',
                       message = "Une erreur inattendue s'est produite.",
                       linkTo = '/',
                       linkText = "Retour à l'accueil",
                   }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                textAlign: 'center',
                padding: '20px',
                fontSize: '3rem'
            }}
        >
            <h1>{title}</h1>
            <p>{message}</p>
            <Link to={linkTo} className="quitButton m-8">
                {linkText}
            </Link>
        </div>
    );
};

export default Error;