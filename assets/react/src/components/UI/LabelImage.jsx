import { config } from "../../config";
import Label from "./Label";
import { useRef } from "react";

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

  const labelRef = useRef(null);

  const handleContainerClick = () => {
    // 1. Déclencher la lecture du son dans le composant Label
    if (labelRef.current) {
      labelRef.current.triggerClick();
    }

    // 2. Exécuter la fonction onClick passée en props (si elle existe)
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="label-wrapper"
      key={`${text}`}
      onClick={handleContainerClick}
      style={
        onClick || voiceLine ? { cursor: "pointer" } : { cursor: "default" }
      }
    >
      <div className="label__image-responsive overflow-hidden flex justify-center items-center">
        <img
          src={`${config.imagesUrl}/${imageSrc}`}
          alt={text}
          className="object-contain mb-2 w-auto h-auto max-w-[100%] max-h-[100%]"
        />
      </div>
      <Label
        isControlled={true}
        ref={labelRef}
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
