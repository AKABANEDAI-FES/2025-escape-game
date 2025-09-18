// app/provider/GameProvider.tsx
'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { usePersistentGameState } from '@/hooks/usePersistentGameState';

interface GameContextType {
  remainingTime: number;
  currentChapterId: string;
  isTimerRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { gameState, setGameState, isLoaded, resetGameState } = usePersistentGameState();
  const [isTimerRunning, setIsTimerRunning] = useState(true); // 初期値trueで自動スタート

  // タイマー処理
  useEffect(() => {
    console.log('GameProvider useEffect run', isLoaded, isTimerRunning);

    if (!isLoaded || !isTimerRunning) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTime = Math.max(prev.remainingTimer - 1, 0);
        console.log('GameProvider updating remainingTime:', newTime);
        return { ...prev, remainingTimer: newTime };
      });

    }, 1000);

    return () => clearInterval(timer);
  }, [isLoaded, isTimerRunning, setGameState]);

  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);
  const resetGame = () => {
    resetGameState();
    setIsTimerRunning(true);
  };

  if (!isLoaded) return null;

  return (
    <GameContext.Provider
      value={{
        remainingTime: gameState.remainingTimer,
        currentChapterId: gameState.currentChapterId,
        isTimerRunning,
        pauseTimer,
        resumeTimer,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// カスタムフック
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
