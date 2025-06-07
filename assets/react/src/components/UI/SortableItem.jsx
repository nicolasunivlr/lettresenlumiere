import { useSortable } from '@dnd-kit/sortable';

const SortableItem = ({
  id,
  letter,
  isValidated,
  letterStyle,
  disabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: disabled || isValidated === true || isValidated === false,
  });

  let styledLetter = letter;
  if (letterStyle) {
    styledLetter = letterStyle.isUppercase
      ? letter.toUpperCase()
      : letter.toLowerCase();
  }

  const fontClass = (() => {
    if (letterStyle?.font === 'script') {
      return 'font-script';
    } else if (letterStyle?.font === 'cursive') {
      return 'font-cursiv';
    } else if (letterStyle?.font === 'cursiveupp') {
      return 'font-cursivupp';
    } else {
      return 'font-regular';
    }
  })();

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    visibility: isDragging ? 'hidden' : 'visible',
  };

  let validationClass = '';
  if (isValidated === true) {
    validationClass = 'label--true';
  } else if (isValidated === false) {
    validationClass = 'label--false';
  }

  const disabledClass = disabled ? 'bg-gray-100 opacity-80' : '';

  return (
    <div
      ref={setNodeRef}
      className={`label label__drag py-10 px-14 rounded-2xl relative ${fontClass} ${validationClass} ${disabledClass}`}
      style={style}
      {...attributes}
      {...(disabled ? {} : listeners)}
    >
      {styledLetter}
    </div>
  );
};

export default SortableItem;
