import { Link } from 'react-router-dom';

const RedirectButton = (props) => {
  const {
    link,
    text,
    children,
    width,
    py,
    justify,
    className,
    label,
    icon,
    medal,
    image,
  } = props;

  return (
    <>
      {label && (
        <header className='redirectHeader'>
          <h3 className='redirectLabel'>{label}</h3>
          {icon && <img src={icon} className='redirectIcon' />}
        </header>
      )}
      <Link to={link} className='flex justify-center items-center'>
        {children ? (
          <div
            className={`flex items-center w-full`}
            style={{
              justifyContent: justify ? justify : 'space-around',
            }}
          >
            {text && <p>{text}</p>}
            {children}
          </div>
        ) : (
          <p
            className={`font-regular ${className ? className : 'button'} ${
              !width && 'w-[215px]'
            }`}
            style={{
              paddingTop: py ? `${py}px` : '16px',
              paddingBottom: py ? `${py}px` : '16px',
              width: width ? width : '',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {text}
            {image && <img src={image} alt={text} className='h-64 w-80' />}
            {medal && (
              <img
                src={medal}
                alt={`Médaille ${medal}`}
                style={{
                  position: 'absolute',
                  right: '16px',
                  width: '72px',
                  height: '72px',
                }}
              />
            )}
          </p>
        )}
      </Link>
    </>
  );
};

export default RedirectButton;
