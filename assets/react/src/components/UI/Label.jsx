import useSpeak from '../../hooks/useSpeak';
import hautParleur from '../../assets/images/haut-parleur.svg';
import useConfig from '../../hooks/useConfig';

function Label(props) {
  const {
    text,
    voiceLine,
    sound,
    format,
    onClick,
    isSelected,
    font,
    answer,
    audioUrl,
    useArraySpeak,
  } = props;

  const fontClass = (() => {
    if (font === 'script') {
      return 'font-script';
    } else if (font === 'cursive') {
      return 'font-cursiv';
    } else if (font === 'cursiveupp') {
      return 'font-cursivupp';
    } else {
      return 'font-regular';
    }
  })();

  const { speak, speakArray } = useSpeak();
  const config = useConfig();

  const handleOnClick = (voiceLine) => {
    if (audioUrl) {
      const url = `${config.audiosUrl}/${audioUrl}`;
      const audio = new Audio(url);
      audio.play();
    } else if (useArraySpeak && Array.isArray(voiceLine)) {
      speakArray(voiceLine);
    } else {
      speak(voiceLine);
    }
  };

  const handleTextformat = () => {
    if (!format || !Array.isArray(format) || !text) return text;

    // Créer une copie du texte sous forme de tableau de caractères
    const textArray = text.split('');

    // Créer un tableau de formats pour chaque caractère
    const formatMap = Array(textArray.length).fill(null);

    // Appliquer les règles de formatage
    format.forEach((item) => {
      const { couleur, lettres, bold } = item;

      if (lettres) {
        if (lettres.includes('-')) {
          // Gérer la plage de lettres (ex: "3-4")
          const [start, end] = lettres.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            if (i >= 0 && i < textArray.length) {
              formatMap[i] = {
                color: couleur?.code,
                bold: couleur?.bold || false,
              };
            }
          }
        } else {
          // Gérer un index unique (ex: "2")
          const index = Number(lettres);
          if (index >= 0 && index < textArray.length) {
            formatMap[index] = { color: couleur?.code, bold: bold || false };
          }
        }
      }
    });

    // Créer des spans avec le formatage approprié
    return (
      <>
        {textArray.map((char, index) => (
          <span
            key={`${char}-${index}`}
            style={{
              color: formatMap[index]?.color || 'inherit',
              fontWeight: formatMap[index]?.bold ? 'bold' : 'normal',
            }}
          >
            {char}
          </span>
        ))}
      </>
    );
  };

  return (
    <>
      {sound ? (
        <div
          className={`label ${fontClass} py-6 px-14 rounded-2xl relative ${
            isSelected && 'label--selected'
          } ${
            answer === true ? 'label--true' : answer === false && 'label--false'
          }`}
          onClick={() =>
            handleOnClick(voiceLine ? voiceLine : text, onClick && onClick())
          }
        >
          <div className='absolute top-2 right-2'>
            <img className='h-6 w-6' src={hautParleur} alt='Speaker' />
          </div>

          {text && <p>{handleTextformat()}</p>}
        </div>
      ) : (
        <div
          className={`label ${fontClass} py-6 px-14 rounded-2xl relative ${
            isSelected && 'label--selected'
          } ${
            answer === true ? 'label--true' : answer === false && 'label--false'
          }`}
          onClick={onClick}
        >
          {text && <p>{handleTextformat()}</p>}
        </div>
      )}
    </>
  );
}

export default Label;
