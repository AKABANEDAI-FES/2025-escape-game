import { gameData } from '@/lib/gameData';
import GameClient from './GameClient';

export async function generateStaticParams() {
  const chapterIds = Object.keys(gameData);
  return chapterIds.map((id) => ({
    chapterId: id,
  }));
}

export default function GamePage({ params }: { params: { chapterId: string } }) {
  return <GameClient chapterId={params.chapterId} />;
}