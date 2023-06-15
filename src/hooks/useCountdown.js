import { useEffect, useState } from 'react';

const getTimeLeft = (timestamp) => {
  const now = Date.now();
  const target = new Date(timestamp);
  const timeDiff = target - now;

  if (timeDiff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

const useCountdown = (targetTimestamp) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetTimestamp));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetTimestamp]);

  return [timeLeft.hours, timeLeft.minutes, timeLeft.seconds];
};

export default useCountdown;
