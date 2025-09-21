'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameState } from './usePersistentGameState';

interface UseGameTimerProps {
  remainingTime: number;
  currentChapterId: string;
  isLoaded: boolean;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export function useGameTimer({ remainingTime, currentChapterId, isLoaded, setGameState }: UseGameTimerProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // タイマーを動かす処理
  useEffect(() => {
    if (!isLoaded || !isTimerRunning) return;

    intervalRef.current = setInterval(() => {
      setGameState(prev => prev.remainingTime > 0 ? { ...prev, remainingTime: prev.remainingTime - 1 } : prev);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning, isLoaded, setGameState]);

  // 時間切れを監視する処理
  useEffect(() => {
    if (isLoaded && remainingTime <= 0) {
      if (currentChapterId !== 'failure') {
        router.push('/game/failure');
      }
    }
  }, [remainingTime, isLoaded, currentChapterId, router]);

  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);
  const resetTimer =(newTime:number)=>{
    setGameState(prev=>({...prev,remainingTime:newTime}));
  }
  
  return { isTimerRunning, pauseTimer, resumeTimer, resetTimer };
}