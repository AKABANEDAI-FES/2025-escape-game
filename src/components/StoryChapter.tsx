'use client';

import { useGame } from '@/app/provider/GameProvider';
import { useEffect, useState } from 'react';

// この部品が受け取る情報（props）の型を定義
interface StoryChapterProps {
  lines: string[]; // 表示するセリフの配列
  onComplete: () => void; // 全てのセリフを表示し終えたときに呼ばれる関数
}

export default function StoryChapter({ lines, onComplete }: StoryChapterProps) {
  // 今、何行目のセリフを表示しているかを覚えておくための変数
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const {pauseTimer,resumeTimer}=useGame();

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
  useEffect(()=>{
    pauseTimer();
    return ()=>{resumeTimer()};
  },[])
  return (
    // 画面全体を覆う黒い背景（クリック可能）
    <div
      className='absolute bottom-16 h-1/4 w-4/5 left-1/10 border rounded-3xl border-black flex justify-center items-center text-center text-xl'
      onClick={handleNextLine}
    >
      <div>
        <p>{lines[currentLineIndex]}</p>
        <div>▼</div>
      </div>
    </div>
  );
}