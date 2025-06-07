import Label from './Label';
import useSpeak from '../../hooks/useSpeak'; // ajout de l'import
import useConfig from '../../hooks/useConfig';

function LabelImage(props) {
  const {
    text,
    voiceLine,
    sound,
    format,
    onClick,
    isSelected,
    font,
    answer,
    imageSrc,
    audioUrl,
  } = props;

  const { speak } = useSpeak();
  const config = useConfig();

  const handleClick = () => {
    if (onClick) onClick();
    if (sound) {
      speak(voiceLine ? voiceLine : text);
    }
  };

  return (
    <div
      className='label-wrapper'
      key={`${text}`}
      onClick={handleClick}
      style={
        onClick || voiceLine ? { cursor: 'pointer' } : { cursor: 'default' }
      }
    >
      <div className='label__image-responsive overflow-hidden flex justify-center items-center'>
        <img
          src={`${config.imagesUrl}/${imageSrc}`}
          alt={text}
          className='object-contain mb-2 w-auto h-auto max-w-[100%] max-h-[100%]'
        />
      </div>
      <Label
        key={`${text}-label`}
        text={text ?? null}
        voiceLine={voiceLine ?? null}
        sound={sound ?? null}
        onClick={onClick ?? null}
        isSelected={isSelected ?? null}
        font={font ?? null}
        answer={answer ?? null}
        format={format ?? null}
        audioUrl={audioUrl ?? null}
      />
    </div>
  );
}

export default LabelImage;
