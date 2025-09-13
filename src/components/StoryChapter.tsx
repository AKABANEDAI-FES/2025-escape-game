'use client';

import { useState } from 'react';

// この部品が受け取る情報（props）の型を定義
interface StoryChapterProps {
  lines: string[]; // 表示するセリフの配列
  onComplete: () => void; // 全てのセリフを表示し終えたときに呼ばれる関数
}

export default function StoryChapter({ lines, onComplete }: StoryChapterProps) {
  // 今、何行目のセリフを表示しているかを覚えておくための変数
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // 画面がクリックされたときの処理
  const handleNextLine = () => {
    // もし、まだ次のセリフがあれば
    if (currentLineIndex < lines.length - 1) {
      // 次の行に進める
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      // すべてのセリフを表示し終えたら、onComplete関数を呼び出して次のチャプターへ
      onComplete();
    }
  };

  return (
    // 画面全体を覆う黒い背景（クリック可能）
    <div
      onClick={handleNextLine}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        display: 'flex',
        alignItems: 'flex-end', // テキストボックスを画面下に配置
        padding: '2rem',
        cursor: 'pointer',
      }}
    >
      {/* テキストボックス */}
      <div
        style={{
          width: '100%',
          border: '2px solid cyan',
          borderRadius: '8px',
          padding: '1.5rem',
          fontSize: '1.5rem',
        }}
      >
        {/* 現在の行のセリフを表示 */}
        <p>{lines[currentLineIndex]}</p>
        <div style={{ textAlign: 'right', marginTop: '1rem' }}>▼</div>
      </div>
    </div>
  );
}