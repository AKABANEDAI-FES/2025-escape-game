'use client';
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState, useRef, useCallback, useEffect, use } from "react";
// ★ Solvedpuzzle -> SolvedPuzzle に修正（TypeScriptの型は大文字で始めるのが一般的です）
import { GameState, usePersistentGameState, SolvedPuzzle } from "@/hooks/usePersistentGameState"; 
import { useRouter } from "next/navigation";

interface GameContextType {
  remainingTime: number;
  currentChapterId: string;
  isTimerPaused: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: (newTime: number) => void;
  resetGame: () => void;
  setGameState: Dispatch<SetStateAction<GameState>>;
  setCurrentChapterId: (id: string) => void;
  solvedPuzzles: SolvedPuzzle[];
  viewedStoryChapters: string[];
  difficulty: "easy" | "normal";
  obtainedItems: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const {gameState,setGameState,isLoaded, resetGameState} = usePersistentGameState()
  const router = useRouter();
  const timerRef =useRef<ReturnType<typeof setInterval> | null >(null);

  const runTimer=useCallback(()=>{
    setGameState(prev=>{
      if(prev.remainingTime <= 0){
        clearInterval(timerRef.current!);
        return {...prev, remainingTime:0};
      }
      return {...prev, remainingTime:prev.remainingTime -1};
    })
  },[setGameState])

  const resumeTimer = useCallback(()=>{
    setGameState(prev=>({...prev, isTimerPaused:false}));
  },[setGameState])

  const pauseTimer = useCallback(()=>{
    setGameState(prev=>({...prev, isTimerPaused:true}));
  },[setGameState])

  const resetTimer = (newTime: number)=> {
    setGameState((prev)=>({...prev, remainingTime:newTime}));
  }

  useEffect(()=>{
    if(isLoaded && !gameState.isTimerPaused){
      timerRef.current = setInterval(runTimer, 1000);
    }else{
      clearInterval(timerRef.current!);
    }
    return ()=>clearInterval(timerRef.current!);
  }, [ gameState.isTimerPaused,isLoaded, runTimer]);

  useEffect(()=>{
    if(isLoaded && gameState.remainingTime <=0){
      if (gameState.currentChapterId !== "failure") {
        router.push("/game/failure");
      }
    }
  }, [gameState.remainingTime, isLoaded, router, gameState.currentChapterId]);

  const setCurrentChapterId = useCallback((id: string) => {
    setGameState((prev) => ({ ...prev, currentChapterId: id }));
  }, []);

  const resetGame = () => {
    resetGameState();
  };

  if (!isLoaded) return null;

  return (
    <GameContext.Provider
      value={{
        ...gameState,
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