import { useEffect } from 'react';

const ProgressBar = (props) => {
  const { content } = props;

  useEffect(() => {}, [content]);

  return (
    <div className='exercice__footer'>
      <ul className='progress'>
        {content.map((content, index) => (
          <li
            key={index}
            className={`progress__part ${
              content.isFinished === true ? 'progress__part--true' : ''
            }`}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressBar;
