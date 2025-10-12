import nextConfig from "../../next.config";

const basePath = nextConfig.basePath || '';

export interface StoryChapter {
  id: string;
  type: "story";
  content: string[];
  nextChapterId: string;
}

export interface PuzzleChapter {
  id: string;
  type: "puzzle";
  puzzleType: "QR_SCAN" | "TEXT_INPUT";
  question: string;
  answer: string; // 謎解きの答え（説明文）として使用
  qrData?: string; // QRスキャン時の正解データ
  imageUrl?: string;
  hint: string[]; // 型定義を string[] に合わせる
  nextChapterId: string;
  timeLimit: number; // 個別タイマー用のプロパティ
}

export interface ActionChapter {
  id: string; // idを追加
  type: "action";
  actionType: "DOOR_OPEN" | "PROJECTOR_CHANGE" | "LIGHTING_CHANGE";
  message: string;
  nextChapterId: string;
}
export interface EndingChapter {
  id: string; // idを追加
  type: "ending";
  title: string;
  message: string;
}

export type GameChapter =
  | StoryChapter
  | PuzzleChapter
  | ActionChapter
  | EndingChapter;

export const gameData: Record<string, GameChapter> = {
  start: {
    id: "chapter1",
    type: "story",
    content: [
      "AI: ようこそ、挑戦者よ。",
      "AI: この施設から脱出するためには、いくつかの謎を解く必要がある。",
      "AI: 健闘を祈る。",
    ],
    nextChapterId: "puzzle-1",
  },
  "puzzle-1": {
    id: "puzzle-1",
    type: "puzzle",
    puzzleType: "QR_SCAN",
    question: "謎を解き、その答えの裏を見ろ。",
    answer: `黒猫=9匹　灰色猫=6匹　三毛猫=5匹
　カレンダーから　965=ちょう
　⇒蝶の絵の裏`,
    qrData: "https://akabanedai-fes.com/", // QRスキャン時の正解はqrDataで判定
    imageUrl: `${basePath}/image/question/question1.png`,
    nextChapterId: "puzzle-2",
    hint: ["ヒント: 部屋の中央をよく見てみろ。", "ヒント２"],
    timeLimit: 180, // 例: 3分
  },
  "puzzle-2": {
    id: "puzzle-2",
    type: "puzzle",
    puzzleType: "QR_SCAN",
    question: "謎を解き、その答えの物を見ろ。",
    answer: `❤︎♠︎♠︎♦︎=book
　本のページを鏡に映すとドクロ
　⇒ドクロの中`,
    qrData: "id2",
    imageUrl: `${basePath}/image/question/question2.png`,
    hint: ["ヒント: 部屋の隅に注意してみろ。", "ヒント２"],
    nextChapterId: "puzzle-3",
    timeLimit: 180,
  },
  "puzzle-3": {
    id: "puzzle-3",
    type: "puzzle",
    puzzleType: "QR_SCAN", // `puzzleType`を追記
    question: "謎を解き、その答えに耳を近づけろ。",
    answer: `男子を逆から読むと「しんだ」　⇒女子
　*未定*
　*未定*
　⇒スタッフが持っている`,
    qrData: "id3",
    imageUrl: `${basePath}/image/question/question3.png`,
    hint: ["ヒント: 高い場所を探せ。", "ヒント２"],
    nextChapterId: "door-open-story",
    timeLimit: 180,
  },
  "door-open-story": {
    id: "chapter2-1",
    type: "story",
    content: [
      "AI: よくやった。目の前のドアを操作する権限を与える。",
      "AI: パネルを操作して、次のエリアへ進め。",
    ],
    nextChapterId: "action-door-open",
  },
  "action-door-open": {
    id: "action1",
    type: "action",
    actionType: "DOOR_OPEN",
    message: "ドアを開けています...",
    nextChapterId: "puzzle-4-story",
  },
  "puzzle-4-story": {
    id: "chapter2-2",
    type: "story",
    content: ["AI: このエリアは危険だ。センサーに触れないよう、慎重に進め。"],
    nextChapterId: "puzzle-4",
  },
  "puzzle-4": {
    id: "puzzle-4",
    type: "puzzle",
    puzzleType: "TEXT_INPUT",
    question: "中央のコンソールに表示された謎を解け。",
    answer: "test", // TEXT_INPUT時の正解はanswerで判定
    // "noimage"を削除
    nextChapterId: "projector-start-story",
    hint: ["ヒント: 部屋の壁に注目してみろ。", "ヒント２"],
    timeLimit: 240,
  },
  "projector-start-story": {
    id: "chapter3",
    type: "story",
    content: ["AI: 残す謎はあと一つ...。部屋の様子が変わる。よく観察しろ。"],
    nextChapterId: "action-projector-lights-on",
  },
  "action-projector-lights-on": {
    id: "action2",
    type: "action",
    actionType: "PROJECTOR_CHANGE",
    message: "システムを最終モードに移行します...",
    nextChapterId: "puzzle-5",
  },
  'puzzle-5': {
    id: 'puzzle-5',
    type: 'puzzle',
    puzzleType: 'TEXT_INPUT', // 問題文に合わせて修正
    question: "壁に投影された最後の謎だ。脱出のキーワードを入力せよ。",
    answer: "https://akabanedai-fes.com/",
    nextChapterId: "action-final-projector",
    hint: ["ヒント: 部屋の中央に注目してみろ。", "ヒント２"],
    timeLimit: 300,
  },
  "action-final-projector": {
    id: "action3",
    type: "action",
    actionType: "PROJECTOR_CHANGE",
    message: "脱出シーケンスを開始...",
    nextChapterId: "success-story",
  },
  "success-story": {
    id: "clear",
    type: "story",
    content: ["AI: 見事だ、挑戦者よ。君の勝利だ。", "AI: 出口は目の前だ。"],
    nextChapterId: "success",
  },
  success: {
    id: "ending-success",
    type: "ending",
    title: "脱出成功！",
    message: "全ての謎を解き、施設から脱出することができた。",
  },
  failure: {
    id: "ending-failure",
    type: "ending",
    title: "脱出失敗...",
    message: "時間切れです。もう一度挑戦してください。",
  },
};
