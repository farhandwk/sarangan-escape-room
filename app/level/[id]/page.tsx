// src/app/level/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { levelConfig } from "@/data/levelConfig";
import { useGameStore } from "@/store/useGameStore";

// Komponen Game
import MemoryGame from "@/app/components/games/MemoryGame";

export default function ReusableLevelPage() {
  const router = useRouter();
  const params = useParams();
  
  // Mengambil ID dengan aman, memastikan ia adalah string
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const currentLevel = idStr ? levelConfig[idStr] : null;

  // Tarik data Zustand
  const currentUnlockedLevel = useGameStore((state) => state.currentUnlockedLevel);
  const addCollectedCode = useGameStore((state) => state.addCollectedCode);
  const unlockNextLevel = useGameStore((state) => state.unlockNextLevel);
  const saveLevelScore = useGameStore((state) => state.saveLevelScore);
  const collectedCodes = useGameStore((state) => state.collectedCodes);

  // --- SISTEM SATPAM URL (PROTEKSI URUTAN LEVEL) ---
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!idStr) return;
    
    const levelIdNumber = Number(idStr);

    if (levelIdNumber > currentUnlockedLevel) {
      alert(`Eits! Pos ${levelIdNumber} isih dikunci, bos. Rampungke tantangan sadurunge dhisik!`);
      // Gunakan REPLACE agar tombol Back browser tidak bisa mencurangi sistem
      router.replace("/map");
    } else {
      // Jika level sah (sudah terbuka), izinkan render UI game
      setIsAuthorized(true);
    }
  }, [idStr, currentUnlockedLevel, router]);

  // --- STATE MANAGEMENT ---
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [introIndex, setIntroIndex] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "success" | "error" | "hint">("idle");
  const [levelScore, setLevelScore] = useState<number>(0);
  const [victoryCode, setVictoryCode] = useState<string | null>(null);
  
  const sidebarTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameRef = useRef<any>(null);

  // Jika belum diotorisasi oleh satpam URL, atau data level kosong, jangan render gamenya
  if (!isAuthorized || !currentLevel || !idStr) {
    return <div className="flex items-center justify-center h-[100svh] w-screen bg-black text-white">Memuat...</div>;
  }

  // --- LOGIKA DATA AKTIF ---
  const defaultIntan = "/src/girlPoses/cewek_lambai_nobg.png";
  const activeSidebarData = !isGameStarted 
    ? currentLevel.introSequence?.[introIndex] || { text: "Data intro belum ada...", intanPose: defaultIntan }
    : currentLevel.sidebarState?.[gameState] || { text: "Data state belum ada...", intanPose: defaultIntan };

  const handleSidebarButton = () => {
    if (!isGameStarted) {
      if (introIndex < currentLevel.introSequence.length - 1) {
        setIntroIndex((prev) => prev + 1);
      } else {
        setIsGameStarted(true);
      }
    } else {
      gameRef.current?.triggerHint();
      setGameState("hint");
      
      if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current);
      sidebarTimerRef.current = setTimeout(() => {
        setGameState("idle");
      }, 2500);
    }
  };

  const getSidebarStyle = () => {
    if (!isGameStarted) return "bg-[#EDF2F4] border-white/50";
    switch (gameState) {
      case "success": return "bg-[#D8F3DC] border-[#95D5B2]";
      case "error": return "bg-[#FFD6D6] border-[#FFADAD]";
      default: return "bg-[#EDF2F4] border-white/50";
    }
  };

  const handleGameResult = (isCorrect: boolean) => {
    if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current);
    setGameState(isCorrect ? "success" : "error");
    sidebarTimerRef.current = setTimeout(() => {
      setGameState("idle");
    }, 1500); 
  };

  const renderGameContent = () => {
    if (!isGameStarted) return null;
    
    switch (currentLevel.gameType) {
      case "memory": 
        return <MemoryGame 
            ref={gameRef} 
            data={currentLevel.gameData}
            onResult={handleGameResult}
            onComplete={(code, score) => {
              setVictoryCode(code);
              setLevelScore(score); 
              addCollectedCode(idStr, code);
              saveLevelScore(idStr, score);
              unlockNextLevel(Number(idStr));
            }}
        />;
      default: 
        return (
          <div className="text-white font-bold bg-black/50 backdrop-blur-md p-6 rounded-2xl border-2 border-red-500 shadow-xl">
            Tipe Game <span className="text-[#FFB703]">"{currentLevel.gameType}"</span> belum dibuat komponennya.
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 text-center text-white bg-[#3D2B1F] landscape:hidden lg:hidden">
        <span className="mb-6 text-7xl animate-pulse">📱🔄</span>
        <h2 className="mb-2 text-2xl font-black tracking-widest text-[#FFB703]">PUTAR PERANGKAT</h2>
        <p className="text-sm opacity-80 max-w-[250px]">
          Petualangan ini dirancang untuk dimainkan dalam mode mendatar (Landscape).
        </p>
      </div>

      <main className="relative w-screen h-[100svh] overflow-hidden bg-black flex select-none">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src={currentLevel.bgImage} alt="bg" fill className="object-cover blur-[2px] brightness-75" priority />
        </div>

        <section className={`relative z-20 w-[40%] max-w-md h-full p-4 sm:p-6 flex flex-col justify-between transition-all duration-500 rounded-r-[40px] shadow-[10px_0_20px_rgba(0,0,0,0.2)] ${getSidebarStyle()}`}>
          <div className="relative flex flex-row flex-1 h-full min-h-0 z-10 gap-2 sm:gap-4 mt-2">
            <div className="flex-1 flex items-center justify-start overflow-y-auto pb-2 pr-1">
               <p className="text-[#3D2B1F] font-black text-[13px] sm:text-[15px] leading-snug sm:leading-relaxed">
                 {activeSidebarData.text}
               </p>
            </div>
            <div className="relative w-[45%] h-full flex-shrink-0 flex items-end justify-center">
              {activeSidebarData.intanPose ? (
                <Image
                  src={activeSidebarData.intanPose} 
                  alt="Intan" 
                  fill 
                  sizes="(max-width: 768px) 25vw, 200px"
                  className={`object-contain object-bottom drop-shadow-xl ${activeSidebarData.imgCustomClass || ''}`} 
                />
              ) : null}
            </div>
          </div>
          <div className="w-full pt-3 z-10 flex-shrink-0">
            <button 
              onClick={handleSidebarButton}
              className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black py-3 sm:py-4 rounded-2xl tracking-widest shadow-lg active:scale-95 transition-all"
            >
              {!isGameStarted ? "LANJUT" : "PETUNJUK"}
            </button>
          </div>
        </section>

        <section className="relative z-10 flex-1 h-full flex items-center justify-center p-8">
          {isGameStarted && (
            <div className="absolute top-6 right-8 flex gap-4 pointer-events-none z-30">
               <div className="bg-[#5A189A]/90 backdrop-blur-sm text-white px-6 py-2 rounded-full font-black shadow-lg border-2 border-[#FFB703]">
                 KODE: {[ "1", "2", "3", "4" ].map((lvlId) => collectedCodes[lvlId] || "??").join(" - ")}
               </div>
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center animate-in zoom-in fade-in duration-500 delay-300">
             {renderGameContent()}
          </div>
        </section>

        {victoryCode && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">
            <div className="bg-[#EDF2F4] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl flex flex-col items-center max-w-sm w-full border-4 border-[#95D5B2] text-center transform transition-all scale-100 max-h-[95svh] overflow-y-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D8F3DC] rounded-full flex-shrink-0 flex items-center justify-center mb-2 sm:mb-4 border-4 border-[#95D5B2]">
                 <span className="text-3xl sm:text-4xl">🎉</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#5A189A] mb-1 sm:mb-2 uppercase tracking-widest flex-shrink-0">
                Level Selesai!
              </h2>
              <p className="text-[#3D2B1F] font-bold mb-4 text-xs sm:text-sm flex-shrink-0">
                Bagus sekali! Kamu berhasil menyelesaikan tantangan ini.
              </p>
              <div className="w-full flex justify-between items-center bg-white border-2 border-[#5A189A]/20 rounded-xl p-3 mb-4 shadow-sm flex-shrink-0">
                <span className="font-black text-[#3D2B1F] text-sm uppercase tracking-wide">
                  Total Skor:
                </span>
                <span className="font-black text-2xl text-[#95D5B2]">
                  {levelScore}
                </span>
              </div>
              <div className="bg-[#FFB703] border-4 border-[#5A189A] rounded-2xl p-3 sm:p-4 w-full mb-4 sm:mb-6 shadow-inner relative overflow-hidden flex-shrink-0">
                <p className="text-[10px] font-black text-[#5A189A]/70 uppercase tracking-widest mb-1 relative z-10">
                  KODE RAHASIA:
                </p>
                <p className="text-4xl sm:text-5xl font-black text-[#5A189A] tracking-widest relative z-10">
                  {victoryCode}
                </p>
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]" />
              </div>
              
              {/* PERBAIKAN TOMBOL: Gunakan router.replace untuk menghindari Back Ghost History */}
              <button 
                onClick={() => router.replace("/map")}
                className="w-full flex-shrink-0 bg-[#5A189A] hover:bg-[#4a1380] text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl tracking-widest shadow-lg active:scale-95 transition-all"
              >
                KEMBALI KE PETA
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}