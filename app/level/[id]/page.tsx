"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

export default function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap params menggunakan React.use() (Standar Next.js App Router terbaru)
  const resolvedParams = use(params);
  const levelId = resolvedParams.id;

  return (
    <main className="flex flex-col items-center justify-center min-h-[100dvh] bg-white p-6">
      <h1 className="text-4xl font-black text-[#3D2B1F] mb-4 text-center">
        Halaman Level {levelId}
      </h1>
      <button
        onClick={() => router.push("/")}
        className="w-full max-w-sm bg-[#5A189A] hover:bg-[#4a1380] text-white font-black tracking-widest text-lg rounded-xl py-4 transition-all active:scale-95 shadow-[0_10px_20px_rgba(90,24,154,0.4)]"
      >
        KEMBALI KE MENU UTAMA
      </button>
    </main>
  );
}