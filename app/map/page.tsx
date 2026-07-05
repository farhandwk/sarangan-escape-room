// app/map/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";
import InteractiveMap from "@/app/components/interactiveMaps";

export default function MapTransitPage() {
  const router = useRouter();
  
  const currentUnlockedLevel = useGameStore((state) => state.currentUnlockedLevel);
  const collectedCodes = useGameStore((state) => state.collectedCodes);
  
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [isTargetLocked, setIsTargetLocked] = useState<boolean>(false);
  const [targetRoute, setTargetRoute] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setSelectedLevelId(currentUnlockedLevel);
    setTargetRoute(`/level/${currentUnlockedLevel}`);
    setIsTargetLocked(false);
  }, [currentUnlockedLevel]);

  if (!isLoaded) return <div className="h-[100svh] w-screen bg-black" />;

  const getSidebarState = () => {
    if (isTargetLocked) {
      return {
        text: "Eits, ora iso ngono boss! Rampungke sik tantangan sadurunge, ojo mbalelo!",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png",
        btnText: "TERKUNCI",
        btnClass: "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50",
        isDisabled: true,
        bgStyle: "bg-[#FFD6D6] border-[#FFADAD]",
        imgScale: "scale-140"
      };
    } else if (selectedLevelId < currentUnlockedLevel) {
      return {
        text: `Oalah, arep mbaleni Pos ${selectedLevelId} maneh? Ora opo-opo, jajal golek skor sing luwih dhuwur!`,
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png", 
        btnText: "MAIN LAGI",
        btnClass: "bg-[#FFB703] hover:bg-[#e0a000] text-[#3D2B1F] shadow-lg active:scale-95",
        isDisabled: false,
        bgStyle: "bg-[#EDF2F4] border-white/50", 
        imgScale: "scale-150"
      };
    } else {
      return {
        text: `Wah hebat! Ayo gek ndang lanjut menyang tantangan Pos ${selectedLevelId}!`,
        // PERBAIKAN: Menggunakan nama file yang benar agar gambar tidak rusak
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png", 
        btnText: `MULAI POS ${selectedLevelId}`,
        btnClass: "bg-[#5A189A] hover:bg-[#4a1380] text-white shadow-[0_10px_20px_rgba(90,24,154,0.4)] active:scale-95",
        isDisabled: false,
        bgStyle: "bg-[#D8F3DC] border-[#95D5B2]", 
        imgScale: ""
      };
    }
  };

  const sidebarState = getSidebarState();

  const handleStartLevel = () => {
    if (sidebarState.isDisabled || !targetRoute) return;
    router.push(targetRoute);
  };

  const handleMapStatus = (levelId: number, isLocked: boolean) => {
    setSelectedLevelId(levelId);
    setIsTargetLocked(isLocked);
    setTargetRoute(`/level/${levelId}`); 
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 text-center text-white bg-[#3D2B1F] landscape:hidden lg:hidden">
        <span className="mb-6 text-7xl animate-pulse">📱🔄</span>
        <h2 className="mb-2 text-2xl font-black tracking-widest text-[#FFB703]">PUTAR PERANGKAT</h2>
        <p className="text-sm opacity-80 mt-2 max-w-[250px]">
          Peta ini hanya bisa dibuka dalam mode mendatar (Landscape).
        </p>
      </div>

      <main className="relative w-screen h-[100svh] overflow-hidden bg-white flex select-none">
        
        {/* KOLOM KIRI: SIDEBAR INTAN (40%) */}
        <section className={`relative z-20 w-[40%] max-w-md h-full p-4 sm:p-6 flex flex-col justify-between transition-colors duration-500 rounded-r-[40px] shadow-[10px_0_20px_rgba(0,0,0,0.2)] ${sidebarState.bgStyle}`}>
          <div className="relative flex flex-row flex-1 h-full min-h-0 z-10 gap-2 sm:gap-4 mt-2">
            <div className="flex-1 flex items-center justify-start overflow-y-auto pb-2 pr-1">
               <p className="text-[#3D2B1F] font-black text-[13px] sm:text-[15px] leading-snug sm:leading-relaxed">
                 {sidebarState.text}
               </p>
            </div>
            
            <div className="relative w-[50%] h-full flex-shrink-0 flex items-end justify-center">
              <Image 
                src={sidebarState.intanPose} 
                alt="Intan" 
                fill 
                sizes="(max-width: 768px) 30vw, 250px"
                className={`object-contain drop-shadow-xl transition-all duration-300  ${sidebarState.imgScale}`} 
              />
            </div>
          </div>

          <div className="w-full pt-3 z-10 flex-shrink-0 flex flex-col gap-2">
            <button 
              onClick={handleStartLevel}
              disabled={sidebarState.isDisabled}
              className={`w-full font-black py-3 sm:py-4 rounded-2xl tracking-widest transition-all ${sidebarState.btnClass}`}
            >
              {sidebarState.btnText}
            </button>
          </div>
        </section>

        {/* KOLOM KANAN: AREA PETA SVG (60%) */}
        <section className="relative z-10 flex-1 h-full bg-[#1A1A24] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image src="/src/background/intro_bg.png" alt="bg" fill className="object-cover blur-[8px] brightness-50" priority />
          </div>

          <div className="absolute top-6 right-8 flex gap-4 pointer-events-none z-30">
             <div className="bg-[#5A189A]/90 backdrop-blur-sm text-white px-4 sm:px-6 py-2 rounded-full font-black shadow-lg border-2 border-[#FFB703] tracking-widest text-[10px] sm:text-xs uppercase">
               KODE: {[1, 2, 3, 4, 5].map(id => collectedCodes[id.toString()] || "??").join(" - ")}
             </div>
          </div>

          {/* HANYA MEMANGGIL PETA SVG ANDA DI SINI */}
          <div className="relative w-full max-w-2xl h-full max-h-[80vh] z-10 flex items-center justify-center p-4 sm:p-8">
            <InteractiveMap 
              onSelectRoute={(route) => setTargetRoute(route)}
              onLevelStatus={handleMapStatus} 
              variant="hub"
            />
          </div>
        </section>
      </main>
    </>
  );
}