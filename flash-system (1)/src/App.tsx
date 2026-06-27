import { useState } from "react";
import { ViewState } from "./types";
import CanvasParticles from "./components/CanvasParticles";
import LoginView from "./components/LoginView";
import LoadingView from "./components/LoadingView";
import GameView from "./components/GameView";

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);

  return (
    <main className="relative min-h-screen w-full bg-[#050101] text-[#00f7ff] flex flex-col justify-center items-center overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-400">
      {/* Dynamic Background GIF Layer & Deep Warm Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img 
          src="https://thanosx.icu/appv2/png/raw/vid.gif" 
          alt="Background Animation" 
          className="absolute inset-0 w-full h-full object-cover opacity-25 brightness-75 mix-blend-screen"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] rounded-full bg-amber-600/10 blur-[130px]" />
        {/* Subtle grid/grain for high depth */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      </div>

      {/* Dynamic persistent drifting fire embers */}
      <CanvasParticles />

      {/* Screen Views router */}
      <div className="w-full flex justify-center items-center relative z-10 py-8">
        {view === ViewState.LOGIN && (
          <LoginView onSuccess={() => setView(ViewState.LOADING)} />
        )}
        {view === ViewState.LOADING && (
          <LoadingView onComplete={() => setView(ViewState.GAME)} />
        )}
        {view === ViewState.GAME && (
          <GameView />
        )}
      </div>
    </main>
  );
}

