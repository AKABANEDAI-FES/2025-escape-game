"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gameData } from "@/lib/gameData";
import Timer from "@/components/game/Timer";
import { useGame } from "../provider/GameProvider";

export default function Admin() {
  const {
    resetTimer,
    pauseTimer,
    resumeTimer,
    currentChapterId,
    setCurrentChapterId,
  } = useGame();
  const router = useRouter();

  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(currentChapterId);

  useEffect(() => {
    pauseTimer();
    return () => resumeTimer();
  }, [pauseTimer, resumeTimer]);

  const handleSetTime = () => {
    const totalSeconds = minutes * 60 + seconds;
    resetTimer(totalSeconds);
    alert(`${minutes}分${seconds}秒にタイマーを設定しました。`);
  };

  const handleChapterJump = () => {
    setCurrentChapterId(selectedChapter);
    router.push(`/game/${selectedChapter}`);
  };

  const handleBackAndReset = () => {
    router.back();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">管理者用ページ</h1>
      <p className="text-center text-gray-600">
        ゲームの進行状況を確認したり、設定を変更できます。
      </p>

      <div className="border-t border-gray-300 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">現在のチャプター:</span>
          <span className="text-blue-600 font-bold">{currentChapterId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">現在の時間:</span>
          <Timer />
        </div>
      </div>

      {/* 時間設定 */}
      <div className="border-t border-gray-300 pt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="font-medium">分</label>
          <input
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16"
          />
          <label className="font-medium">秒</label>
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16"
          />
        </div>
        <button
          onClick={handleSetTime}
          className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          時間を設定
        </button>
      </div>

      {/* チャプター移動 */}
      <div className="border-t border-gray-300 pt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        >
          {Object.keys(gameData).map((chapterId) => (
            <option key={chapterId} value={chapterId}>
              {chapterId}
            </option>
          ))}
        </select>
        <button
          onClick={handleChapterJump}
          className=" text-white px-4 py-2 rounded bg-black"
        >
          チャプターに移動
        </button>
      </div>

      <hr className="border-gray-300" />

      <button
        onClick={handleBackAndReset}
        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        元のページに戻りゲームをリセット
      </button>
    </div>
  );
}
