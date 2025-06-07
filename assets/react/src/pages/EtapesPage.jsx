import ScrollDownArrow from '../components/UI/ScrollDownArrow';
import Header from '../components/Header';
import Accordion from '../components/UI/Accordion';
import EtapesButton from '../components/UI/EtapesButton';
import useDataEtapes from '../hooks/api/useDataEtapes';
import Loader from '../components/UI/Loader'; // Ajout du composant Loader

function EtapesPage() {
  const etapesData = useDataEtapes();

  if (!etapesData) {
    return (
      <div className='loader-container'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Header link='/' pageName={'Progression'} />
      <Accordion>
        {etapesData.map((etape, index) => {
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
                      key={sequence.sequence_id}
                      id={sequence.sequence_id}
                      link={`${etapeNumber}/sequence/${sequence.sequence_id}`}
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
      <ScrollDownArrow />
    </>
  );
}

export default EtapesPage;
