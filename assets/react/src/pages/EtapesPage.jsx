import ScrollDownArrow from '../components/UI/ScrollDownArrow';
import Header from '../components/Header';
import Accordion from '../components/UI/Accordion';
import EtapesButton from '../components/UI/EtapesButton';
import useDataEtapes from '../hooks/api/useDataEtapes';
import Loader from '../components/UI/Loader'; // Ajout du composant Loader
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function EtapesPage() {
  const etapesData = useDataEtapes();
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  if (!etapesData) {
    return (
      <div className='loader-container'>
        <Loader />
      </div>
    );
  }

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm.toLowerCase());
    };

    const handleAccordionToggle = (accordionId, isOpen) => {
        if (isOpen) {
            // Si un accordéon s'ouvre, mettre à jour l'URL avec son ID
            navigate(`/etapes/${accordionId}`, { replace: true });
        } else {
            // Si un accordéon se ferme, revenir à l'URL de base
            navigate('/etapes', { replace: true });
        }
    };

    const etapesFiltrees = etapesData.filter(etape => {
        if (!searchTerm) {
            return true;
        }
        if (etape.sequences && etape.sequences.length > 0) {
            // Vérifier si au moins une séquence correspond
            return etape.sequences.some(sequence => {
                const sequenceNomLower = sequence.nom.toLowerCase();
                return sequenceNomLower.includes(searchTerm);
            });
        }
        return false;
    });

  return (
    <>
      <Header link='/' pageName={'Progression'} onSearchTermChange={handleSearchChange} />
        {searchTerm ? (
            // Affichage en liste directe si searchTerm est non vide
            <div className="etapes-list-container px-4 py-2">
                {etapesFiltrees.length > 0 ? (
                    etapesFiltrees.flatMap((etape, etapeIndex) => {
                        const etapeNumberMatch = etape.nom.match(/Étape\s+(\d+)/i);
                        const etapeNumber = etapeNumberMatch
                            ? etapeNumberMatch[1]
                            : etapeIndex + 1;

                        // Afficher uniquement les séquences qui correspondent au terme de recherche ET ne contiennent pas "bilan"
                        const sequencesFiltrees = etape.sequences.filter(sequence =>
                            sequence.nom.toLowerCase().includes(searchTerm) && !sequence.nom.toLowerCase().includes('bilan')
                        );

                        if (sequencesFiltrees.length > 0) {
                            return sequencesFiltrees.map((sequence) => (
                                <EtapesButton
                                    key={`${etape.nom}-${sequence.id}`}
                                    id={sequence.id}
                                    link={`/sequence/${sequence.id}`}
                                    // Mettre en évidence le nom de l'étape et la séquence
                                    text={`${etape.nom} - ${sequence.nom}`}
                                    py={16}
                                    width='100%'
                                    className="mb-2"
                                />
                            ));
                        }
                        return [];
                    })
                ) : (
                    <div className="text-center py-4">Aucun exercice trouvé pour "{searchTerm}"</div>
                )}
            </div>
        ) : (
      <Accordion defaultOpenId={id} onToggle={handleAccordionToggle}>
        {etapesFiltrees.map((etape, index) => {
          // Extract the number from "Étape X" using regex
          const etapeNumberMatch = etape.nom.match(/Étape\s+(\d+)/i);
          const etapeNumber = etapeNumberMatch
            ? etapeNumberMatch[1]
            : index + 1;

          return (
            <div
              key={index}
              title={etape.nom}
              content={
                etape.sequences && etape.sequences.length > 0 ? (
                  etape.sequences.map((sequence) => (
                    <EtapesButton
                      key={sequence.id}
                      id={sequence.id}
                      link={`/sequence/${sequence.id}`}
                      text={sequence.nom}
                      py={32}
                      width='100%'
                    />
                  ))
                ) : (
                  <div>Pas de séquence pour le moment</div>
                )
              }
            />
          );
        })}
      </Accordion>
        )}
      <ScrollDownArrow />
    </>
  );
}

export default EtapesPage;
