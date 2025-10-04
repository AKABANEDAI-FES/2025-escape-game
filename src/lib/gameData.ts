export interface StoryChapter {
  id: string;
  type: "story";
  content: string[];
  nextChapterId: string;
}

export interface PuzzleChapter {
  id: string;
  type: "puzzle";
  puzzleType: "QR_SCAN" | "TEXT_INPUT"; // パズルの種類
  question: string; // 問題文
  answer: string; // 答え
  qrData?: string; // QRコードのデータ（QR_SCANの場合）
  imageUrl?: string; // 画像URL
  hint: string; // ヒント
  nextChapterId: string; // 次の章のID
}

export interface ActionChapter {
  type: "action";
  actionType: "DOOR_OPEN" | "PROJECTOR_CHANGE" | "LIGHTING_CHANGE"; // 実行するアクションの種類
  message: string; // アクションの説明
  nextChapterId: string; // 次の章のID
}
export interface EndingChapter {
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
    qrData: "id1",
    imageUrl: "/image/question/question1.png",
    nextChapterId: "puzzle-2",
    hint: "ヒント: 部屋の中央をよく見てみろ。",
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
    imageUrl: "/image/question/question2.png",
    hint: "ヒント: 部屋の隅に注意してみろ。",
    nextChapterId: "puzzle-3",
  },
  "puzzle-3": {
    id: "puzzle-3",
    type: "puzzle",
    puzzleType: "QR_SCAN",
    question: "謎を解き、その答えに耳を近づけろ。",
    answer: `男子を逆から読むと「しんだ」　⇒女子
　*未定*
　*未定*
　⇒スタッフが持っている`,
    imageUrl: "/image/question/question3.png",
    qrData: "id3",
    hint: "ヒント: 高い場所を探せ。",
    nextChapterId: "door-open-story",
  },

  /**
   * 中盤: ドア操作と謎解き4
   */
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
    answer: "test",
    imageUrl: "noimage",
    nextChapterId: "projector-start-story",
    hint: "ヒント: 部屋の壁に注目してみろ。",
  },

  "projector-start-story": {
    id: "chapter3",
    type: "story",
    content: ["AI: 残す謎はあと一つ...。部屋の様子が変わる。よく観察しろ。"],
    nextChapterId: "action-projector-lights-on",
  },
  "action-projector-lights-on": {
    type: "action",
    actionType: "PROJECTOR_CHANGE", // 挑戦開始時のプロジェクターと照明操作[cite: 44]
    message: "システムを最終モードに移行します...",
    nextChapterId: "puzzle-5",
  },
  "puzzle-5": {
    id: "puzzle-5",
    type: "puzzle",
    puzzleType: "TEXT_INPUT",
    question: "壁に投影された最後の謎だ。脱出のキーワードを入力せよ。",
    answer: "test",
    imageUrl: "noimage",
    nextChapterId: "action-final-projector",
    hint: "ヒント: 部屋の中央に注目してみろ。",
  },

  /**
   * エンディング
   */
  "action-final-projector": {
    type: "action",
    actionType: "PROJECTOR_CHANGE", // 最終謎正解時のプロジェクター操作[cite: 11]
    message: "脱出シーケンスを開始...",
    nextChapterId: "success-story",
  },
  "success-story": {
    id: "clear",
    type: "story",
    content: ["AI: 見事だ、挑戦者よ。君の勝利だ。", "AI: 出口は目の前だ。"],
    nextChapterId: "success",
  },

  /**
   * ゲームオーバー / クリア画面
   */
  "final-story": {
    id: "clear",
    type: "story",
    content: ["AI: よくやった。これで全ての謎を解き明かした。"],
    nextChapterId: "success", // ★ 次のチャプターを'success'に設定
  },

  // ★ 'success'チャプターを新しい'ending'タイプに変更
  success: {
    type: "ending",
    title: "脱出成功！",
    message: "全ての謎を解き、施設から脱出することができた。",
  },
  failure: {
    type: "ending",
    title: "脱出失敗...",
    message: "時間切れです。もう一度挑戦してください。",
  },
};
