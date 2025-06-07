import print from '../../assets/images/print_icon.svg';
import { useState } from 'react';
import PDFPage from './PDFPage';
import { PDFViewer } from '@react-pdf/renderer';

const PDFModal = (props) => {
  const { content, sequence, etapeid, score } = props;
  const [showPDF, setShowPDF] = useState(false);
  return (
    <>
      <img
        className='print-icon'
        src={print}
        alt='imprimer'
        onClick={() => setShowPDF(true)}
      />
      <div
        className={showPDF ? 'modal opened' : 'modal closed'}
        onClick={() => setShowPDF(false)}
      >
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <div className='pdf__header'>
            <span
              className='close'
              id='closeModal'
              onClick={() => setShowPDF(false)}
              style={{ cursor: 'pointer' }}
            >
              &times;
            </span>
          </div>
          <PDFViewer width='100%' height='90%'>
            <PDFPage
              content={content}
              sequence={sequence}
              etapeid={etapeid}
              score={score}
            />
          </PDFViewer>
        </div>
      </div>
    </>
  );
};

export default PDFModal;
