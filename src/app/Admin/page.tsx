"use client";

import { useState } from "react"; // ★ useStateをインポート
import { useRouter } from "next/navigation";
import { useGame } from "../provider/GameProvider";

export default function Admin (){
    const { resetTimer } = useGame();
    const router = useRouter();

    // ★ 選択された分と秒を覚えておくための状態
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);

    // 「時間を設定」ボタンが押されたときの処理
    const handleSetTime = () => {
        // 分と秒を合計秒数に変換
        const totalSeconds = minutes * 60 + seconds;
        // ProviderのresetTimer関数を呼び出す
        resetTimer(totalSeconds);
        alert(`${minutes}分${seconds}秒にタイマーを設定しました。`);
    };
    
    const handleBackAndReset = () => {
        router.back();
    };

    return (
        <div>
            <h1>管理者用ページ</h1>
            <p>ここでは、ゲームの進行状況を確認したり、設定を変更したりできます。</p>
            
            <hr style={{ margin: '2rem 0' }} />

            {/* ★ 時間設定用のUIを追加 */}
            <div>
                <select 
                    value={minutes} 
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}
                >
                    {/* 0から59までの選択肢を生成 */}
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                <span>分</span>

                <select 
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    style={{ fontSize: '1.2rem', marginLeft: '1rem', marginRight: '0.5rem' }}
                >
                    {/* 0から59までの選択肢を生成 */}
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                <span>秒</span>

                <button 
                    onClick={handleSetTime}
                    style={{ marginLeft: '1.5rem' }}
                >
                    時間を設定
                </button>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <button onClick={handleBackAndReset}>
                元のページに戻りゲームをリセット
            </button>
        </div>
    )
}