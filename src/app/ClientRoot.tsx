'use client';

import { useState, useEffect, useRef } from 'react'; // ★フックを追加
import { useRouter } from 'next/navigation'; // ★フックを追加
import { usePathname } from 'next/navigation';
import { GameProvider } from './provider/GameProvider';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTimer = pathname.startsWith('/game');
  
  const [tapCount, setTapCount] = useState(0);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (tapCount > 0) {
      timeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2000); // 2秒間操作がなければリセット
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tapCount]); // tapCountが変わるたびにこの処理を実行

  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 10) {
      setTapCount(0); // カウントをリセット
      if (timeoutRef.current) clearTimeout(timeoutRef.current); // リセットタイマーもクリア
      router.push('/Admin'); // 管理者ページへ移動
    }
  };

  return (
    <GameProvider>
      <div
        onClick={handleSecretTap}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '80px',  // タップしやすいように少し広めに
          height: '80px',
          zIndex: 9999,   // 他の要素より必ず手前に表示
        }}
      />

      {/* 以下は元のレイアウト */}
      <div className="game-container">
        <main>{children}</main>
      </div>
    </GameProvider>
  );
}