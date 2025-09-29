'use client';

import { useGame } from '@/app/provider/GameProvider';
import { gameData, StoryChapter } from '@/lib/gameData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Timer from "@/components/game/Timer";

export default function LogPage() {
  const router = useRouter();
  // `useGame`からタイマー関連のstateと現在のチャプターIDを取得
  const { viewedStoryChapters, currentChapterId, remainingTime, pauseTimer, resumeTimer } = useGame();

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

  // 閲覧済みのチャプターIDの中から、'story'タイプのチャプターのみをフィルタリング
  const storyLogs = viewedStoryChapters
    .map(id => gameData[id]) // gamedataから直接IDでチャプターを取得
    // 型ガードを使用してstoryタイプのみに絞り込み、TypeScriptに型を推論させる
    .filter((chapter): chapter is StoryChapter => !!chapter && chapter.type === 'story');

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 font-sans relative z-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">会話ログ</h1>
            {/* パズルがアクティブな場合のみ残り時間を表示 */}
            {isPuzzleActive && remainingTime !== undefined && (
            //   <div className="text-xl text-red-400 mt-2 animate-pulse">
            //     残り時間: {formatTime(remainingTime)}
            //   </div>
            <div className="absolute h-1/15 top-1/30 w-1/10 right-1/30 border rounded-xl border-black flex justify-center items-center text-center text-black">
                <Timer />
            </div>
            )}
          </div>
          {/* <button
            onClick={() => router.back()}
            className="fixed left-4/6 px-6 py-2 hover:bg-cyan-700 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 border-black border"
          >
            ゲームに戻る
          </button> */}
          <label
          className="fixed left-4/6 px-6 py-2 hover:bg-cyan-700 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 border-black border"
          htmlFor="log"
          style={{ zIndex: 70 }}
          >
            ゲームに戻る
          </label>
        </header>

        <main className="space-y-6 bg-white p-6 rounded-lg shadow-inner border-black border">
          {storyLogs.length > 0 ? (
            storyLogs.map((chapter) => (
              <div key={chapter.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                <h2 className="text-xl font-semibold text-black mb-2">
                  {/* gameDataにチャプタータイトルがあれば表示、なければIDを表示 */}
                  {/* StoryChapterにtitleはないため、IDを fallback として表示 */}
                  {`チャプター: ${chapter.id}`}
                </h2>
                <div className="text-black whitespace-pre-wrap leading-relaxed">
                  {/* contentは文字列配列なので、各行をdivで囲んで表示 */}
                  {chapter.content.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">まだ会話ログはありません。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

