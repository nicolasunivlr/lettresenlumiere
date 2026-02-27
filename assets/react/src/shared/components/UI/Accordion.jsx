import { useEffect, useState } from 'react';
import BronzeCoupe from '../../../assets/images/gamification/coupe_bronze.png';
import SilverCoupe from '../../../assets/images/gamification/coupe_argent.png';
import GoldCoupe from '../../../assets/images/gamification/coupe_or.png';

const medalsSvg = { bronze: BronzeCoupe, silver: SilverCoupe, gold: GoldCoupe };

const Accordion = ({ children, defaultOpenId, onToggle }) => {
  const [accordionList, setAccordionList] = useState([]);

  useEffect(() => {
    const initialAccordionList = children.map((child, index) => {
      const accordionId = `${index + 1}`;
      return {
        accordionId: accordionId,
        isOpen: accordionId === defaultOpenId,
      };
    });
    setAccordionList(initialAccordionList);
  }, [children, defaultOpenId]);

  const toggleAccordion = (accordionId) => {
    // Trouver l'état actuel de l'accordéon cliqué
    const currentAccordion = accordionList.find(
        (acc) => acc.accordionId === accordionId
    );
    const newIsOpenState = !currentAccordion.isOpen;

    setAccordionList((prevList) =>
        prevList.map((accordion) =>
            accordion.accordionId === accordionId
                ? { ...accordion, isOpen: newIsOpenState }
                : { ...accordion, isOpen: false }
        )
    );

    // 2. Appeler la fonction onToggle si elle existe
    if (onToggle) {
      onToggle(accordionId, newIsOpenState);
    }
  };

  return (
    <section className='accordion-container'>
      {accordionList.map((accordion, index) => (
        <AccordionContent
          key={accordion.accordionId}
          id={accordion.accordionId}
          title={children[index].props.title}
          titleMedal={
            children[index].props.titleMedal ??
            children[index].props.titleTrophy
          }
          content={children[index].props.content}
          isOpen={accordion.isOpen}
          toggleAction={() => toggleAccordion(accordion.accordionId)}
          medalsSvg={medalsSvg}
        />
      ))}
    </section>
  );
};

const AccordionContent = ({
  id,
  title,
  titleMedal,
  content,
  isOpen,
  toggleAction,
  medalsSvg,
}) => {
  const medalSrc = titleMedal ? medalsSvg[titleMedal] : null;
  return (
    <>
      <div className='accordion font-regular'>
        <input
          id={`toggle${id}`}
          type='checkbox'
          className='accordion-toggle'
          name='toggle'
          checked={isOpen}
          readOnly
        />
        <label htmlFor={`toggle${id}`} onClick={toggleAction} className='flex items-center gap-2'>
          {title}
          {medalSrc && (
            <img
              src={medalSrc}
              alt={`Médaille ${titleMedal}`}
              className='w-20 h-20 shrink-0'
            />
          )}
        </label>
        <section>
          <div className='content'>{content}</div>
        </section>
      </div>
    </>
  );
};

export default Accordion;
