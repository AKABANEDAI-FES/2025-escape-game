import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>2025 脱出ゲーム</h1>
      <div className="flex text-center justify-center">
        <div className="">
          <div className="m-24 w-80">
            <Link href="/game/start">
              <button className="text-5xl p-12 border border-blue-700 border-solid rounded leading-8">
                スタート
              </button>
            </Link>
          </div>
          <p className="m-12">合図があるまで触らないでください</p>
          <div className="border border-blue-700 border-solid rounded leading-8 h-48 flex flex-col w-40 m-auto">
            <div className="my-auto">
              <input id="id_easy" name="optiions" type="radio" className="hidden peer/easy"></input>
              <label htmlFor="id_easy" className="w-36 m-1 border border-blue-700 border-solid rounded leading-8 text-2xl px-5 py-1 peer-checked/easy:bg-blue-800 peer-checked/easy:text-white hover:bg-blue-300">EASY</label>
            </div>
            <div className="my-auto">
              <input id="id_normal" name="optiions" type="radio" className="hidden peer/normal" defaultChecked></input>
              <label htmlFor="id_normal" className="w-36 m-1 border border-blue-700 border-solid rounded leading-8 text-2xl px-5 py-1 peer-checked/normal:bg-blue-800 peer-checked/normal:text-white hover:bg-blue-300">NORMAL</label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
