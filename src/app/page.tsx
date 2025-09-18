'use client'
import Link from "next/link";
import { useGame } from "./provider/GameProvider";

export default function Home() {
  const {resetGame}=useGame();
    return (
    <main>
      <h1>2025 脱出ゲーム</h1>
      <Link href="/game/start">
        <button onClick={resetGame}>
          ゲーム開始
        </button>
      </Link>
    </main>
  );
}
