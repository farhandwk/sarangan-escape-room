// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Tarik data dan fungsi dari Zustand
  const currentUnlockedLevel = useGameStore((state) => state.currentUnlockedLevel);
  const resetGame = useGameStore((state) => state.resetGame);

  // Mencegah Hydration Mismatch & Mengambil nama lama jika ada
  useEffect(() => {
    setIsLoaded(true);
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  if (!isLoaded) return <div className="h-[100svh] w-screen bg-[#3D2B1F]" />; // Loading state

  // ==========================================
  // HANDLER TOMBOL
  // ==========================================
  const handleStartNewGame = () => {
    if (!playerName.trim()) {
      alert("Masukkan nama Anda terlebih dahulu boss!");
      return;
    }
    
    // 1. Simpan nama baru
    localStorage.setItem("playerName", playerName);
    
    // 2. RESET SELURUH STATE ZUSTAND KE AWAL (Pembersihan Total)
    resetGame();
    
    // 3. Masuk ke cerita awal
    router.replace("/intro");
  };

  const handleContinueGame = () => {
    if (!playerName.trim()) {
      alert("Masukkan nama Anda terlebih dahulu boss!");
      return;
    }
    
    // 1. Update/Simpan nama
    localStorage.setItem("playerName", playerName);
    
    // 2. Langsung lempar ke Map (TANPA RESET)
    router.replace("/map");
  };

  return (
    <main className="relative flex items-center justify-center w-screen h-[100svh] bg-black overflow-hidden">
      
      {/* Background Gambar (Sesuaikan dengan background Anda) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/src/background/intro_bg.png" // Pastikan path ini benar
          alt="Background" 
          fill 
          className="object-cover blur-[3px] brightness-75" 
          priority
        />
      </div>

      {/* Kontainer Kartu Menu */}
      <div className="relative z-10 bg-white w-[90%] max-w-md p-6 sm:p-8 rounded-[30px] shadow-2xl flex flex-col items-center text-center">
        
        <h1 className="text-2xl sm:text-3xl font-black text-[#3D2B1F] mb-2 tracking-wide">
          Welcome to
        </h1>
        <p className="text-sm sm:text-base font-bold text-[#5A189A] mb-6 leading-relaxed">
          Sarangan Escape Room yaiku game interaktif kang bisa mbantu bocah-bocah sinau maca lan ngerteni aksara Jawa.
        </p>

        {/* Input Nama */}
        <input 
          type="text" 
          placeholder="Masukkan nama anda untuk memulai..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full border-2 border-[#5A189A] rounded-xl px-4 py-3 text-center font-bold text-[#3D2B1F] outline-none focus:ring-4 focus:ring-[#5A189A]/30 transition-all mb-6"
        />

        {/* LOGIKA RENDERING TOMBOL DINAMIS */}
        <div className="w-full flex flex-col gap-3">
          {currentUnlockedLevel > 1 ? (
            <>
              {/* TOMBOL LANJUTKAN (Khusus Pemain Lama) */}
              <button 
                onClick={handleContinueGame}
                className="w-full bg-[#FFB703] hover:bg-[#e0a000] text-[#3D2B1F] font-black tracking-widest text-lg rounded-xl py-4 transition-all active:scale-95 shadow-[0_5px_15px_rgba(255,183,3,0.4)]"
              >
                LANJUTKAN (POS {currentUnlockedLevel})
              </button>
              
              {/* TOMBOL MULAI BARU (Menghapus Progres) */}
              <button 
                onClick={() => {
                  const confirmReset = window.confirm("Yakin ingin mengulang dari awal? Semua progres dan kode rahasiamu akan hilang!");
                  if (confirmReset) handleStartNewGame();
                }}
                className="w-full bg-white border-2 border-[#5A189A] hover:bg-[#F3E8FF] text-[#5A189A] font-black tracking-widest text-sm rounded-xl py-3 transition-all active:scale-95"
              >
                MULAI DARI AWAL
              </button>
            </>
          ) : (
            /* TOMBOL MULAI (Khusus Pemain Baru) */
            <button 
              onClick={handleStartNewGame}
              className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black tracking-widest text-lg rounded-xl py-4 transition-all active:scale-95 shadow-[0_10px_20px_rgba(90,24,154,0.4)]"
            >
              MULAI
            </button>
          )}
        </div>

      </div>
    </main>
  );
}