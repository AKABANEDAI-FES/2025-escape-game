'use client';
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";
// ★ Solvedpuzzle -> SolvedPuzzle に修正（TypeScriptの型は大文字で始めるのが一般的です）
import { GameState, usePersistentGameState, SolvedPuzzle } from "@/hooks/usePersistentGameState"; 
import { useGameTimer } from "@/hooks/useGameTimer";

interface GameContextType {
  remainingTime: number;
  currentChapterId: string;
  isTimerRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: (newTime: number) => void;
  resetGame: () => void;
  setGameState: Dispatch<SetStateAction<GameState>>;
  setCurrentChapterId: (id: string) => void;
  solvedPuzzles: SolvedPuzzle[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { gameState, setGameState, isLoaded, resetGameState } = usePersistentGameState();
  const { isTimerRunning, pauseTimer, resumeTimer, resetTimer } = useGameTimer({
    ...gameState,
    isLoaded,
    setGameState,
  });

  // ★ setCurrentChapterId の定義を value の外に移動
  const setCurrentChapterId = (id: string) => {
    setGameState((prev) => ({ ...prev, currentChapterId: id }));
  };

  const resetGame = () => {
    resetGameState();
    resumeTimer();
  };

  if (!isLoaded) return null;

  return (
    <GameContext.Provider
      // ★ value の中がスッキリし、何を提供しているかが分かりやすくなる
      value={{
        ...gameState,
        isTimerRunning,
        pauseTimer,
        resumeTimer,
        resetTimer,
        resetGame,
        setGameState,
        setCurrentChapterId, // ← 定義した関数を渡す
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