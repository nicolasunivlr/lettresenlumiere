import ScrollDownArrow from "../../shared/components/UI/ScrollDownArrow";
import Header from "../../shared/components/Header";
import Accordion from "../../shared/components/UI/Accordion";
import EtapesButton from "../../shared/components/UI/EtapesButton";
import Loader from "../../shared/components/UI/Loader"; // Ajout du composant Loader
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import useDataEtapes from "../../shared/hooks/api/useDataEtapes";
import useProgressionScores, {
  getMedalFromScore,
} from "../../shared/hooks/api/useProgressionScores";

/**
 * Calcule la **Coupe** de l'étape : moyenne des scores des séquences de l'étape.
 */
const getEtapeTrophy = (etape, scoreBySequenceId) => {
  if (!etape?.sequences?.length) return null;
  let sum = 0;
  let count = 0;
  for (const seq of etape.sequences) {
    const score = scoreBySequenceId[seq.id];
    if (score != null && !Number.isNaN(score)) {
      sum += score;
      count++;
    }
  }
  const avg = count > 0 ? sum / count : 0;
  return getMedalFromScore(avg);
};

/**
 * Calcule la **Médaille** d'une séquence (son propre score).
 */
const getSequenceMedal = (sequenceId, scoreBySequenceId) => {
  const score = scoreBySequenceId[sequenceId];
  if (score == null || Number.isNaN(score)) return null;
  return getMedalFromScore(score);
};

function EtapesPage() {
  const etapesData = useDataEtapes();
  const { scoreBySequenceId } = useProgressionScores();
  const [searchTerm, setSearchTerm] = useState("");

  // --- Router --- //
  const [searchParams, setSearchParams] = useSearchParams();
  // --- Router --- //

  if (!etapesData) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm.toLowerCase());
  };

  const handleAccordionToggle = (accordionId, isOpen) => {
    if (isOpen) {
      // Si un accordéon s'ouvre, mettre à jour l'URL avec ID de l'étape correspondante
      setSearchParams({ id: accordionId }, { replace: true });
    } else {
      // Si un accordéon se ferme, revenir à l'URL de base
      setSearchParams({}, { replace: true });
    }
  };

  const etapesFiltrees = etapesData.filter((etape) => {
    if (!searchTerm) {
      return true;
    }
    if (etape.sequences && etape.sequences.length > 0) {
      // Vérifier si au moins une séquence correspond
      return etape.sequences.some((sequence) => {
        const sequenceNomLower = sequence.nom.toLowerCase();
        return sequenceNomLower.includes(searchTerm);
      });
    }
    return false;
  });

  return (
    <>
      <Header
        link="/"
        pageName={"Progression"}
        onSearchTermChange={handleSearchChange}
      />
      {searchTerm ? (
        // Affichage en liste directe si searchTerm est non vide
        <div className="etapes-list-container px-4 py-2">
          {etapesFiltrees.length > 0 ? (
            etapesFiltrees.flatMap((etape, etapeIndex) => {
              // Afficher uniquement les séquences qui correspondent au terme de recherche ET ne contiennent pas "bilan"
              const sequencesFiltrees = etape.sequences.filter(
                (sequence) =>
                  sequence.nom.toLowerCase().includes(searchTerm) &&
                  !sequence.nom.toLowerCase().includes("bilan"),
              );

              if (sequencesFiltrees.length > 0) {
                return sequencesFiltrees.map((sequence) => (
                  <EtapesButton
                    key={`${etape.nom}-${sequence.id}`}
                    id={sequence.id}
                    link={`/sequence/${sequence.id}`}
                    text={`${etape.nom} - ${sequence.nom}`}
                    py={16}
                    width="100%"
                    className="mb-2"
                    medalType={getSequenceMedal(sequence.id, scoreBySequenceId)}
                  />
                ));
              }
              return [];
            })
          ) : (
            <div className="text-center py-4">
              Aucun exercice trouvé pour "{searchTerm}"
            </div>
          )}
        </div>
      ) : (
        <Accordion
          defaultOpenId={searchParams.get("id") || null}
          onToggle={handleAccordionToggle}
        >
          {etapesFiltrees.map((etape, index) => {
            const etapeMedal = getEtapeTrophy(etape, scoreBySequenceId);
            return (
              <div
                key={index}
                title={etape.nom}
                titleTrophy={etapeMedal}
                content={
                  etape.sequences && etape.sequences.length > 0 ? (
                    etape.sequences.map((sequence) => (
                      <EtapesButton
                        key={sequence.id}
                        id={sequence.id}
                        link={`/sequence/${sequence.id}`}
                        text={sequence.nom}
                        py={32}
                        width="100%"
                        medalType={getSequenceMedal(
                          sequence.id,
                          scoreBySequenceId,
                        )}
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
