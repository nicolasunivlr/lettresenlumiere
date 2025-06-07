import Speaker from '../components/UI/Speaker';
import Header from '../components/Header';
import OKButton from '../components/UI/OKButton';
import Consigne from '../components/Consigne';

const GraphemesHome = () => {
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
    const rgb = parseInt(color.substring(1), 16);
    const luma =
      0.2126 * ((rgb >> 16) / 255) +
      0.7152 * (((rgb >> 8) & 0xff) / 255) +
      0.0722 * ((rgb & 0xff) / 255);
    return luma < 0.5;
  };

  return (
    <>
      <Header link={'/'} pageName={'Graphèmes'} />
      <main className='graphemes ml-16'>
        <div className='flex items-center gap-2'>
          <Consigne consigne='Écoute et répète' />
        </div>
        <div>
          {graphemes.map((g, index) => (
            <div
              key={index}
              style={{
                color: isDarkColor(g.color) ? '#FFFFFF' : '#000000',
                padding: '10px',
                margin: '5px 0',
              }}
              className='grapheme__elements'
            >
              <Speaker voiceLine={g.grapheme[0]} />
              {g.grapheme.map((graphemeElement, index) => (
                <div
                  className='grapheme__fonts'
                  style={{ backgroundColor: g.color }}
                  key={index}
                >
                  <p
                    style={{ margin: '5px 0' }}
                    className='grapheme__item font-script'
                  >
                    {graphemeElement}
                  </p>
                  <p
                    style={{ margin: '5px 0' }}
                    className='grapheme__item font-cursiv'
                  >
                    {graphemeElement}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* <p className="graphemes__next"><Link to="exercices/a1" >S'entraîner </Link><img src={imageTraining} alt="" /> </p> */}

        <OKButton link={'/exercices/a1'} />
      </main>
    </>
  );
};

export default GraphemesHome;
