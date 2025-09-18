// app/components/Timer.tsx
'use client';
import { useGame } from "@/app/provider/GameProvider";

export default function Timer() {
  const { remainingTime } = useGame();

  // レンダリングごとにログ
  console.log('Timer render:', remainingTime);

  const formatTime = (time: number) => {
    const t = Math.max(0, time);
    const minutes = Math.floor(t / 60).toString().padStart(2, '0');
    const seconds = (t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const isWarning = remainingTime <= 10;

  return (
    <div className={`timer ${isWarning ? 'warning' : ''}`}>
      {formatTime(remainingTime)}
    </div>
  );
}
