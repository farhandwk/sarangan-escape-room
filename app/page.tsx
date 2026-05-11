"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (name.trim() !== "") {
      // Simpan nama ke localStorage browser
      localStorage.setItem("playerName", name);
      router.push("/intro");
    } else {
      alert("Silakan masukkan nama Anda terlebih dahulu!");
    }
  };

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-end pb-0 bg-cover bg-center relative bg-white"
    >
      <div className="absolute inset-0 bg-[url('/src/background/tugu_bg.png')] bg-cover bg-center opacity-50 blur-[5px]"></div>
      {/* Title Placeholder */}
      <div className="absolute top-32 text-center text-[#212529]">
        <h2 className="text-xl font-bold">Welcome to</h2>
        <h1 className="text-4xl font-black">Sarangan<br/>Escape Room</h1>
      </div>

      {/* Card Input Nama */}
      <div className="bg-[#EDF2F4] h-full w-full max-w-md rounded-t-[40px] p-8 flex flex-col items-center shadow-2xl relative z-10">
        <p className="text-center text-sm font-normal text-[#212529] mb-6">
          Sarangan Escape Room adalah sebuah game interaktif yang dapat membantu proses anak belajar membaca dan memahami aksara jawa.
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama anda untuk memulai..."
          className="w-full border-2 border-[#5A189A] rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-[#95D5B2] bg-white text-[#212529] text-sm"
        />

        <button
          onClick={handleStart}
          className="w-full bg-[#5A189A] hover:bg-[#4a1380] text-white font-black tracking-widest text-lg rounded-xl py-4 transition-all active:scale-95"
        >
          MULAI
        </button>
      </div>
    </main>
  );
}