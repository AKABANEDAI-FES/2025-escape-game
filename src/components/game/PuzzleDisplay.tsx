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
      <Timer />
      <h2 className="puzzle-question">{puzzle.question}</h2>

      <input
        type="text"
        value={playerInput}
        onChange={(e) => setPlayerInput(e.target.value)}
        placeholder="答えを入力"
      />

      <button onClick={handleSubmit}>解答する</button>
      <button>QRコードを読み込む</button>

      {/* エラーメッセージがあれば表示する */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
