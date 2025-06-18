import Speaker from '../UI/Speaker';
import Instruction from '../Instruction';
import VideoModal from '../UI/VideoModal';
import { useEffect } from 'react';

const ExerciceTypeAGrapheme = (props) => {
  const { content, onDone } = props;

  useEffect(() => {
    onDone(100);
  }, [content]);
  const graphemes = [
    {
      color: '#3CA83D',
      grapheme: ['in', 'un'],
    },
    {
      color: '#F26A1B',
      grapheme: ['an', 'en'],
    },
    {
      color: '#F2E52E',
      grapheme: ['au', 'eau'],
    },
    {
      color: '#7BA1CE',
      grapheme: ['eu', 'œu'],
    },
    {
      color: '#B9829E',
      grapheme: ['ai', 'ei', 'est', 'et'],
    },
    {
      color: '#7B0D80',
      grapheme: ['_er', '_ez', '_es', '_ed'],
    },
    {
      color: '#EEEEEE',
      grapheme: ['ien'],
    },
    {
      color: '#B05C0E',
      grapheme: ['on'],
    },
    {
      color: '#F20002',
      grapheme: ['ou'],
    },
    {
      color: '#000000',
      grapheme: ['oi'],
    },
  ];

  const isDarkColor = (color) => {
    if (!color) return false;
    try {
      const rgb = parseInt(color.substring(1), 16);
      const luma =
        0.2126 * ((rgb >> 16) / 255) +
        0.7152 * (((rgb >> 8) & 0xff) / 255) +
        0.0722 * ((rgb & 0xff) / 255);
      return luma < 0.5;
    } catch (error) {
      console.error('Invalid color format:', color);
      return false;
    }
  };
  graphemes.map((element) => {
    element.grapheme.map((grapheme) => {
      let graphem = content.contenus.find((elem) => elem.element === grapheme);
      if (graphem) {
        graphem.color = element.color;
      }
    });
  });

  const graphemArray = Object.values(
    content.contenus.reduce((acc, elem) => {
      // Débogage : log de chaque élément traité
      acc[elem.color] = acc[elem.color] || [];
      acc[elem.color].push(elem);
      return acc;
    }, {})
  );

  return (
    <>
      <div className='flex items-center gap-2'>
        <Instruction instruction='Écoute et répète' />
      </div>
      <div className='graphemes ml-16'>
        {graphemArray.map((element, index) => (
          <div
            key={index}
            style={{
              color: isDarkColor(element[0].color) ? '#FFFFFF' : '#000000',
              padding: '10px',
              margin: '5px 0',
            }}
            className='grapheme__elements'
          >
            <Speaker voiceLine={element[0].element} />
            {element.map((el, i) => (
              <div className='flex flex-col items-center' key={i}>
                <span className='pb-6'>
                  <VideoModal
                    key={el.id}
                    sequence={el}
                    title={`Graphème "${el.element}"`}
                  />
                </span>
                <div
                  className='grapheme__fonts'
                  style={{ backgroundColor: el.color }}
                  key={i}
                >
                  <p
                    style={{ margin: '5px 0' }}
                    className='grapheme__item font-script'
                  >
                    {el.element && el.element}
                  </p>
                  <p
                    style={{ margin: '5px 0' }}
                    className='grapheme__item font-cursiv'
                  >
                    {el.element && el.element}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ExerciceTypeAGrapheme;
