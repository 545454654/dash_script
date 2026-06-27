import { useState } from "react";
import { ViewState } from "./types";
import CanvasParticles from "./components/CanvasParticles";
import LoginView from "./components/LoginView";
import LoadingView from "./components/LoadingView";
import GameView from "./components/GameView";

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);

  return (
    <main className="relative min-h-screen w-full bg-radial from-[#020b12] to-[#010409] text-[#00f7ff] flex flex-col justify-center items-center overflow-x-hidden selection:bg-[#00f7ff]/20 selection:text-[#00f7ff]">
      {/* Dynamic persistent constellation net background */}
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

