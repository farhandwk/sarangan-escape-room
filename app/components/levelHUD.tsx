"use client";

interface LevelHUDProps {
  levelNumber: number;
  roomName: string; // <-- Menangkap nama ruangan/level
  cluesFound: number; // <-- Menggantikan aksaraFound
  totalClues: number; // <-- Menggantikan totalAksara
  onPauseClick: () => void;
}

export default function LevelHUD({ 
  levelNumber, 
  roomName, 
  cluesFound, 
  totalClues, 
  onPauseClick 
}: LevelHUDProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 pt-safe sm:pt-6 pointer-events-none">
      <div className="flex items-center justify-between w-full max-w-md mx-auto bg-[#EDF2F4] rounded-full shadow-[0_8px_15px_rgba(0,0,0,0.1)] border-b-4 border-[#95D5B2]/50 p-2 pl-3 pr-2 pointer-events-auto backdrop-blur-sm bg-opacity-95">
        
        {/* TOMBOL PAUSE */}
        <button 
          onClick={onPauseClick}
          className="flex items-center justify-center w-10 h-10 bg-[#5A189A] text-white rounded-full hover:bg-[#4a1380] active:scale-90 transition-all shadow-md flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>

        {/* NAMA LEVEL & RUANGAN */}
        <div className="flex flex-col items-center justify-center flex-1 mx-3 overflow-hidden">
          <span className="text-[10px] font-black text-[#FB8500] uppercase tracking-widest">
            Level {levelNumber}
          </span>
          <h1 className="text-sm font-black text-[#5A189A] truncate w-full text-center tracking-wide">
            {roomName}
          </h1>
        </div>

        {/* INDIKATOR PETUNJUK RUANGAN */}
        <div className="flex items-center gap-1.5 bg-[#FFB703] px-3 py-1.5 rounded-full shadow-inner border-2 border-[#FB8500]/20 flex-shrink-0">
           {/* Mengganti icon Scroll dengan icon Kunci/Petunjuk */}
           <span className="text-sm leading-none drop-shadow-sm">🔑</span>
           <span className="text-sm font-black text-[#5A189A] mt-0.5">
             {cluesFound}/{totalClues}
           </span>
        </div>

      </div>
    </header>
  );
}