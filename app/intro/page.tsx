"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { introSteps } from "@/data/introSteps"; 
import InteractiveMap from "@/app/components/interactiveMaps"; 

export default function IntroPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [playerName, setPlayerName] = useState("User");
  const [isFogging, setIsFogging] = useState(false);

  const [targetRoute, setTargetRoute] = useState("/level/1");

  const currentData = introSteps[stepIndex];

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setPlayerName(storedName);
  }, []);

  const formatText = (text: string) => text.replace("{nama}", playerName);

  const handleNext = () => {
    if (stepIndex === introSteps.length - 1) {
      router.push(targetRoute); // Gunakan targetRoute dinamis, bukan hardcode "/level/1"
      return;
    }

    const nextData = introSteps[stepIndex + 1];

    if (currentData.bottomComponent !== nextData.bottomComponent) {
      setIsFogging(true); 
      setTimeout(() => {
        setStepIndex(stepIndex + 1);
        setTimeout(() => {
          setIsFogging(false);
        }, 500); 
      }, 500);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <main 
      className="relative flex flex-col w-full max-w-md mx-auto h-[100dvh] overflow-hidden bg-center bg-cover bg-white text-[#3D2B1F]" 
    >
        <div className="absolute inset-0 bg-[url('/src/background/intro_bg.png')] bg-cover bg-center  blur-[3px]"></div>
      {/* LAYER KABUT */}
      <div 
        className={`absolute inset-0 z-50 bg-white/80 backdrop-blur-md transition-opacity duration-500 pointer-events-none ${
          isFogging ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* --- LAYER 1: SCROLLABLE CONTENT --- */}
      {/* Area ini menampung dialog dan objek, bisa di-scroll jika isinya panjang */}
      {/* pb-32 (padding-bottom) ditambahkan agar konten terbawah tidak tertutup oleh tombol floating */}
      <div className="flex-1 w-full overflow-y-auto pb-32 z-10">
        
        {/* AREA DIALOG (Atas) - Memanjang secara natural sesuai isi teks */}
        <div className="bg-[#EDF2F4] rounded-b-[40px] p-6 shadow-lg flex flex-col gap-6">
          <p className="text-sm font-bold leading-relaxed">
            {formatText(currentData.textTop)}
          </p>
          
          {/* <div className={`flex ${currentData.itemsContainerClass} gap-4`}> */}
          <div className={`flex items-start gap-4`}>
            <p className="flex-1 text-sm font-bold leading-relaxed">
                {formatText(currentData.textBottom)}
            </p>
            
            {/* WADAH DIPERBESAR: w-24 menjadi w-32 atau w-40 */}
            <div className={`relative flex-shrink-0 w-32 h-64 ${currentData.imgCustomClass}`}>
                <Image 
                src={currentData.intanPose} 
                alt="Intan" 
                fill 
                // HAPUS scale, gunakan object-contain dan object-bottom/object-top
                // className={`object-contain ${currentData.imageScale}`} 
                className="object-contain"
                />
            </div>
            </div>
        </div>

        {/* Jarak aman antara Dialog dan Peta/Gulungan */}
        <div className="mt-10 mb-6 flex flex-col items-center justify-center w-full px-6">
          {currentData.bottomComponent === "scroll" ? (
             <div className="relative w-full h-48 sm:h-56">
               <Image src="/src/gulungan.png" alt="Scroll" fill className="object-contain drop-shadow-xl" />
             </div>
          ) : (
             <div className="relative w-full max-w-[280px]"> 
               <InteractiveMap onSelectRoute={(route) => setTargetRoute(route)} /> 
             </div>
          )}
        </div>

      </div>

      {/* --- LAYER 2: FLOATING BUTTON (Fixed Bottom) --- */}
      {/* Posisi absolute di bawah layar, lengkap dengan gradient halus agar teks yang lewat di baliknya masih terbaca */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-6 pb-8 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-20 pointer-events-none">
        <button
          onClick={handleNext}
          // pointer-events-auto mengembalikan fungsi klik pada tombol ini meskipun container parent-nya transparan
          className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black tracking-widest text-lg rounded-xl py-4 transition-all active:scale-95 shadow-[0_10px_20px_rgba(90,24,154,0.4)] pointer-events-auto"
        >
          {currentData.buttonText}
        </button>
      </div>

    </main>
  );
}