'use client';

import { useEffect, useState } from 'react';
import { PuzzleChapter } from '@/lib/gameData'; // gameData.tsから型をインポート
import { useGame } from '@/app/provider/GameProvider';
import { useGameTimer } from '@/hooks/useGameTimer';
import Timer from './Timer';

// この部品が受け取る情報
interface PuzzleDisplayProps {
  puzzle: PuzzleChapter; // 表示する謎の情報
  onSolved: () => void; // 謎が解けたときに呼ばれる関数
}

export default function PuzzleDisplay({ puzzle, onSolved }: PuzzleDisplayProps) {
  const { remainingTime, currentChapterId, setGameState } = useGame();
  const {resumeTimer, pauseTimer}=useGameTimer({
    remainingTime,
    currentChapterId,
    isLoaded: true,
    setGameState
  });

  useEffect(()=>{
    resumeTimer();
    return ()=>{pauseTimer();}
  },[resumeTimer,pauseTimer])
  // プレイヤーの入力内容を覚えておくための変数
  const [playerInput, setPlayerInput] = useState('');
  // 不正解だったときのエラーメッセージを覚えておく変数
  const [errorMessage, setErrorMessage] = useState('');

  // 提出ボタンが押されたときの処理
  const handleSubmit = () => {
    // 入力された答えと、正解の答えを比較
    if (playerInput.toUpperCase() === puzzle.answer.toUpperCase()) {
      // 正解の場合
      setErrorMessage(''); // エラーメッセージを消す
      onSolved(); // 次のチャプターへ進む
    } else {
      // 不正解の場合
      setErrorMessage('答えが違うみたい'); // 要件定義書のエラーメッセージ
    }
  };

  return (
    <div className="puzzle-container">
      <Timer remainingTime={remainingTime} />
      <h2 className="puzzle-question">{puzzle.question}</h2>

      <input
        type="text"
        value={playerInput}
        onChange={(e) => setPlayerInput(e.target.value)}
        placeholder="答えを入力"
      />

      <button onClick={handleSubmit}>
        解答する
      </button>

      {/* エラーメッセージがあれば表示する */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}