'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameState } from './usePersistentGameState'; 

// このフックが受け取る引数の型
interface UseGameTimerProps {
  remainingTime: number;
  currentChapterId: string;
  isLoaded: boolean;
  // ★ anyをGameStateに変更
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

// タイマーロジックを担当するカスタムフック
export function useGameTimer({ remainingTime, currentChapterId, isLoaded, setGameState }: UseGameTimerProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isTimerRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        // このprevがGameState型であるとTypeScriptが認識できるようになります
        setGameState((prev: GameState) => ({ ...prev, remainingTimer: prev.remainingTimer - 1 }));
      }, 1000);
    }

    if (remainingTime <= 0) {
      if (currentChapterId !== 'failure') {
        setGameState((prev: GameState) => ({ ...prev, currentChapterId: 'failure', remainingTime: 0 }));
        router.push('/game/failure');
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning, remainingTime, currentChapterId, router, isLoaded, setGameState]);

  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);

  return { isTimerRunning, pauseTimer, resumeTimer };
}