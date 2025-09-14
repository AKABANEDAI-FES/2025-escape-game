'use client';

import { useState } from 'react';
import { PuzzleChapter } from '@/lib/gameData'; // gameData.tsから型をインポート
import { useRouter } from 'next/navigation';

// この部品が受け取る情報
interface PuzzleDisplayProps {
  puzzle: PuzzleChapter; // 表示する謎の情報
  onSolved: () => void; // 謎が解けたときに呼ばれる関数
}

export default function PuzzleDisplay({ puzzle, onSolved }: PuzzleDisplayProps) {
  // プレイヤーの入力内容を覚えておくための変数
  const [playerInput, setPlayerInput] = useState('');
  // 不正解だったときのエラーメッセージを覚えておく変数
  const [errorMessage, setErrorMessage] = useState('');

  // 提出ボタンが押されたときの処理
  const handleSubmit = () => {
    // 入力された答えと、正解の答えを比較
    // toUpperCase()で両方大文字に変換し、大文字・小文字を区別しないようにする
    if (playerInput.toUpperCase() === puzzle.answer.toUpperCase()) {
      // 正解の場合
      setErrorMessage(''); // エラーメッセージを消す
      onSolved(); // 次のチャプターへ進む
    } else {
      // 不正解の場合
      setErrorMessage('答えが違うみたい'); // 要件定義書のエラーメッセージ
    }
  };

  const router = useRouter();

  return (
    <div className="puzzle-container">
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

      <br></br>
      
      {/* QRコード読み取り画面へ遷移するボタン */}
      <button onClick={() => router.push('/qr-reader')}>
        QRコードを読み込む
      </button>
    </div>
  );
}