"use client";

import { useEffect, useState } from "react";
import { PuzzleChapter } from "@/lib/gameData";
import { useGame } from "@/app/provider/GameProvider";
import Timer from "./Timer";
import { useRouter } from "next/navigation";
import LogPage from "@/app/log/log";
import ProgressPage from "@/app/progress/progress";
import Image from "next/image";
import { usePersistentGameState } from "@/hooks/usePersistentGameState";

interface PuzzleDisplayProps {
  puzzle: PuzzleChapter;
  onSolved: () => void;
}

export default function PuzzleDisplay({
  puzzle,
  onSolved,
}: PuzzleDisplayProps) {
  const { pauseTimer, resumeTimer, setGameState, difficulty, startHintTimer } =
    useGame();
  const { gameState } = usePersistentGameState();
  const router = useRouter();
  const [playerInput, setPlayerInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hintMessage, setHintMessage] = useState("");

  const isNormal = difficulty === "normal";

  useEffect(() => {
    resumeTimer();
    return () => {
      pauseTimer();
    };
  }, [pauseTimer, resumeTimer]);

  useEffect(() => {
    if (!puzzle.hint || puzzle.hint.length === 0) return;
    if (!gameState.hintStartTimes[puzzle.id]) {
      startHintTimer(puzzle.id);
    }
    const startTime = gameState.hintStartTimes[puzzle.id] ?? Date.now();
    const elapsed = Date.now() - startTime;
    // Normal difficulty: Show the first hint after 10 seconds
    if (isNormal) {
      const remaining = 10000 - elapsed;
      if (remaining <= 0) {
        setHintMessage(puzzle.hint[0]);
      } else {
        const timer = setTimeout(() => {
          setHintMessage(puzzle.hint[0]);
        }, remaining);
        return () => clearTimeout(timer);
      }
    } else {
      // Not normal difficulty: Show hints sequentially
      const timers: NodeJS.Timeout[] = [];
      puzzle.hint.forEach((hint, index) => {
        const delay = (index + 1) * 10000; // 10s, 20s, 30s...
        const remaining = delay - elapsed;
        // A function to update the hint message
        const updateHints = () => {
          const message = puzzle.hint.slice(0, index + 1).join("\n");
          setHintMessage(message);
        };
        if (remaining <= 0) {
          // If the time has already passed, update immediately
          updateHints();
        } else {
          // Otherwise, set a timer for the remaining time
          const timer = setTimeout(updateHints, remaining);
          timers.push(timer);
        }
      });
      // Cleanup function to clear all scheduled timers
      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [puzzle.id, puzzle.hint, isNormal, gameState.hintStartTimes]);

  const handleSubmit = () => {
    if (!puzzle.answer) return;
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
      {/* Timer, Log, Progress sections... (省略) */}
      <div className="absolute h-1/15 top-1/30 w-1/10 right-1/30 border rounded-xl border-black flex justify-center items-center text-center">
        <Timer />
      </div>
      <input type="checkbox" className="peer/log-flag hidden" id="log" />
      <label
        className="button-sample1 absolute h-1/15 w-1/5  border border-black flex justify-center items-center text-center"
        htmlFor="log"
      >
        会話を見る
      </label>
      <div className="popup fixed inset-0 hidden peer-checked/log-flag:block z-50">
        <LogPage />
        <label
          className="fixed left-4/6 px-6 py-2 hover:bg-cyan-700 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 border-black border"
          htmlFor="log"
          style={{ zIndex: 70 }}
        >
          ゲームに戻る
        </label>
      </div>
      <input
        type="checkbox"
        className="peer/progress-flag hidden"
        id="progress"
      />
      <label
        className="button-sample2 absolute h-1/15 w-1/5 left-7/30 border border-black flex justify-center items-center text-center"
        htmlFor="progress"
      >
        進捗を見る
      </label>
      <div className="popup fixed inset-0 overflow-y-auto hidden peer-checked/progress-flag:block z-50">
        <ProgressPage />
        <label
          className="fixed left-4/6 px-6 py-2 hover:bg-cyan-700 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 border-black border"
          htmlFor="progress"
          style={{ zIndex: 70 }}
        >
          ゲームに戻る
        </label>
      </div>
      <div className="flex justify-center items-center text-center">
        <h2 className="puzzle-question absolute top-32 h-2/5 w-28/30 left-1/30 border rounded-3xl border-black text-xl">
          {puzzle.question}
        </h2>
        {puzzle.imageUrl && puzzle.imageUrl !== "noimage" && (
          <Image
            src={puzzle.imageUrl}
            alt={`問題の画像: ${puzzle.question}`}
            height={500}
            width={450}
            className="fixed top-1/5"
          />
        )}
      </div>

      {/* ▼▼▼ ここから変更 ▼▼▼ */}

      {/* テキスト入力型の問題の場合 */}
      {puzzle.puzzleType === "TEXT_INPUT" && (
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-4">
          <input
            type="text"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            placeholder="答えを入力"
            className="w-1/2 p-2 border border-black text-center"
          />
          <button
            onClick={handleSubmit}
            className="h-12 w-1/5 border border-black flex justify-center items-center text-center"
          >
            解答する
          </button>
        </div>
      )}

      {/* QRコード読み込み型の問題の場合 */}
      {puzzle.puzzleType === "QR_SCAN" && (
        <button
          onClick={() => router.push(`/qr-reader/${puzzle.id}`)}
          className="absolute h-1/15 top-3/4 w-1/5 left-1/2 -translate-x-1/2 border border-black flex justify-center items-center text-center"
        >
          QRコードを読み込む
        </button>
      )}

      {/* ▲▲▲ ここまで変更 ▲▲▲ */}

      {/* ヒント表示 (変更なし) */}
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
            className="popup hidden peer-checked/popup-flag:block bg-white fixed bottom-8 h-64 w-8/12 z-40 rounded-xl border-t border-r border-b border-l border-gray-500"
            style={{ left: "calc(50vw - calc(calc(8 / 12 * 100%) / 2))" }}
          >
            <label
              className="close-button w-9 h-9 text-4xl"
              htmlFor="popupFlag1"
            >
              ×
            </label>
            <div className="content p-3 text-center">
              <p className="text-2xl whitespace-pre-line">{hintMessage}</p>
            </div>
          </div>
        </>
      )}
      {errorMessage && <p className="text-red-500 absolute bottom-1/4 left-1/2 -translate-x-1/2">{errorMessage}</p>}
    </div>
  );
}