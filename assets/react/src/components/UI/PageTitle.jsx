import etapeImg from '../../assets/images/layoutexercices/etape.png';
const PageTitle = (props) => {
  const { title, sequence, onClick } = props;

  return (
    <>
      <div className='header__infos'>
        <div
          onClick={onClick && onClick}
          style={onClick && { cursor: 'pointer' }}
          className='header__etape'
        >
          <img src={etapeImg} alt='' />
          <p className=''>{title}</p>
        </div>
        {sequence && <p className='header__sequence'> {sequence}</p>}
      </div>
    </>
  );
};

export default PageTitle;
