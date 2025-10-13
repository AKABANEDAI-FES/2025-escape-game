"use client";

import { useRouter } from "next/navigation";
import { gameData } from "@/lib/gameData";
import StoryChapter from "@/components/StoryChapter";
import PuzzleDisplay from "@/components/game/PuzzleDisplay";
import SuccessScreen from "@/components/game/SuccessScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import { useGame } from "@/app/provider/GameProvider";
import { useEffect } from "react";
import DoorScreen from "@/components/game/DoreScreen";

export default function GameClient({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const chapter = gameData[chapterId];
  const { setCurrentChapterId } = useGame();

  useEffect(() => {
    setCurrentChapterId(chapterId);
  }, [chapterId, setCurrentChapterId]);

  if (!chapter) {
    return <p>チャプターが見つかりません</p>;
  }

  const goToNextChapter = () => {
    if (!("nextChapterId" in chapter) || !chapter.nextChapterId) {
      router.push("/");
      return;
    }

    let nextId = chapter.nextChapterId;
    let nextChapter = gameData[nextId];

    while (
      nextChapter &&
      nextChapter.type === "door" &&
      "nextChapterId" in nextChapter &&
      nextChapter.nextChapterId
    ) {
      nextId = nextChapter.nextChapterId;
      nextChapter = gameData[nextId];
    }

    if (nextId && gameData[nextId]) {
      setCurrentChapterId(nextId);
      router.push(`/game/${nextId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <main>
      {chapter.type === "story" && (
        <StoryChapter
          lines={chapter.content}
          onComplete={goToNextChapter}
          chapterId={chapterId}
        />
      )}
      {chapter.type === "puzzle" && (
        <PuzzleDisplay puzzle={chapter} onSolved={goToNextChapter} />
      )}
      {chapter.type === "door" && (
        <DoorScreen onSolved={goToNextChapter} />
      )}
      {chapter.type === "ending" && chapterId === "success" && (
        <SuccessScreen title={chapter.title} message={chapter.message} />
      )}
      {chapter.type === "ending" && chapterId === "failure" && (
        <GameOverScreen title={chapter.title} message={chapter.message} />
      )}
    </main>
  );
}
