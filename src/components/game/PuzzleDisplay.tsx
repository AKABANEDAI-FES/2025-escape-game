"use client";

import { useEffect, useState } from "react";
import { PuzzleChapter } from "@/lib/gameData"; // gameData.tsから型をインポート
import { useGame } from "@/app/provider/GameProvider";
import Timer from "./Timer";

// この部品が受け取る情報
interface PuzzleDisplayProps {
  puzzle: PuzzleChapter; // 表示する謎の情報
  onSolved: () => void; // 謎が解けたときに呼ばれる関数
}

export default function PuzzleDisplay({
  puzzle,
  onSolved,
}: PuzzleDisplayProps) {
  const { pauseTimer, resumeTimer, setGameState } = useGame();

  useEffect(() => {
    resumeTimer();
    return () => {
      pauseTimer();
    };
  }, [pauseTimer, resumeTimer]);

  const [playerInput, setPlayerInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (playerInput.toUpperCase() === puzzle.answer.toUpperCase()) {
      setErrorMessage(""); // エラーメッセージを消す
      setGameState((prev) => ({
        ...prev,
        solvedPuzzles: [
          ...prev.solvedPuzzles,
          { id: puzzle.id, question: puzzle.question, answer: puzzle.answer },
        ],
      }));
      onSolved(); // 次のチャプターへ進む
    } else {
      setErrorMessage("答えが違うみたい"); // 要件定義書のエラーメッセージ
    }
  };

  return (
    <div className="puzzle-container">
      <div className='absolute h-1/15 top-1/30 w-1/10 right-1/30 border rounded-xl border-black flex justify-center items-center text-center'>
        <Timer/>
      </div>
      
      <h2 className="puzzle-question absolute top-32 h-1/3 w-28/30 left-1/30 border rounded-3xl border-black flex justify-center items-center text-center text-xl">
        {puzzle.question}</h2>

      <button onClick={() => router.push('/qr-reader')} className='absolute h-1/15 top-2/3 w-1/5 left-2/5 border border-black flex justify-center items-center text-center'>
        QRコードを読み込む
      </button>

      {/* エラーメッセージがあれば表示する */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
