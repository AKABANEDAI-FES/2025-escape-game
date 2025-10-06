import { notFound } from 'next/navigation';
import { gameData } from '@/lib/gameData';
import QrReaderClient from './QrReaderClient';

export async function generateStaticParams() {
  const chapterIds = Object.keys(gameData);
  return chapterIds.map((id) => ({
    chapterId: id,
  }));
}

export default function QrReaderByChapterPage({
  params,
}: {
  params: { chapterId: string };
}) {
  const chapter = gameData[params.chapterId];

  if (!chapter || chapter.type !== 'puzzle' || chapter.puzzleType !== 'QR_SCAN') {
    notFound();
  }

  const correctUrl = chapter.answer || '';
  const nextChapterId = 'nextChapterId' in chapter ? chapter.nextChapterId : null;

  return (
    <QrReaderClient
      chapterId={params.chapterId}
      correctUrl={correctUrl}
      nextChapterId={nextChapterId}
    />
  );
}
