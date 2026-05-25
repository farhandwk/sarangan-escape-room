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
      <main className="relative w-screen h-[100svh] overflow-hidden bg-black flex select-none">
        
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src={currentLevel.bgImage} alt="bg" fill className="object-cover blur-[2px] brightness-75" priority />
        </div>

        {/* ==========================================
            KOLOM KIRI (SIDEBAR 40%) - LAYOUT BARU
        ========================================== */}
        {/* Catatan: Saya perlebar sedikit dari 35% ke 40% agar teks & gambar tidak terlalu sesak saat bersebelahan */}
        <section className={`relative z-20 w-[40%] max-w-md h-full p-4 sm:p-6 flex flex-col justify-between transition-all duration-500 rounded-r-[40px] shadow-[10px_0_20px_rgba(0,0,0,0.2)] ${getSidebarStyle()}`}>
          
          {/* AREA ATAS: Teks (Kiri) & Karakter (Kanan) */}
          <div className="relative flex flex-row flex-1 h-full min-h-0 z-10 gap-2 sm:gap-4 mt-2">

            {/* Kiri: Teks Dialog */}
            {/* overflow-y-auto memungkinkan teks di-scroll jika entah bagaimana teksnya luar biasa panjang */}
            <div className="flex-1 flex items-center justify-start overflow-y-auto pb-2 pr-1">
               <p className="text-[#3D2B1F] font-black text-[13px] sm:text-[15px] leading-snug sm:leading-relaxed">
                 {activeSidebarData.text}
               </p>
            </div>

            {/* Kanan: Karakter Intan */}
            {/* w-[45%] memastikan gambar mengambil porsi kanan, sisanya untuk teks */}
            <div className="relative w-[45%] h-full flex-shrink-0 flex items-end justify-center">
              {activeSidebarData.intanPose ? (
                <Image
                  src={activeSidebarData.intanPose} 
                  alt="Intan" 
                  fill 
                  sizes="(max-width: 768px) 25vw, 200px"
                  className="object-contain object-bottom drop-shadow-xl transition-all duration-300" 
                />
              ) : null}
            </div>
          </div>

          {/* AREA BAWAH: Tombol */}
          <div className="w-full pt-3 z-10 flex-shrink-0">
            <button 
              onClick={handleSidebarButton}
              className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black py-3 sm:py-4 rounded-2xl tracking-widest shadow-lg active:scale-95 transition-all"
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
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">
            
            {/* PERBAIKAN RESPONSIVITAS: 
                - max-h-[95svh]: Membatasi tinggi pop-up maksimal 95% dari tinggi layar
                - overflow-y-auto: Mengaktifkan scroll internal jika konten melebihi max-h
                - p-5 sm:p-8: Padding lebih kecil di HP, normal di Desktop
            */}
            <div className="bg-[#EDF2F4] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl flex flex-col items-center max-w-sm w-full border-4 border-[#95D5B2] text-center transform transition-all scale-100 max-h-[95svh] overflow-y-auto">
              
              {/* Ikon (Mengecil sedikit di HP) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D8F3DC] rounded-full flex-shrink-0 flex items-center justify-center mb-2 sm:mb-4 border-4 border-[#95D5B2]">
                 <span className="text-3xl sm:text-4xl">🎉</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-[#5A189A] mb-1 sm:mb-2 uppercase tracking-widest flex-shrink-0">
                Level Selesai!
              </h2>
              <p className="text-[#3D2B1F] font-bold mb-4 text-xs sm:text-sm flex-shrink-0">
                Bagus sekali! Kamu berhasil menyelesaikan tantangan ini.
              </p>

              {/* --- PLACEHOLDER SKOR LEVEL --- */}
              {/* flex-shrink-0 mencegah elemen ini tergencet saat layar sempit */}
              <div className="w-full flex justify-between items-center bg-white border-2 border-[#5A189A]/20 rounded-xl p-3 mb-4 shadow-sm flex-shrink-0">
                <span className="font-black text-[#3D2B1F] text-sm uppercase tracking-wide">
                  Total Skor:
                </span>
                <span className="font-black text-2xl text-[#95D5B2]">
                  0 {/* TODO: Akan diganti dengan state skor dari sistem penilaian */}
                </span>
              </div>

              {/* Kotak Kode Rahasia */}
              <div className="bg-[#FFB703] border-4 border-[#5A189A] rounded-2xl p-3 sm:p-4 w-full mb-4 sm:mb-6 shadow-inner relative overflow-hidden flex-shrink-0">
                <p className="text-[10px] font-black text-[#5A189A]/70 uppercase tracking-widest mb-1 relative z-10">
                  KODE RAHASIA:
                </p>
                <p className="text-4xl sm:text-5xl font-black text-[#5A189A] tracking-widest relative z-10">
                  {victoryCode}
                </p>
                {/* Efek kilap sederhana */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]" />
              </div>

              <button 
                onClick={() => router.push("/")}
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