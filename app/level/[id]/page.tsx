// src/app/level/[id]/page.tsx
"use client";

import { useState, use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { levelConfig } from "@/data/levelConfig";
import { useGameStore } from "@/store/useGameStore";

// Komponen Game
import MemoryGame from "@/app/components/games/MemoryGame";
// import QuizGame from "@/components/game/types/QuizGame"; // Buat nanti
// import SceneExplorer from "@/components/game/types/SceneExplorer"; // Buat nanti

export default function ReusableLevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const currentLevel = levelConfig[id];

  

  const addCollectedCode = useGameStore((state) => state.addCollectedCode);
  const unlockNextLevel = useGameStore((state) => state.unlockNextLevel);
  const [victoryCode, setVictoryCode] = useState<string | null>(null); // Jika tidak null, tampilkan Pop-up Kemenangan

  // --- STATE MANAGEMENT ---
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [introIndex, setIntroIndex] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "success" | "error">("idle");

  const router = useRouter()
  const sidebarTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (!currentLevel) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Data Level tidak ditemukan.</div>;
  }
  // --- LOGIKA DATA AKTIF (Mencegah Hardcode & Crash) ---
  const defaultIntan = "/src/girlPoses/cewek_lambai_nobg.png"; // Gambar aman jika data kosong

  // --- LOGIKA DATA AKTIF (Mencegah Hardcode) ---
  // Tentukan dialog dan pose mana yang harus muncul saat ini
  // --- LOGIKA DATA AKTIF (Mencegah Hardcode & Crash) ---
  const activeSidebarData = !isGameStarted 
    // Tambahkan ?. dan || sebagai fallback jika data belum dibuat di config
    ? currentLevel.introSequence?.[introIndex] || { text: "Data intro belum ada...", intanPose: defaultIntan }
    : currentLevel.sidebarState?.[gameState] || { text: "Data state belum ada...", intanPose: defaultIntan };

  // --- HANDLER BUTTON SIDEBAR ---
  const handleSidebarButton = () => {
    if (!isGameStarted) {
      // Logic Lanjut Intro
      if (introIndex < currentLevel.introSequence.length - 1) {
        setIntroIndex((prev) => prev + 1);
      } else {
        setIsGameStarted(true); // Selesai intro, mulai game!
      }
    } else {
      // Logic Bantuan/Petunjuk saat game main
      alert("Menampilkan petunjuk...");
    }
  };

  // --- STYLING DINAMIS SIDEBAR ---
  const getSidebarStyle = () => {
    if (!isGameStarted) return "bg-[#EDF2F4] border-white/50"; // Warna Intro
    switch (gameState) {
      case "success": return "bg-[#D8F3DC] border-[#95D5B2]"; // Hijau
      case "error": return "bg-[#FFD6D6] border-[#FFADAD]";   // Merah
      default: return "bg-[#EDF2F4] border-white/50";         // Normal
    }
  };

  // --- COMPONENT FACTORY ---
  const renderGameContent = () => {
    // Sembunyikan area game jika Intro masih berlangsung
    if (!isGameStarted) return null;

    // Props standar yang akan disuntikkan ke SEMUA tipe game (Memory, Explorer, dll)
    const props = {
      data: currentLevel.gameData,
      
      // Handler saat pemain mencoba menjawab (memicu reaksi Sidebar)
      onResult: (isCorrect: boolean) => {
        // 1. Batalkan timer sebelumnya (mencegah glitch saat spam click)
        if (sidebarTimerRef.current) {
          clearTimeout(sidebarTimerRef.current);
        }

        // 2. Ubah state Sidebar (merubah warna & pose Intan)
        setGameState(isCorrect ? "success" : "error");
        
        // 3. Mulai timer baru (Kembali ke "idle" setelah 1.5 detik)
        sidebarTimerRef.current = setTimeout(() => {
          setGameState("idle");
        }, 1500); 
      },

      // Handler saat permainan selesai / menang
      onComplete: (code: string) => {
        // 1. Simpan kode alfanumerik ke State Global (Zustand/LocalStorage)
        addCollectedCode(id, code); 
        
        // 2. Tandai level berikutnya agar terbuka
        unlockNextLevel();
        
        // 3. Picu munculnya Pop-up / UI Kemenangan di layar
        setVictoryCode(code); 
      }
    };

    // Render komponen spesifik berdasarkan 'gameType' dari levelConfig.ts
    switch (currentLevel.gameType) {
      case "memory": 
        return <MemoryGame {...props} />;
        
      // TODO: Uncomment saat Anda membuat level berikutnya
      // case "quiz": 
      //   return <QuizGame {...props} />;
      // case "explorer": 
      //   return <SceneExplorer {...props} />;
      
      default: 
        return (
          <div className="text-white font-bold bg-black/50 backdrop-blur-md p-6 rounded-2xl border-2 border-red-500 shadow-xl">
            Tipe Game <span className="text-[#FFB703]">"{currentLevel.gameType}"</span> belum dibuat komponennya.
          </div>
        );
    }
  };

  useEffect(() => {
    return () => {
      if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current);
    };
  }, []);
  

  return (
    <>
      {/* ==========================================
        LAYER 99: ORIENTATION GUARD (Pelindung Layar Berdiri)
    ========================================== */}
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 text-center text-white bg-[#3D2B1F] landscape:hidden lg:hidden">
      <span className="mb-6 text-7xl animate-pulse">📱🔄</span>
      <h2 className="mb-2 text-2xl font-black tracking-widest text-[#FFB703]">
        PUTAR PERANGKAT
      </h2>
      <p className="text-sm opacity-80 max-w-[250px]">
        Petualangan ini dirancang untuk dimainkan dalam mode mendatar (Landscape).
      </p>
    </div>

      {/* MAIN CONTAINER (Landscape) */}
      <main className="relative w-screen h-[100dvh] landscape:flex lg:flex select-none">
        
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src={currentLevel.bgImage} alt="bg" fill className="object-cover blur-[2px] brightness-75" priority />
        </div>

        {/* ==========================================
            KOLOM KIRI (SIDEBAR 35%) - SESUAI FIGMA
        ========================================== */}
        {/* rounded-r-[40px] untuk melengkungkan sisi kanan saja seperti di desain */}
        <section className={`relative z-20 w-[35%] max-w-sm h-full p-6 flex flex-col justify-between transition-all duration-500 rounded-r-[40px] shadow-[10px_0_20px_rgba(0,0,0,0.2)] ${getSidebarStyle()}`}>
          
          {/* Teks Dialog (Tanpa background tambahan) */}
          <div className="mt-4 z-10">
             <p className="text-[#3D2B1F] font-black text-[15px] sm:text-base leading-relaxed">
               {activeSidebarData.text}
             </p>
          </div>

          {/* Karakter Intan & Tombol */}
          {/* PERBAIKAN TINGGI GAMBAR: Kita gunakan flex-1 di kontainer gambar agar ia memakan seluruh sisa ruang kosong secara otomatis */}
          <div className="relative flex flex-col flex-1 justify-end mt-2 z-10">
            <div className="relative w-full flex-1 min-h-[150px] mb-4">
              {activeSidebarData.intanPose ? (
                <Image
                  src={activeSidebarData.intanPose} 
                  alt="Intan" fill 
                  sizes="(max-width: 768px) 35vw, 300px"
                  className="object-contain object-bottom drop-shadow-xl transition-all duration-300" 
                />
              ) : null}
            </div>

            <button 
              onClick={handleSidebarButton}
              // Warna ungu gelap sesuai desain (#5A189A)
              className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black py-3 sm:py-4 rounded-2xl tracking-widest shadow-lg active:scale-95 transition-all flex-shrink-0"
            >
              {!isGameStarted ? "LANJUT" : "PETUNJUK"}
            </button>
          </div>
        </section>

        {/* --- KOLOM KANAN (AREA PERMAINAN 65%) --- */}
        <section className="relative z-10 flex-1 h-full flex items-center justify-center p-8">
          
          {/* HUD Mini */}
          {isGameStarted && (
            <div className="absolute top-6 right-8 flex gap-4 pointer-events-none z-30">
               <div className="bg-[#5A189A]/90 backdrop-blur-sm text-white px-6 py-2 rounded-full font-black shadow-lg border-2 border-[#FFB703]">
                 KODE: ? ?
               </div>
            </div>
          )}

          {/* Area Render Game Dinamis */}
          <div className="w-full h-full flex items-center justify-center animate-in zoom-in fade-in duration-500 delay-300">
             {renderGameContent()}
          </div>
        </section>

        {/* ==========================================
            LAYER 4: VICTORY MODAL (POP-UP KEMENANGAN)
            Akan otomatis muncul jika state 'victoryCode' memiliki isi
        ========================================== */}
        {victoryCode && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#EDF2F4] rounded-[32px] p-8 shadow-2xl flex flex-col items-center max-w-sm w-full border-4 border-[#95D5B2] text-center transform transition-all scale-100">
              
              <div className="w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4 border-4 border-[#95D5B2]">
                 <span className="text-4xl">🎉</span>
              </div>
              
              <h2 className="text-2xl font-black text-[#5A189A] mb-2 uppercase tracking-widest">
                Level Selesai!
              </h2>
              <p className="text-[#3D2B1F] font-bold mb-6 text-sm">
                Bagus sekali! Kamu berhasil menyelesaikan tantangan ini.
              </p>

              {/* Kotak Kode Rahasia */}
              <div className="bg-[#FFB703] border-4 border-[#5A189A] rounded-2xl p-4 w-full mb-6 shadow-inner relative overflow-hidden">
                <p className="text-[10px] font-black text-[#5A189A]/70 uppercase tracking-widest mb-1 relative z-10">
                  KODE RAHASIA:
                </p>
                <p className="text-5xl font-black text-[#5A189A] tracking-widest relative z-10">
                  {victoryCode}
                </p>
                {/* Efek kilap sederhana di dalam kotak kode */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]" />
              </div>

              <button 
                // Sementara akan mengarahkan user kembali ke menu utama (peta)
                onClick={() => router.push("/")}
                className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black py-4 rounded-2xl tracking-widest shadow-lg active:scale-95 transition-all"
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