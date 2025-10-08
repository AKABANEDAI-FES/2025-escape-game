"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/provider/GameProvider";

const CONTAINER_ID = "qr-reader";

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
}: {
  chapterId: string;
  correctUrl: string;
  nextChapterId: string | null;
}) {
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { setGameState, obtainedItems } = useGame();

  const items: Record<string, string> = {
    id5: "金の鍵",
    id6: "銀の鍵",
    id7: "謎のアイテム",
  };
  const handleItemScan = (scannedItem: string) => {
    setGameState(prev => {
      if (prev.obtainedItems.includes(scannedItem)) {
        return prev;
      }
      return {
        ...prev,
        obtainedItems: [...prev.obtainedItems, scannedItem],
      };
    });
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!correctUrl) {
      setResult(
        "このチャプターはQRスキャンではないか、正解URLが設定されていません。"
      );
      return;
    }

    let html5QrCode: any | null = null;
    let active = true;

    (async () => {
      const el = document.getElementById(CONTAINER_ID);
      if (!el) return;

      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
        "html5-qrcode"
      );
      html5QrCode = new Html5Qrcode(CONTAINER_ID, { verbose: false });

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
      
      await html5QrCode.start(
        back.id,
        {
          fps: 10,
          qrbox: 250,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        },
        (decodedText: string) => {
          const ok = normalizeUrl(decodedText) === normalizeUrl(correctUrl);
          const matchedItem = Object.entries(items).find(([id]) => id === decodedText);
          const alreadyObtained = matchedItem ? obtainedItems.includes(matchedItem[1]) : false;
          if (matchedItem) {
            setResult(`${matchedItem[1]}を取得しました`);
          }
          if (ok) {
            // 正解時は次のチャプターへ
            if (nextChapterId) {
              router.push(`/game/${nextChapterId}`);
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
  }, [mounted, correctUrl, router, nextChapterId]);

  if (!mounted) return null;

  return (
    <div>
      <h1>QRコード読み取り</h1>
      <div id={CONTAINER_ID} style={{ width: 320, height: 320 }} />
      {result && <h2 style={{ marginTop: 12 }}>{result}</h2>}
      <button onClick={() => router.back()} style={{ marginTop: 16 }}>
        戻る
      </button>
    </div>
  );
}
