"use client";
import { useState, useEffect } from "react";

const GAME_STATE_KEY = "escapeGameProgress";

// ★ interfaceをexportして他のファイルから使えるようにする
export interface GameState {
  currentChapterId: string;
  remainingTime: number; // ★ remainingTimerから変更
  solvedPuzzles: SolvedPuzzle[];
}
export interface SolvedPuzzle {
  id: string;
  question: string;
  answer: string;
}

const initialGameState: GameState = {
  currentChapterId: "start",
  remainingTime: 60 * 1, // 60分
  solvedPuzzles: [],
};

export function usePersistentGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
      if (savedStateJSON) {
        setGameState(JSON.parse(savedStateJSON));
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  const resetGameState = () => {
    setGameState(initialGameState);
  };

  return { gameState, setGameState, isLoaded, resetGameState };
}
