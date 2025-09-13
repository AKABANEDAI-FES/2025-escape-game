'use client'; // これはクライアント部品です、という宣言

import { useRouter } from 'next/navigation';
import { gameData } from '@/lib/gameData';
import StoryChapter from '@/components/StoryChapter';

// chapterIdをpropsとして受け取る
export default function GameClient({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const chapter = gameData[chapterId];

  if (!chapter) {
    return <p>チャプターが見つかりません</p>;
  }

  // 次のチャプターに進む処理
  const goToNextChapter = () => {
    let nextChapterId: string | null = null;
    if ('nextChapterId' in chapter) {
      let nextChapter = gameData[chapter.nextChapterId];
      // actionは飛ばす
      if (nextChapter && nextChapter.type === 'action' && 'nextChapterId' in nextChapter) {
        nextChapterId = nextChapter.nextChapterId;
      } else {
        nextChapterId = chapter.nextChapterId;
      }
    }

    if (nextChapterId) {
      router.push(`/game/${nextChapterId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <main style={{ background: 'black', width: '100vw', height: '100vh' }}>
      {chapter.type === 'story' && (
        <StoryChapter lines={chapter.content} onComplete={goToNextChapter} />
      )}
      {chapter.type === 'puzzle' && (
        <div style={{ color: 'white', padding: '2rem' }}>
          <h2>{chapter.question}</h2>
          <p>（ここは後で謎解き画面になります）</p>
          <button onClick={goToNextChapter}>仮の「次に進む」ボタン</button>
        </div>
      )}
    </main>
  );
}
