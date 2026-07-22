// src/app/components/games/MazeGame.tsx
"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { generateMaze, populateItems, Position, MazeItem } from "@/lib/mazeUtils"; 

interface MazeGameProps {
  data: {
    mazeSize: number;
    correctSequence: string[]; // <-- BERUBAH MENJADI ARRAY
    wrongWords: string[];
  };
  onResult: (isCorrect: boolean, msg?: string) => void;
  onComplete: (generatedCode: string, score: number) => void;
  onTargetChange: (newIndex: number) => void; // <-- TAMBAHAN KOMUNIKASI SOAL
}

const MazeGame = forwardRef(({ data, onResult, onComplete, onTargetChange }: MazeGameProps, ref) => {
  const [CELL_SIZE, setCELL_SIZE] = useState(45);
  const { mazeSize, correctSequence, wrongWords } = data;

  const [maze, setMaze] = useState<number[][]>([]);
  const [items, setItems] = useState<MazeItem[]>([]);
  const [player, setPlayer] = useState<Position>({ x: 1, y: 1 });
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  const [isFogActive, setIsFogActive] = useState(true); 
  const [score, setScore] = useState(1000);
  const [moveCount, setMoveCount] = useState(0);

  // <-- STATE BARU: Pelacak Progres Soal Berurutan
  const [visitedCorrect, setVisitedCorrect] = useState<Set<string>>(new Set());
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Ukuran Responsif
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCELL_SIZE(85);
      else if (window.innerWidth >= 768) setCELL_SIZE(65);
      else setCELL_SIZE(45);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useImperativeHandle(ref, () => ({
    triggerHint() {
      if (isWon || isLocked || !isFogActive) return;
      setScore((prev) => Math.max(0, prev - 100));
      setIsFogActive(false);
      setTimeout(() => { setIsFogActive(true); }, 3000);
    }
  }));

  useEffect(() => {
    if (!mazeSize || !correctSequence || correctSequence.length === 0) return;
    const newMaze = generateMaze(mazeSize);
    setMaze(newMaze);
    setItems(populateItems(newMaze, mazeSize, correctSequence, wrongWords));
    
    // Reset status setiap kali labirin digenerate ulang
    setVisitedCorrect(new Set());
    setCurrentQIndex(0);
  }, [mazeSize, correctSequence, wrongWords]);

  const movePlayer = (dx: number, dy: number) => {
    if (isWon || isLocked || maze.length === 0) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY][newX] === 1) return;

    setMoveCount((prev) => prev + 1);

    const steppedItem = items.find(i => i.x === newX && i.y === newY);
    
    if (steppedItem) {
      if (steppedItem.isCorrect) {
        // JIKA MENGINJAK SOAL BENAR
        const posKey = `${newX},${newY}`;
        // Pastikan belum pernah diinjak sebelumnya (biar ga curang mundur)
        if (!visitedCorrect.has(posKey)) {
          setVisitedCorrect((prev) => new Set(prev).add(posKey));
          const nextIndex = currentQIndex + 1;
          setCurrentQIndex(nextIndex);
          onTargetChange(nextIndex); // <--- KASIH TAU INTAN GANTI SOAL!
          onResult(true);
        }
      } else {
        // JIKA MENGINJAK JEBAKAN
        setIsLocked(true);
        onResult(false);
        setScore((prev) => Math.max(0, prev - 50)); 
        
        // <--- HUKUMAN: KEMBALI KE SOAL NOMOR 1
        setVisitedCorrect(new Set());
        setCurrentQIndex(0);
        onTargetChange(0); // Intan ngomong soal pertama lagi

        setTimeout(() => {
          setPlayer({ x: 1, y: 1 }); // Tampar balik ke start
          setIsLocked(false);
        }, 1500);
        return; 
      }
    }

    setPlayer({ x: newX, y: newY });

    if (newX === mazeSize - 2 && newY === mazeSize - 2) {
      setIsWon(true);
      setIsLocked(true);
      const penalty = moveCount * 2; 
      const finalScore = Math.max(100, score - penalty);
      setTimeout(() => {
        const randomCode = Math.random().toString(36).substring(2, 4).toUpperCase();
        onComplete(randomCode, finalScore);
      }, 1000);
    }
  };

  if (maze.length === 0) return <div className="text-white font-bold animate-pulse">Menyiapkan Jalur Gaib...</div>;

  return (
    <div className="relative h-[85%] sm:h-[90%] w-auto aspect-square bg-[#1B4332] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 sm:border-4 border-[#FFB703] mx-auto">
      <div 
        className="absolute transition-transform duration-300 ease-out"
        style={{
          left: '50%', top: '50%',
          transform: `translate(-${(player.x * CELL_SIZE) + (CELL_SIZE / 2)}px, -${(player.y * CELL_SIZE) + (CELL_SIZE / 2)}px)`,
          width: `${mazeSize * CELL_SIZE}px`, height: `${mazeSize * CELL_SIZE}px`,
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            display: 'grid', gridTemplateColumns: `repeat(${mazeSize}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${mazeSize}, ${CELL_SIZE}px)`,
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
              {items.find(i => i.x === x && i.y === y) && (
                <div className="absolute z-40 flex items-center justify-center transform scale-110 sm:scale-125">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-[#5A189A] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#5A189A] whitespace-nowrap tracking-wide leading-none block">
                      {items.find(i => i.x === x && i.y === y)?.aksara}
                    </span>
                  </div>
                </div>
              )}
              
              {player.x === x && player.y === y && (
                <div className="relative w-full h-full z-20 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-3/4 h-3/4 bg-[#FFB703]/30 rounded-full blur-md animate-pulse" />
                  <img src="/src/mazeChar.png" alt="Player" className="absolute w-[120%] h-[120%] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-[bounce_1s_infinite]" style={{ bottom: '10%' }} />
                </div>
              )}

              {x === mazeSize - 2 && y === mazeSize - 2 && (
                <span className="text-2xl z-10 animate-bounce">🚪</span>
              )}
            </div>
          )))}
        </div>
      </div>

      <div className={`absolute inset-0 pointer-events-none z-30 transition-opacity duration-1000 ease-in-out ${isFogActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: `radial-gradient(circle at 50% 50%, transparent ${CELL_SIZE * 0.9}px, rgba(8, 28, 21, 1.0) ${CELL_SIZE * 2.5}px)` }}
      />

      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 grid grid-cols-3 gap-1 sm:gap-2 z-50">
        <div />
        <button onClick={() => movePlayer(0, -1)} className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
        <div />
        <button onClick={() => movePlayer(-1, 0)} className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
        <button onClick={() => movePlayer(0, 1)} className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg></button>
        <button onClick={() => movePlayer(1, 0)} className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg active:bg-white/40 active:scale-90 border border-white/50 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
      </div>
    </div>
  );
});

MazeGame.displayName = "MazeGame";
export default MazeGame;