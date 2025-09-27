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
    if (remainingTime < 50) {
      setHintMessage(puzzle.hint); //残り時間50秒以下で表示（仮）
    }
    return ()=>{pauseTimer();}
  },[resumeTimer,pauseTimer])
  const [playerInput, setPlayerInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hintMessage, setHintMessage] = useState('');

  const handleSubmit = () => {
    if (playerInput.toUpperCase() === puzzle.answer.toUpperCase()) {
      setErrorMessage(''); // エラーメッセージを消す
      setHintMessage(''); // ヒントメッセージを消す
      onSolved(); // 次のチャプターへ進む
    } else {
      setErrorMessage('答えが違うみたい'); // 要件定義書のエラーメッセージ
    }
  };

  return (
    <div className="puzzle-container">
      <div className='absolute h-1/15 top-1/30 w-1/10 right-1/30 border rounded-xl border-black flex justify-center items-center text-center'>
        <Timer/>
      </div>

      <h2 className="puzzle-question absolute top-32 h-1/3 w-28/30 left-1/30 border rounded-3xl border-black flex justify-center items-center text-center text-xl">
        {puzzle.question}</h2>

      <input
        type="text"
        value={playerInput}
        onChange={(e) => setPlayerInput(e.target.value)}
        placeholder="答えを入力"
      />

      <button onClick={handleSubmit}>
        解答する
      </button>
      <button onClick={() => router.push('/qr-reader')} className='absolute h-1/15 top-2/3 w-1/5 left-2/5 border border-black flex justify-center items-center text-center'>
        QRコードを読み込む
      </button>
      

      <div className="button-container">
        {hintMessage && <label className="button-sample1 fixed p-3 text-2xl right-14 bottom-1/3 rounded-xl border-t border-r border-b border-l border-gray-500" htmlFor="popupFlag1">ヒント</label>}
      </div>
      {hintMessage && <input type="checkbox" className="peer/popup-flag hidden" defaultChecked id="popupFlag1"/>}
      {hintMessage && <label className="popup-background hidden peer-checked/popup-flag:block fixed z-40 w-screen h-screen top-0 left-0" htmlFor="popupFlag1"></label>}
      {hintMessage && <div className="popup hidden peer-checked/popup-flag:block bg-white fixed bottom-8 h-64 w-8/12 z-50 rounded-xl border-t border-r border-b-4 border-l border-gray-500" style={{left : "calc(50vw - calc(calc(8 / 12 * 100%) / 2))"}}>
          {hintMessage && <label className="close-button w-9 h-9 text-4xl" htmlFor="popupFlag1">×</label>}
          {hintMessage && <div className="content p-3 text-center">
              {hintMessage && <p className="text-2xl">{hintMessage}</p>}
          </div>}
      </div>}
      {/* エラーメッセージがあれば表示する */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
