import { useState, useEffect, useRef, memo, useMemo } from 'react';

const Timer = memo(({ duration = 30, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const circleRef = useRef(null);

  const circumference = useMemo(() => 2 * Math.PI * 45, []);

  useEffect(() => {
    const totalDuration = duration * 1000;
    const startTime = Date.now();

    const updateTimer = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(totalDuration - elapsedTime, 0);
      const percentRemaining = remainingTime / totalDuration;

      if (circleRef.current)
        circleRef.current.style.strokeDashoffset = `${
          circumference * percentRemaining
        }`;

      setTimeRemaining(Math.ceil(remainingTime / 1000));

      if (remainingTime > 0) requestAnimationFrame(updateTimer);
      else onComplete();
    };

    requestAnimationFrame(updateTimer);

    return () => cancelAnimationFrame(updateTimer);
  }, [duration, onComplete, circumference]);

  return (
    <div className='relative w-64 h-64 flex items-center justify-center rounded-full'>
      <svg
        className='absolute w-full h-full rotate-[-90deg]'
        viewBox='0 0 120 120'
      >
        {/* Background circle */}
        <circle
          cx='60'
          cy='60'
          r='45'
          className='stroke-gray-200 fill-none stroke-[8]'
        />
        {/* Foreground circle */}
        <circle
          ref={circleRef}
          cx='60'
          cy='60'
          r='45'
          className='stroke-current text-blue-500 fill-none stroke-[8]'
          style={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
        />
      </svg>
      <span className='absolute text-6xl'>{timeRemaining}</span>
    </div>
  );
});

Timer.displayName = 'Timer';

export default Timer;
