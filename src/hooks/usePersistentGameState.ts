'use client';

import { useEffect, useState } from "react";

const GAME_STATE_KEY = 'escapeGameProgress';

export interface GameState{
    currentChapterId:string;
    remainingTimer: number;
}

const initialGameState:GameState={
    currentChapterId:'start',
    remainingTimer: 60*1, // 20分
}

export function usePersistentGameState(){
    const [gameState,setGameState]=useState<GameState>(initialGameState);
    const [isLoaded, setIsLoaded]=useState(false); // ロード完了を示す状態

    useEffect(()=>{
        try{
            const savedStateJSON=localStorage.getItem(GAME_STATE_KEY);
            if(savedStateJSON){
                const savedState:GameState=JSON.parse(savedStateJSON);
                setGameState(savedState);
            }
        }catch(error){
            console.error("Failed to load game state:", error);
        }finally{
            setIsLoaded(true);
        }
    },[])
    useEffect(()=>{
        if(isLoaded){
            localStorage.setItem(GAME_STATE_KEY,JSON.stringify(gameState));
        }
    },[gameState,isLoaded]);

    const resetGameState=()=>{setGameState(initialGameState)};

    return { gameState, setGameState, isLoaded, resetGameState };
}