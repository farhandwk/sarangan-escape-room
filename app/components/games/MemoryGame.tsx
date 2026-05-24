"use client";

import { useState, use, useEffect, useRef } from "react";
import Image from "next/image";

export interface CardItem {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 1. UPDATE PROPS: Tambahkan onComplete
interface MemoryGameProps {
  data: {
    pairsToFind: number;
    cards: string[]; 
  };
  onResult: (isCorrect: boolean, msg?: string) => void;
  onComplete: (generatedCode: string) => void; // <-- TAMBAHKAN INI
}

export default function MemoryGame({ data, onResult, onComplete }: MemoryGameProps) {
  // --- STATE MANAGEMENT ---
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // ==========================================
  // TAHAP 2: SHUFFLE ENGINE
  // ==========================================
  useEffect(() => {
    const baseCards = data.cards;
    const pairedCards = [...baseCards, ...baseCards];

    for (let i = pairedCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedCards[i], pairedCards[j]] = [pairedCards[j], pairedCards[i]];
    }

    const initializedCards: CardItem[] = pairedCards.map((val, index) => ({
      id: `${val}-${index}`,
      value: val,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initializedCards);
  }, [data.cards]);

  // ==========================================
  // TAHAP 3: LOGIKA GAME LOOP (Pencocokan)
  // ==========================================
  useEffect(() => {
    // Jika ada 2 kartu yang sedang dibuka, jalankan pengecekan
    if (flippedIndices.length === 2) {
      setIsLocked(true); // Kunci papan agar tidak bisa klik kartu ke-3
      
      const index1 = flippedIndices[0];
      const index2 = flippedIndices[1];

      // JIKA COCOK
      if (cards[index1].value === cards[index2].value) {
        setCards((prev) =>
          prev.map((card, i) =>
            i === index1 || i === index2 ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
        setIsLocked(false);
        
        // Panggil fungsi onResult untuk memicu reaksi Intan di Sidebar
        onResult(true, "Hebat! Bener banget, terusno kabeh sampe entek!");
      } 
      // JIKA TIDAK COCOK
      else {
        onResult(false, "Waduh, dudu kui barange, baleni maneh!");
        
        // Beri jeda 1 detik sebelum kartu ditutup kembali
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === index1 || i === index2 ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, onResult]);

  // ==========================================
  // TAHAP 4: KONDISI MENANG (Win Condition)
  // ==========================================
  useEffect(() => {
    const matchedPairs = cards.filter((c) => c.isMatched).length / 2;
    
    if (cards.length > 0 && matchedPairs === data.pairsToFind && !isWon) {
      
      setIsWon(true); // 3. LANGSUNG KUNCI agar tidak berulang-ulang

      setTimeout(() => {
        const randomCode = Math.random().toString(36).substring(2, 4).toUpperCase();
        onComplete(randomCode);
      }, 500); 
    }
  }, [cards, data.pairsToFind, onComplete, isWon]);

  // ==========================================
  // HANDLER KLIK KARTU
  // ==========================================
  const handleCardClick = (index: number) => {
    // Cegah klik jika papan dikunci, kartu sudah terbuka, atau kartu sudah cocok
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    // Buka kartu secara visual
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    
    // Catat indeks kartu yang baru saja dibuka
    setFlippedIndices((prev) => [...prev, index]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* GRID KARTU (Visualisasi 3D Flip) */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto perspective-1000">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            // Kartu yang sudah matched akan sedikit memudar dan tidak bisa diklik
            className={`relative w-20 h-28 sm:w-28 sm:h-40 cursor-pointer outline-none transition-opacity duration-500 ${
              card.isMatched ? "opacity-60 cursor-default" : "hover:-translate-y-2"
            } [perspective:1000px]`}
            style={{ transition: "transform 0.2s ease-out" }}
          >
            {/* Inner Container untuk efek 3D Rotate */}
            <div 
              className="w-full h-full duration-500 [transform-style:preserve-3d] shadow-lg rounded-xl"
              style={{ transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              
              {/* SISI DEPAN (Tertutup / Cover Batik) */}
              <div className="absolute inset-0 w-full h-full rounded-xl border-2 border-[#FFB703]/50 bg-[#5A189A] flex items-center justify-center [backface-visibility:hidden] overflow-hidden">
                 {/* TODO: Ganti src ini dengan gambar cover batik Anda di folder public */}
                 {/* <Image src="/cover_kartu_batik.png" alt="Card Back" fill className="object-cover" /> */}
                 <span className="text-white/30 text-xs">Batikan</span>
              </div>

              {/* SISI BELAKANG (Terbuka / Aksara Jawa) */}
              <div className="absolute inset-0 w-full h-full rounded-xl border-4 border-[#5A189A] bg-[#EDF2F4] flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
                 {/* TODO: Integrasikan gambar Aksara Anda di sini */}
                 {/* <Image src={`/aksara/${card.value}.png`} alt={card.value} fill className="object-contain p-2" /> */}
                 
                 {/* Teks placeholder sementara */}
                 <span className="text-3xl font-black text-[#5A189A] capitalize">
                   {card.value}
                 </span>
              </div>

            </div>
          </button>
        ))}
      </div>
    </div>
  );
}