'use client';

import { usePathname } from 'next/navigation';
import Timer from '@/components/game/Timer';
import { GameProvider } from './provider/GameProvider';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTimer = pathname.startsWith('/game');

  return (
    // まずGameProviderで全体をラップする
    <GameProvider>
      <div className="game-container">
        {/*
          GameProviderの内側でTimerを呼び出す。
          これでTimerはuseGame()を安全に使える。
        */}
        {showTimer && <Timer />}
        
        <main>{children}</main>
      </div>
    </GameProvider>
  );
}
