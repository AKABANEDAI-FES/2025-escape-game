'use client';

import { useState, useEffect, useRef } from 'react'; // ★フックを追加
import { useRouter } from 'next/navigation'; // ★フックを追加
import { usePathname } from 'next/navigation';
import { GameProvider } from './provider/GameProvider';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTimer = pathname.startsWith('/game');
  
  // ★ ----- ここから管理者ページへの遷移ロジック ----- ★
  const [tapCount, setTapCount] = useState(0);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // タップ回数をリセットするためのタイマー処理
  useEffect(() => {
    // 既にタイマーがセットされていれば、それをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // タップ回数が1以上の場合、2秒後にリセットするタイマーをセット
    if (tapCount > 0) {
      timeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2000); // 2秒間操作がなければリセット
    }

    // コンポーネントが消えるときにもタイマーをクリア
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tapCount]); // tapCountが変わるたびにこの処理を実行

  // 目に見えない領域がタップされたときの処理
  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    // タップ回数が10回に達したら
    if (newCount >= 10) {
      setTapCount(0); // カウントをリセット
      if (timeoutRef.current) clearTimeout(timeoutRef.current); // リセットタイマーもクリア
      router.push('/Admin'); // 管理者ページへ移動
    }
  };
  // ★ ----- ここまでが追加ロジック ----- ★

  return (
    <GameProvider>
      {/* ★ 目に見えないタップ領域を画面右上に配置 ★ */}
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