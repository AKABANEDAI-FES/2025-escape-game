'use client';

import { useRouter } from 'next/navigation';

interface GameOverScreenProps {
  title: string;
  message: string;
}

export default function GameOverScreen({ title, message }: GameOverScreenProps) {
  const router = useRouter();

  const handleRestart = () => {
    router.push('/');
  };

  return (
    <div className="game-over-container">
      <h1 className="game-over-title">{title}</h1>
      <p className="game-over-message">{message}</p>
      <button onClick={handleRestart} className="restart-button">
        スタートに戻る
      </button>
    </div>
  );
}