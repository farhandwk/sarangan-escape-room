"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore"

// Array data untuk mempermudah render dan maintenance
const mapLevels = [
  {
    id: 1,
    name: "Telaga Sarangan",
    pathD: "M26.6096 92.7656L41.2864 111.839L108.962 124.833L109.394 124.916L109.367 125.354L108.132 145.588L108.11 145.957L107.75 146.044L54.8596 158.778L54.6614 158.826L54.4866 158.722L20.7561 138.545L20.5061 138.396L20.5129 138.104L21.5159 93.8652L21.5256 93.4619L21.9221 93.3857L26.1194 92.5791L26.4221 92.5215L26.6096 92.7656Z", // Ganti dengan path SVG asli dari Figma
    route: "/level/1",
    textX: 60,
    textY: 135,
  },
  {
    id: 2,
    name: "Cemoro Sewu",
    pathD: "M100.274 192.695L88.911 179.125L59.1687 189.164L23.4195 158.816L21.0129 138.115L54.7429 158.292L107.633 145.557L108.271 166.826L100.274 192.695Z", // Ganti dengan path SVG asli
    route: "/level/2",
    textX: 70,
    textY: 170,
  },
  {
    id: 3,
    name: "Mojosemi Forest Park",
    pathD: "M26.2133 93.0699L22.0161 93.8764L29.9374 84.4596L76.3701 70.4774L104.338 73.3507L131.61 59.3652L144.846 70.8457L155.152 88.6028L114.177 107.341L26.2133 93.0699Z", // Ganti dengan path SVG asli
    route: "/level/3",
    textX: 90,
    textY: 90,
  },
  {
    id: 4,
    name: "Blego",
    pathD: "M100.275 192.696L108.273 166.827L143.196 148.416L166.805 151.499L173.999 158.839L213.294 173.501L230.899 179.46L226.016 211.012L155.937 216.203L132.151 227.988L99.9797 222.902L100.275 192.696Z", // Ganti dengan path SVG asli
    route: "/level/4",
    textX: 160,
    textY: 190,
  },
  {
    id: 5,
    name: "Gunung Lawu",
    pathD: "M26.2144 93.0703L114.178 107.341L112.314 124.441L108.869 125.324L41.0061 112.294L26.2144 93.0703Z", // Ganti dengan path SVG asli
    route: "/level/5",
    textX: 75, // Koordinat sumbu X untuk teks angka (SILAKAN DISESUAIKAN NANTI)
    textY: 110
  },
  {
    id: 0,
    name: "Blank Spot",
    pathD: "M250.882 118.851L266.086 142.952L245.227 157.131L230.899 179.46L213.294 173.501L173.999 158.839L166.804 151.499L143.196 148.416L108.272 166.827L107.634 145.558L108.869 125.325L112.314 124.442L114.177 107.342L155.152 88.6039L144.847 70.8467L131.611 59.3662L151.327 48.5367L174.129 22.5247L187.168 25.5028L206.043 20.296L238.404 0.544922L274.369 11.9555L267.461 37.4467L253.599 48.8986L244.887 78.8347L227.359 87.4768L250.882 118.851Z", // Ganti dengan path SVG asli
    route: "/level/0",
  }
];

interface InteractiveMapProps {
  onSelectRoute?: (route: string) => void;
  onLevelStatus?: (levelId: number, isLocked: boolean) => void;
  variant?: "intro" | "hub";
}

