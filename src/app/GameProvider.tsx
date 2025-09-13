'use client';

import React, { createContext, useContext, ReactNode } from 'react';
interface GameContextType {}
const GameContext = createContext<GameContextType>({});
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const value = {};

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};