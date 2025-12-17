import WatchSvg from '../../assets/images/watch.svg';
const WatchButton = (props) => {
  const { onClick, sizeInPx } = props;
  return (
    <button className='watch-button' onClick={onClick}>
      <img
        className={
          sizeInPx == null
            ? 'h-8 w-8'
            : 'h-[' + sizeInPx + 'px]' + ' w-[' + sizeInPx + 'px]'
        }
        style={sizeInPx && { height: `${sizeInPx}px`, width: `${sizeInPx}px` }}
        src={WatchSvg}
        alt='Speaker'
      />
      <p>Regarder</p>
    </button>
  );
};

export default WatchButton;
