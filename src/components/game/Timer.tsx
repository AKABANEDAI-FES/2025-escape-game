// app/components/Timer.tsx
'use client';
interface TimerProps {
  remainingTime: number;
}
export default function Timer({remainingTime}: TimerProps) {

  // レンダリングごとにログ

  const formatTime = (remainingTime: number) => {
    const t = Math.max(0, remainingTime);
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
