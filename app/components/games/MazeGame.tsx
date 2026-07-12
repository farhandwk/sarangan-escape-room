// src/app/components/games/MazeGame.tsx
"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { generateMaze, populateItems, Position, MazeItem } from "@/lib/mazeUtils"; // Pastikan path ini sesuai dengan lokasi file utils Anda

interface MazeGameProps {
  data: {
    mazeSize: number;
    correctWord: string;
    wrongWords: string[];
  };
  onResult: (isCorrect: boolean, msg?: string) => void;
  onComplete: (generatedCode: string, score: number) => void;
}

const MazeGame = forwardRef(({ data, onResult, onComplete }: MazeGameProps, ref) => {
  const CELL_SIZE = 45; // Ukuran kotak labirin
  const { mazeSize, correctWord, wrongWords } = data;

  // --- STATE MANAGEMENT ---
  const [maze, setMaze] = useState<number[][]>([]);
  const [items, setItems] = useState<MazeItem[]>([]);
  const [player, setPlayer] = useState<Position>({ x: 1, y: 1 });
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  // State Khusus Labirin
  const [isFogActive, setIsFogActive] = useState(true); // Kabut menyala dari awal
  const [score, setScore] = useState(1000);
  const [moveCount, setMoveCount] = useState(0);

  // ==========================================
  // EXPOSE FUNGSI PETUNJUK KE INDUK
  // ==========================================
  useImperativeHandle(ref, () => ({
    triggerHint() {
      if (isWon || isLocked || !isFogActive) return;

      // Hukuman skor karena memakai hint
      setScore((prev) => Math.max(0, prev - 100));

      // Buka kabut selama 3 detik
      setIsFogActive(false);
      setTimeout(() => {
        setIsFogActive(true);
      }, 3000);
    }
  }));

  // ==========================================
  // GENERATE LABIRIN SAAT KOMPONEN DIMUAT
  // ==========================================
  useEffect(() => {
    if (!mazeSize) return;
    const newMaze = generateMaze(mazeSize);
    setMaze(newMaze);
    // Masukkan parameter dinamis dari data config ke fungsi populateItems
    setItems(populateItems(newMaze, mazeSize, correctWord, wrongWords));
  }, [mazeSize, correctWord, wrongWords]);

  // ==========================================
  // LOGIKA PERGERAKAN PEMAIN
  // ==========================================
  const movePlayer = (dx: number, dy: number) => {
    if (isWon || isLocked || maze.length === 0) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Cek tabrakan dengan tembok (1)
    if (maze[newY][newX] === 1) return;

    setMoveCount((prev) => prev + 1);

    // Cek apakah pemain menginjak kata (item)
    const steppedItem = items.find(i => i.x === newX && i.y === newY);
    
    if (steppedItem) {
      if (steppedItem.isCorrect) {
        onResult(true);
      } else {
        // JIKA MENGINJAK JEBAKAN
        setIsLocked(true);
        onResult(false);
        setScore((prev) => Math.max(0, prev - 50)); // Penalti salah jalan
        
        // Kembalikan ke titik awal setelah Intan marah (1.5 detik)
        setTimeout(() => {
          setPlayer({ x: 1, y: 1 }); 
          setIsLocked(false);
        }, 1500);
        return; 
      }
    }

    // Pindahkan pemain jika aman
    setPlayer({ x: newX, y: newY });

    // Cek Kondisi Menang (Sampai di pojok kanan bawah)
    if (newX === mazeSize - 2 && newY === mazeSize - 2) {
      setIsWon(true);
      setIsLocked(true);
      
      // Kalkulasi Skor Akhir
      const penalty = moveCount * 2; // Makin banyak jalan, makin berkurang dikit
      const finalScore = Math.max(100, score - penalty);
      
      setTimeout(() => {
        const randomCode = Math.random().toString(36).substring(2, 4).toUpperCase();
        onComplete(randomCode, finalScore);
      }, 1000);
    }
  };

  // Mencegah render sebelum maze siap
  if (maze.length === 0) return <div className="text-white font-bold animate-pulse">Menyiapkan Jalur Gaib...</div>;

  return (
    <div className="relative w-full max-w-2xl aspect-square bg-[#1B4332] rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-[#FFB703]">
      
      {/* ==========================================
          KAMERA LABIRIN (Bergerak mengikuti pemain)
      ========================================== */}
      <div 
        className="absolute transition-transform duration-300 ease-out"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-${(player.x * CELL_SIZE) + (CELL_SIZE / 2)}px, -${(player.y * CELL_SIZE) + (CELL_SIZE / 2)}px)`,
          width: `${mazeSize * CELL_SIZE}px`,
          height: `${mazeSize * CELL_SIZE}px`,
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${mazeSize}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${mazeSize}, ${CELL_SIZE}px)`,
          }}
        >
          {maze.map((row, y) => row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`w-full h-full flex items-center justify-center relative
                ${cell === 1 ? 'bg-[#081C15]' : 'bg-[#D8F3DC] border-[0.5px] border-black/10'}
                ${x === mazeSize - 2 && y === mazeSize - 2 ? 'bg-[#FFB703] animate-pulse border-4 border-white' : ''}
              `}
            >
              {/* Render Item / Kata */}
              {items.find(i => i.x === x && i.y === y) && (
                 <span className="text-sm md:text-base font-extrabold text-[#5A189A] drop-shadow-md z-10 whitespace-nowrap">
                   {items.find(i => i.x === x && i.y === y)?.aksara}
                 </span>
              )}
              
              {/* Render Pemain */}
              {player.x === x && player.y === y && (
                <div className="w-3/4 h-3/4 bg-[#5A189A] rounded-full shadow-[0_0_15px_rgba(90,24,154,0.8)] border-2 border-white z-20 transition-all duration-200" />
              )}

              {/* Render Pintu Keluar (Visual Bintang/Goal) */}
              {x === mazeSize - 2 && y === mazeSize - 2 && (
                <span className="text-2xl z-10 animate-bounce">🚪</span>
              )}
            </div>
          )))}
        </div>
      </div>

      {/* ==========================================
          EFEK KABUT (FOG OF WAR)
      ========================================== */}
      <div 
        className={`absolute inset-0 pointer-events-none z-30 transition-opacity duration-1000 ease-in-out ${isFogActive ? 'opacity-100' : 'opacity-0'}`}
        style={{
           // Lubang pandangan di tengah
           background: 'radial-gradient(circle at 50% 50%, transparent 60px, rgba(8, 28, 21, 0.98) 180px)'
        }}
      />

      {/* ==========================================
          VIRTUAL D-PAD (Lebih minimalis & elegan)
      ========================================== */}
      <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 z-50">
        <div />
        <button onClick={() => movePlayer(0, -1)} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all">
           {/* SVG Panah Atas */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>
        <div />
        <button onClick={() => movePlayer(-1, 0)} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all">
           {/* SVG Panah Kiri */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={() => movePlayer(0, 1)} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all">
           {/* SVG Panah Bawah */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </button>
        <button onClick={() => movePlayer(1, 0)} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all">
           {/* SVG Panah Kanan */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
});

MazeGame.displayName = "MazeGame";
export default MazeGame;