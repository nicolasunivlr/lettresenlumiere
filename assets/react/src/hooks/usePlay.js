import { useCallback } from 'react';
import useConfig from "./useConfig";

const usePlay = () => {
    const config = useConfig();

    const play = useCallback((content) => {
        // soit un objet avec une propriété sons_url soit le mp3 directement
        const mp3 = content.sons_url || content;
        const url = `${config.audiosUrl}/${mp3}`;
        const audio = new Audio(url);
        audio.play();
    })

    return { play };
}

export default usePlay;