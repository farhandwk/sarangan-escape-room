// LEVEL 1 - CARD FONT TEST
// src/app/UITest/page.tsx
"use client";

import React from "react";
// Panggil KATA_BANK langsung dari konfigurasi level Anda
import { levelConfig } from "@/data/levelConfig"; 

export default function UITestPage() {
  // Mengambil data dari Level 1 (Pastikan KATA_BANK sudah dimasukkan ke pool level 1)
  const kataBank = levelConfig["1"].gameData.pool || [];

  return (
    <main className="min-h-screen bg-black/90 p-4 sm:p-8 overflow-y-auto flex flex-col items-center">
      
      <div className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20 mb-8 text-center">
        <h1 className="text-3xl font-black text-[#FFB703] mb-2 tracking-widest uppercase">
          Laboratorium UI Kartu
        </h1>
        <p className="text-white font-bold opacity-80">
          Total Data: {kataBank.length} Pasang Kata
        </p>
      </div>

      {/* Grid untuk menjejerkan kartu (2 kolom di HP, 4-6 kolom di layar besar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 max-w-7xl w-full justify-items-center">
        
        {kataBank.map((item: any) => (
          <React.Fragment key={item.id}>
            
            {/* ==========================================
                KARTU 1: VERSI AKSARA JAWA 
            ========================================== */}
            <div className="relative w-full aspect-[2.5/3.5] max-w-[100px] sm:max-w-[120px] rounded-xl border-[3px] border-[rgb(90,24,154)] bg-white flex items-center justify-center overflow-hidden shadow-inner p-2">
               {/* 
                 Silakan modifikasi class Tailwind di bawah ini (text-4xl, sm:text-5xl, dsb) 
                 sampai ukurannya pas di layar. Jangan lupa tambahkan 'text-center whitespace-nowrap' 
                 agar tidak menabrak batas kiri/kanan.
               */}
               <span className="text-3xl sm:text-5xl font-bold text-[#5A189A] drop-shadow-sm text-center whitespace-nowrap">
                 {item.aksaraChar}
               </span>
               <div className="absolute top-1 left-2 text-[8px] font-bold text-gray-300">ID: {item.id}</div>
            </div>

            {/* ==========================================
                KARTU 2: VERSI TEKS LATIN 
            ========================================== */}
            <div className="relative w-full aspect-[2.5/3.5] max-w-[100px] sm:max-w-[120px] rounded-xl border-[3px] border-[rgb(90,24,154)] bg-white flex items-center justify-center overflow-hidden shadow-inner p-2">
               {/* 
                 Modifikasi juga class font teks Latin di sini. 
                 Untuk kata-kata, mungkin text-xl atau text-lg lebih aman dari text-4xl.
               */}
               <span className="text-lg sm:text-xl font-black text-[#5A189A] capitalize drop-shadow-sm text-center whitespace-nowrap leading-tight">
                 {item.latin}
               </span>
               <div className="absolute top-1 left-2 text-[8px] font-bold text-gray-300">ID: {item.id}</div>
            </div>

          </React.Fragment>
        ))}
        
      </div>
    </main>
  );
}