import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ページのタイトルや説明を変更
export const metadata: Metadata = {
  title: "2025 脱出ゲーム",
  description: "リアル脱出ゲームのメイン進行システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // htmlの言語設定を日本語に
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}