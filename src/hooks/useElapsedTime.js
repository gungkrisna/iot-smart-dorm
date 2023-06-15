import { useEffect, useState } from 'react';

const getTimeElapsed = (timestamp) => {
  const now = Date.now();
  const target = new Date(timestamp);
  const timeDiff = now - target;

  if (timeDiff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

const useElapsedTime = (targetTimestamp) => {
  const [timeElapsed, setTimeElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(getTimeElapsed(targetTimestamp));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetTimestamp]);

  return [timeElapsed.hours, timeElapsed.minutes, timeElapsed.seconds];
};

export default useElapsedTime;
