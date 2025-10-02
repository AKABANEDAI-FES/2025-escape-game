'use client';

import { useEffect, useState } from 'react';

const CORRECT_QR = 'https://osada-soroban.com/';
const CONTAINER_ID = 'qr-reader';

export default function QrReaderPage() {
  const [result, setResult] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    let html5QrCode: any | null = null;
    let active = true;

    (async () => {
      const el = document.getElementById(CONTAINER_ID);
      if (!el) return;

      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');

      // ✔ コンストラクタには FullConfig として minimum に verbose を渡す
      html5QrCode = new Html5Qrcode(CONTAINER_ID, { verbose: false });

      const devices = await Html5Qrcode.getCameras();
      if (!active || !devices?.length) {
        setResult('カメラが見つかりませんでした');
        return;
      }

      const back = devices.find(d => {
        const label = (d.label || '').toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      }) ?? devices[0];

      await html5QrCode.start(
        back.id,
        {
          fps: 10,
          qrbox: 250,
          // ✔ formatsToSupport は start() の設定で渡す
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        },
        (decodedText: string) => {
          const ok = decodedText.trim().toLowerCase() === CORRECT_QR.trim().toLowerCase();
          setResult(ok ? '正解！' : '違うみたい…');
        },
        () => {}
      );
    })().catch(err => {
      console.error(err);
      setResult('カメラの起動に失敗しました');
    });

    return () => {
      active = false;
      if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode?.clear()).catch(() => {});
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div>
      <h1>QRコード読み取り画面</h1>
      <div id={CONTAINER_ID} style={{ width: 320, height: 320 }} />
      {result && <h2>{result}</h2>}
    </div>
  );
}
