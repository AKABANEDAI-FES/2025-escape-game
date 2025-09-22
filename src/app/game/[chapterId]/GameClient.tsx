'use client'; // これはクライアント部品です、という宣言

import { useRouter } from 'next/navigation';
import { gameData } from '@/lib/gameData';
import StoryChapter from '@/components/StoryChapter';
import PuzzleDisplay from '@/components/game/PuzzleDisplay';
import SuccessScreen from '@/components/game/SuccessScreen';
import GameOverScreen from '@/components/game/GameOverScreen';
import { useGame } from '@/app/provider/GameProvider';

// chapterIdをpropsとして受け取る
export default function GameClient({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const chapter = gameData[chapterId];
  // ★ ゲームの状態を更新・操作するための関数を取得
  const { setCurrentChapterId } = useGame();

  if (!chapter) {
    return <p>チャプターが見つかりません</p>;
  }

  // ★ 次のチャプターに進む処理を修正
  const goToNextChapter = () => {
    let nextChapterId: string | null = null;
    if ('nextChapterId' in chapter) {
      let nextChapter = gameData[chapter.nextChapterId];
      // actionは飛ばす（このロジックは必要に応じて調整）
      if (nextChapter && nextChapter.type === 'action' && 'nextChapterId' in nextChapter) {
        nextChapterId = nextChapter.nextChapterId;
      } else {
        nextChapterId = chapter.nextChapterId;
      }
    }

    if (nextChapterId) {
      // 1. まずゲームの内部状態を更新する
      setCurrentChapterId(nextChapterId);
      // 2. 次にURLを変更してページを移動する
      router.push(`/game/${nextChapterId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <main>
      {chapter.type === 'story' && (
        <StoryChapter lines={chapter.content} onComplete={goToNextChapter} />
      )}
      {chapter.type === 'puzzle' && (
        <PuzzleDisplay puzzle={chapter} onSolved={goToNextChapter} />
      )}
      {chapter.type === 'ending' && chapterId === 'success' && (
        <SuccessScreen title={chapter.title} message={chapter.message} />
      )}
      {chapter.type === 'ending' && chapterId === 'failure' && (
        <GameOverScreen title={chapter.title} message={chapter.message} />
      )}
    </main>
  );
}