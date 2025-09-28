"use client";

import { useEffect, useState } from "react";
import { PuzzleChapter } from "@/lib/gameData";
import { useGame } from "@/app/provider/GameProvider";
import Timer from "./Timer";
import { useRouter } from "next/navigation";

interface PuzzleDisplayProps {
  puzzle: PuzzleChapter;
  onSolved: () => void;
}

export default function PuzzleDisplay({ puzzle, onSolved }: PuzzleDisplayProps) {
  const { pauseTimer, resumeTimer, setGameState } = useGame();
  const router = useRouter();

  const [playerInput, setPlayerInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hintMessage, setHintMessage] = useState("");

  // ---- ヒント用タイマー ----
  const [hintCountdown, setHintCountdown] = useState(10); 

  useEffect(() => {
    resumeTimer();
    return () => {
      pauseTimer();
    };
  }, [pauseTimer, resumeTimer]);

  // ヒント用タイマー
  useEffect(() => {
    if (hintCountdown <= 0) {
      setHintMessage(puzzle.hint); // カウント0になったらヒント表示
      return;
    }
    const timer = setInterval(() => {
      setHintCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hintCountdown, puzzle.hint]);

  const handleSubmit = () => {
    if (playerInput.toUpperCase() === puzzle.answer.toUpperCase()) {
      setErrorMessage("");
      setHintMessage("");
      setGameState((prev) => ({
        ...prev,
        solvedPuzzles: [
          ...prev.solvedPuzzles,
          { id: puzzle.id, question: puzzle.question, answer: puzzle.answer },
        ],
      }));
      onSolved();
    } else {
      setErrorMessage("答えが違うみたい");
    }
  };

  return (
    <div className="puzzle-container">
      <div className="absolute h-1/15 top-1/30 w-1/10 right-1/30 border rounded-xl border-black flex justify-center items-center text-center">
        <Timer />
      </div>      
      <h2 className="puzzle-question absolute top-32 h-1/3 w-28/30 left-1/30 border rounded-3xl border-black flex justify-center items-center text-center text-xl">
        {puzzle.question}
      </h2>
      <input
        type="text"
        value={playerInput}
        onChange={(e) => setPlayerInput(e.target.value)}
        placeholder="答えを入力"
      />

      <button
        onClick={handleSubmit}
        className="absolute h-1/15 top-2/3 w-1/5 left-2/5 border border-black flex justify-center items-center text-center"
      >
        解答する
      </button>

      {/* QRコード読み取り画面へ遷移するボタン */}
      <button
        onClick={() => router.push("/qr-reader")}
        className="absolute h-1/15 top-3/4 w-1/5 left-2/5 border border-black flex justify-center items-center text-center"
      >
        QRコードを読み込む
      </button>

      {/* ヒント表示 */}
      <div className="button-container">
        {hintMessage && (
          <label
            className="button-sample1 fixed p-3 text-2xl right-14 bottom-1/3 rounded-xl border-gray-500"
            htmlFor="popupFlag1"
          >
            ヒント
          </label>
        )}
      </div>
      {hintMessage && (
        <>
          <input
            type="checkbox"
            className="peer/popup-flag hidden"
            defaultChecked
            id="popupFlag1"
          />
          <label
            className="popup-background hidden peer-checked/popup-flag:block fixed z-40 w-screen h-screen top-0 left-0"
            htmlFor="popupFlag1"
          />
          <div
            className="popup hidden peer-checked/popup-flag:block bg-white fixed bottom-8 h-64 w-8/12 z-50 rounded-xl border-t border-r border-b-4 border-l border-gray-500"
            style={{ left: "calc(50vw - calc(calc(8 / 12 * 100%) / 2))" }}
          >
            <label
              className="close-button w-9 h-9 text-4xl"
              htmlFor="popupFlag1"
            >
              ×
            </label>
            <div className="content p-3 text-center">
              <p className="text-2xl">{hintMessage}</p>
            </div>
          </div>
        </>
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
