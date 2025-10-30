import { useState, useEffect } from 'react';
import { getTimeUntilMidnight } from '@/utils/formatters';

export const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = () => {
    const { hours, minutes } = timeLeft;
    return `${hours}h ${minutes}m`;
  };

  return { timeLeft, formatCountdown };
};
