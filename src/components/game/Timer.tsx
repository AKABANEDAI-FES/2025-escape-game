// app/components/Timer.tsx
'use client';

import { useGame } from "@/app/provider/GameProvider";

export default function Timer() {

  const { remainingTime } = useGame();

  const formatTime = (remainingTime: number) => {
    const t = Math.max(0, remainingTime);
    const minutes = Math.floor(t / 60).toString().padStart(2, '0');
    const seconds = (t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const isWarning = remainingTime <= 10;

  return (
    <span className={`timer ${isWarning ? 'warning' : ''}`}>
      {formatTime(remainingTime)}
    </span>
  );
}
