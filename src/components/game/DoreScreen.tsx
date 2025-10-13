"use client";

import { useState } from "react";

interface DoorScreenProps {
  onSolved: () => void;
}

export default function DoorScreen({ onSolved }: DoorScreenProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDoor = async () => {
    try {
      // デモ用外部 API に POST
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "openDoor" }),
      });

      const data = await res.json();

      console.log(data); // デバッグ用
      alert("ドアが開きました！（デモ）");

      setIsOpen(true);

      // ドアが開いたら次のチャプターへ
      onSolved();
    } catch (err) {
      console.error(err);
      alert("ドア操作に失敗しました（デモ）");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-2xl font-bold">🚪 ドアを開けるチャプター</h2>
      <button
        onClick={handleDoor}
        disabled={isOpen}
        className={`px-6 py-3 rounded-lg text-white transition ${
          isOpen
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isOpen ? "開きました！" : "ドアを開ける"}
      </button>
    </div>
  );
}
