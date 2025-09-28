'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

const CORRECT_QR = "https://osada-soroban.com/"; // 正解のQRコード内容をここに設定

export default function QrReaderPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (qrRef.current) {
      const scanner = new Html5QrcodeScanner(
        qrRef.current.id,
        { fps: 10, qrbox: 250 },
        false
      );
      scanner.render(
        (decodedText: string) => {
          const normalized = decodedText.trim().toLowerCase();
          const correct = CORRECT_QR.trim().toLowerCase();
          if (normalized === correct) {
            setResult('正解！');
          } else {
            setResult('違うみたい…');
          }
        },
        () => {}
      );
      return () => {
        scanner.clear();
      };
    }
  }, []);

  return (
    <div>
      <h1>QRコード読み取り画面</h1>
      <div id="qr-reader" ref={qrRef} />
      {result && <h2>{result}</h2>}
    </div>
  );
}