import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>2025 脱出ゲーム</h1>
      <Link href="/game/start">
        <button style={{ fontSize: "1.5rem", padding: "1rem" }}>
          ゲーム開始
        </button>
      </Link>
    </main>
  );
}
