'use client';

import { useGame } from '@/app/provider/GameProvider';
import { useEffect, useState } from 'react';

interface StoryChapterProps {
  chapterId: string;
  lines: string[];
  onComplete: () => void;
}

export default function StoryChapter({ chapterId, lines, onComplete }: StoryChapterProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const { setGameState , pauseTimer} = useGame();
  useEffect(() => {
    setGameState(prev => {
      if (prev.viewedStoryChapters.includes(chapterId)) {
        return prev;
      }
      return {
        ...prev,
        viewedStoryChapters: [...prev.viewedStoryChapters, chapterId],
      };
    });
  }, [chapterId, setGameState]);
  useEffect(()=>{
    pauseTimer();
  }, [pauseTimer]);
  const handleNextLine = () => {
    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      onComplete();
    }
  };
  return (
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