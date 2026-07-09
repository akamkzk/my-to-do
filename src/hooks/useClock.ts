import { useState, useEffect } from 'react';
import { getDateString, getHourDegrees, getMinuteDegrees, formatDigitalTime } from '../utils/clock';

export interface ClockState {
  dateString: string;
  hourDegrees: number;
  minuteDegrees: number;
  digitalTime: string;
}

export function useClock(): ClockState {
  const [state, setState] = useState<ClockState>(() => createInitialState());

  useEffect(() => {
    const id = setInterval(() => setState(createInitialState()), 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}

function createInitialState(): ClockState {
  const now = new Date();
  return {
    dateString: getDateString(now),
    hourDegrees: getHourDegrees(now),
    minuteDegrees: getMinuteDegrees(now),
    digitalTime: formatDigitalTime(now),
  };
}
