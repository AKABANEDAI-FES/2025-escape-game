"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from '@/components/game/Timer';
import { useGame } from "@/app/provider/GameProvider";
import type { Html5Qrcode } from "html5-qrcode"; // 👈 型をインポート

const CONTAINER_ID = "qr-reader";
const Items: Record<string, string> = {
    id5: "金の鍵",
    id6: "銀の鍵",
    id7: "謎のアイテム",
  };

function normalizeUrl(u: string) {
  try {
    const t = u.trim();
    if (!t) return "";
    const url = new URL(t);
    url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString().toLowerCase();
  } catch {
    return u.trim().replace(/\/+$/, "").toLowerCase();
  }
}

export default function QrReaderClient({
  correctUrl,
  nextChapterId,  
  answer
}: {
  chapterId: string;
  correctUrl: string;
  nextChapterId: string | null;
  answer: string;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const { pauseTimer, resumeTimer } = useGame();
  const { setGameState, obtainedItems } = useGame();

  const handleItemScan = useCallback((scannedItem: string) => {
    setGameState((prev) => {
      if (prev.obtainedItems.includes(scannedItem)) {
        return prev;
      }
      return {
        ...prev,
        obtainedItems: [...prev.obtainedItems, scannedItem],
      };
    });
  }, [setGameState]);

  const handlePuzzleSolved = useCallback((correctUrl: string) => {
    setGameState((prev) => ({
      ...prev,
      solvedPuzzles: [
        ...prev.solvedPuzzles,
        { id: correctUrl, question: "QR問題", answer: answer },
      ],
    }));
  }, [setGameState, answer]);

  useEffect(() => {
    setMounted(true);
    resumeTimer(); // ✅ QR画面でタイマーを動かす
  }, [resumeTimer]);

  useEffect(() => {
    if (!mounted) return;
    if (!correctUrl) {
      setResult(
        "このチャプターはQRスキャンではないか、正解URLが設定されていません。"
      );
      return;
    }

    let html5QrCode: Html5Qrcode | null = null;
    let active = true;

(async () => {
      const el = document.getElementById(CONTAINER_ID);
      if (!el) return;

      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
        "html5-qrcode"
      );

      // ▼▼▼ 修正点1: formatsToSupportをここに移動 ▼▼▼
      html5QrCode = new Html5Qrcode(CONTAINER_ID, {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      });
      // ▲▲▲ ここまで ▲▲▲

      const devices = await Html5Qrcode.getCameras();
      if (!active || !devices?.length) {
        setResult("カメラが見つかりませんでした");
        return;
      }

      const back =
        devices.find((d) => {
          const label = (d.label || "").toLowerCase();
          return (
            label.includes("back") ||
            label.includes("rear") ||
            label.includes("environment")
          );
        }) ?? devices[0];
      
      // ▼▼▼ 修正点2: startメソッドのオプションから削除 ▼▼▼
      await html5QrCode.start(
        back.id,
        {
          fps: 10,
          qrbox: 250,
          // formatsToSupport: ...  ← この行を削除
        },
        // ▲▲▲ ここまで ▲▲▲
        (decodedText: string) => {
          const ok = normalizeUrl(decodedText) === normalizeUrl(correctUrl);
          const matchedItem = Object.entries(Items).find(
            ([id]) => id === decodedText
          );
          const alreadyObtained = matchedItem
            ? obtainedItems.includes(matchedItem[1])
            : false;

          if (ok) {
            handlePuzzleSolved(correctUrl); // ← ここで状態更新！
            if (nextChapterId) {
              pauseTimer();
              setShowPopup(true);
            } else {
              router.push("/success");
            }
          } else if (alreadyObtained) {
            setResult("このアイテムは既に取得済みです");
          } else if (matchedItem) {
            setResult(`${matchedItem[1]}を取得しました`);
            handleItemScan(matchedItem[1]);
          } else {
            setResult("違うみたい…");
          }
        },
        () => {}
      );
    })().catch((err) => {
      console.error(err);
      setResult("カメラの起動に失敗しました");
    });
    return () => {
      active = false;
      if (html5QrCode) {
        html5QrCode
          .stop()
          .then(() => html5QrCode?.clear())
          .catch(() => {});
      }
    };
  }, [mounted, correctUrl, router, nextChapterId, handleItemScan, obtainedItems, handlePuzzleSolved]);

  const handleNext = () => {
    if (nextChapterId) {
      router.push(`/game/${nextChapterId}`);
    } else {
      router.push('/success');
    }
  };

  if (!mounted) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>読み込み中...</div>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>QRコード読み取り</h1>

      {/* ✅ タイマーをここに表示 */}
      <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
        <Timer />
      </div>

      <div id={CONTAINER_ID} style={{ width: 320, height: 320, margin: '0 auto' }} />
      {result && <h2 style={{ marginTop: 12 }}>{result}</h2>}
      <button onClick={() => router.back()} style={{ marginTop: 16 }}>
        戻る
      </button>

      {/* ✅ 正解ポップアップ */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '24px 32px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ marginBottom: 20 }}>正解です！</h2>
            <button
              onClick={handleNext}
              style={{
                backgroundColor: '#0070f3',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              次へ →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
