"use client";
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { GameState, usePersistentGameState } from "@/hooks/usePersistentGameState";
import { useGameTimer } from "@/hooks/useGameTimer";

interface GameContextType {
  remainingTime: number;
  currentChapterId: string;
  isTimerRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetGame: () => void;
  resetTimer: (newTime: number) => void;
  setGameState: Dispatch<SetStateAction<GameState>>;
  setCurrentChapterId: (id: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { gameState, setGameState, isLoaded, resetGameState } = usePersistentGameState();
  const { isTimerRunning, pauseTimer, resumeTimer, resetTimer } = useGameTimer({
    ...gameState,
    isLoaded,
    setGameState,
  });
  const setCurrentChapterId = (id: string) => {
    setGameState((prev) => ({ ...prev, currentChapterId: id }));
  };
  // ゲームリセットの命令を出す
  const resetGame = () => {
    resetGameState();
    resumeTimer(); // タイマーも開始させる
  };

  if (!isLoaded) return null;

  // 組み立てた結果を全体に提供する
  return (
    <GameContext.Provider
      value={{
        ...gameState,
        isTimerRunning,
        pauseTimer,
        resumeTimer,
        resetTimer,
        resetGame,
        setGameState,
        setCurrentChapterId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error("useGame must be used within a GameProvider");
  return context;
};
