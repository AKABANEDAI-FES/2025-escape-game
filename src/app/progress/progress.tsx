'use client';

import { useGame } from '@/app/provider/GameProvider';
import { gameData} from '@/lib/gameData';
import { SolvedPuzzle } from '@/hooks/usePersistentGameState';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Timer from "@/components/game/Timer";

export default function ProgressPage() {

  const router = useRouter();
  // `useGame`からタイマー関連のstateと現在のチャプターIDを取得
  const { solvedPuzzles, currentChapterId, remainingTime, pauseTimer, resumeTimer } = useGame();

  
  // 現在のチャプターがパズルかどうかを判定
  const isPuzzleActive = gameData[currentChapterId]?.type === 'puzzle';

  // このページが表示されている間タイマーを再開し、離れるときに一時停止する
  useEffect(() => {
    if (isPuzzleActive) {
      resumeTimer();
      return () => {
        pauseTimer();
      };
    }
  }, [isPuzzleActive, pauseTimer, resumeTimer]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 font-sans relative z-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">進行状況</h1>
            {isPuzzleActive && remainingTime !== undefined && (

            <div className="absolute h-1/15 top-1/30 w-1/10 right-1/30 border rounded-xl border-black flex justify-center items-center text-center text-black">
                <Timer />
            </div>
            )}
          </div>

          <label
          className="fixed left-4/6 px-6 py-2 hover:bg-cyan-700 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 border-black border"
          htmlFor="progress"
          style={{ zIndex: 70 }}
          >
            ゲームに戻る
          </label>
        </header>

        <main className="space-y-6 bg-white p-6 rounded-lg shadow-inner border-black border">
          {solvedPuzzles.length > 0 ? (
              solvedPuzzles.map((puzzle: SolvedPuzzle, index: number) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                <h2 className="text-xl font-semibold text-black mb-2">
                  {`問題 ${puzzle.id.slice(-1)}`}
                </h2>
                <div className="text-black whitespace-pre-wrap leading-relaxed">
                    <div className='text-md'>{puzzle.question}</div>
                    <div className='text-md'>{puzzle.answer}</div>
                </div>
              </div>
              ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">まだ進捗はありません。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

