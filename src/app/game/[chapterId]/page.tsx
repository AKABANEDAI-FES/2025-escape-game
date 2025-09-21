import { gameData } from '@/lib/gameData';
import GameClient from './GameClient';

export async function generateStaticParams() {
  const chapterIds = Object.keys(gameData);
  return chapterIds.map((id) => ({
    chapterId: id,
  }));
}

// GamePage を async にして params を await
export default async function GamePage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  return <GameClient chapterId={chapterId} />;
}
