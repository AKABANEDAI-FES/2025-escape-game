'use client';

import { useRouter } from 'next/navigation';

interface SuccessScreenProps {
  title: string;
  message: string;
}

export default function SuccessScreen({ title, message }: SuccessScreenProps) {
  const router = useRouter();

  const handleRestart = () => {
    // スタートページ('/')に戻る
    router.push('/');
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={handleRestart}>
        スタートに戻る
      </button>
    </div>
  );
}