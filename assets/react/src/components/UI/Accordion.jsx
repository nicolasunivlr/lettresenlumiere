import { useEffect, useState } from 'react';

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
          content={children[index].props.content}
          isOpen={accordion.isOpen}
          toggleAction={() => toggleAccordion(accordion.accordionId)}
        />
      ))}
    </section>
  );
};

const AccordionContent = ({ id, title, content, isOpen, toggleAction }) => {
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
        <label htmlFor={`toggle${id}`} onClick={toggleAction}>
          {title}
        </label>
        <section>
          <div className='content'>{content}</div>
        </section>
      </div>
    </>
  );
};

export default Accordion;