export default function InteractiveMap({ onSelectRoute, onLevelStatus, variant= "intro" }: InteractiveMapProps) {
  const router = useRouter();
 // Pisahkan state hover dan click agar yang diklik tetap menyala (sticky)
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const currentUnlockedLevel = useGameStore((state) => state.currentUnlockedLevel);
  

  // Level yang aktif adalah yang sedang di-hover, atau fallback ke yang sedang dipilih
  const activeLevel = hoveredLevel !== null ? hoveredLevel : selectedLevel;

  // ==========================================
  // LOGIKA GAYA DINAMIS (Berdasarkan Variant)
  // ==========================================
  const containerClass = variant === "hub" 
    ? "relative w-full h-full max-w-3xl mx-auto flex flex-col items-center justify-center mt-36" // Gaya Besar untuk Map Hub
    : "relative w-full max-w-md mx-auto flex flex-col items-center"; // Gaya Kecil untuk Intro

  const svgClass = variant === "hub"
    ? "w-full h-full max-h-[75vh] drop-shadow-2xl overflow-visible object-contain scale-100 sm:scale-105 lg:scale-110 transition-transform duration-500"
    : "w-full h-full max-h-[35vh] drop-shadow-2xl overflow-visible object-contain";

  return (
    <div className={containerClass}>
      
      {/* --- LABEL NAMA LEVEL --- */}
      <div 
        className={`absolute -top-14 px-6 py-2 bg-white rounded-full shadow-lg border-2 border-[#5A189A] transition-all duration-300 z-20 pointer-events-none ${
          activeLevel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-[#5A189A] font-black tracking-wide text-lg">
          {/* Cari nama level berdasarkan activeLevel yang berupa angka */}
          {activeLevel ? mapLevels.find(l => l.id === activeLevel)?.name : ""}
        </p>
      </div>

      {/* --- PETA SVG --- */}
      <svg 
        viewBox="0 0 295 269"
        className={svgClass}
      >
        {mapLevels.map((level) => {
          const isBlank = level.id === 0;
          const isActive = activeLevel === level.id;
          const isSelected = selectedLevel === level.id;
          const isLocked = level.id > currentUnlockedLevel;
          const isCompleted = level.id < currentUnlockedLevel;

          return (
            // Gunakan tag <g> (group) untuk membungkus path dan text
            <g key={level.id}>
              <path
                d={level.pathD}
                onClick={() => {
                  if (!isBlank) {
                    setSelectedLevel(level.id); // Buat sticky
                    // Beri tahu halaman induk tentang status level yang diklik
                    if (onLevelStatus) onLevelStatus(level.id, isLocked);
                    // Hanya kirim rute jika level TIDAK terkunci
                    if (onSelectRoute && !isLocked) {
                      onSelectRoute(level.route); 
                    }
                  }
                }}
                onMouseEnter={() => {
                  if (!isBlank) setHoveredLevel(level.id);
                }}
                onMouseLeave={() => {
                  if (!isBlank) setHoveredLevel(null);
                }}
                className={`
                  transition-all duration-300
                  ${isBlank 
                    ? "fill-[#D8B4E2] stroke-white stroke-2 opacity-60 pointer-events-none" 
                    : isLocked 
                      // GAYA VISUAL UNTUK LEVEL TERKUNCI (Misal: Hitam Putih / Abu-abu)
                      ? "cursor-not-allowed fill-gray-500 stroke-gray-300 stroke-2 opacity-50"
                      : isActive || isSelected 
                        ? "cursor-pointer fill-[#5A189A] stroke-[#FFB703] stroke-[4px] drop-shadow-[0_0_15px_rgba(255,183,3,0.8)]" 
                        : "cursor-pointer fill-[#D8B4E2] stroke-white stroke-2 opacity-80 hover:opacity-100"
                  }
                `}
              />
              
              {/* --- RENDER ANGKA (Hanya jika bukan blank spot) --- */}
              {!isBlank && level.textX && level.textY && (
                <text
                  x={level.textX}
                  y={level.textY}
                  textAnchor="middle" // Teks berada persis di tengah koordinat
                  alignmentBaseline="middle" // Teks sejajar vertikal
                  className={`
                    pointer-events-none font-black text-sm transition-colors duration-300
                    ${isActive ? "fill-[#FFB703]" : "fill-white"}
                  `}
                  style={{ fontFamily: 'inherit' }} // Menggunakan font global (Righteous)
                >
                  {level.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}