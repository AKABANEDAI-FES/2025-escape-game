import { notFound } from 'next/navigation';
import { gameData } from '@/lib/gameData';
import QrReaderClient from './QrReaderClient';

export async function generateStaticParams() {
  const chapterIds = Object.keys(gameData);
  return chapterIds.map((id) => ({ chapterId: id }));
}

export default async function QrReaderByChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  const chapter = gameData[chapterId];
  if (!chapter || chapter.type !== 'puzzle' || chapter.puzzleType !== 'QR_SCAN') {
    notFound();
  }

  const correctUrl = chapter.qrData || '';
  const nextChapterId = 'nextChapterId' in chapter ? chapter.nextChapterId : null;

  return (
    <QrReaderClient
      chapterId={chapterId}
      correctUrl={correctUrl}
      nextChapterId={nextChapterId}
    />
  );
}
