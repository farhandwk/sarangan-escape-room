// src/app/components/games/MemoryGame.tsx
"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";

export interface CardItem {
  id: string;
  pairId: number;
  type: "aksara" | "latin";
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  data: {
    pairsToFind: number;
    pool: { id: number; aksaraChar: string; latin: string }[]; 
  };
  onResult: (isCorrect: boolean, msg?: string) => void;
  onComplete: (generatedCode: string, score: number) => void;
}

const MemoryGame = forwardRef(({ data, onResult, onComplete }: MemoryGameProps, ref) => {
  // --- STATE MANAGEMENT ---
  const [isPreviewing, setIsPreviewing] = useState(true); // Untuk mengunci klik pemain
  const [isFlippedForPreview, setIsFlippedForPreview] = useState(false); // KHUSUS pemicu animasi CSS
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // PELACAK METRIK PENILAIAN
  const [clickCount, setClickCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // ==========================================
  // TAHAP 1: TIMER ANIMASI PREVIEW (DIPERBARUI)
  // ==========================================
  useEffect(() => {
    setIsPreviewing(true); // Langsung kunci permainan dari awal

    // Beri jeda super singkat (100ms) agar kartu tergambar tertutup dulu,
    // baru paksa terbuka. Ini akan memicu animasi berputarnya!
    const openTimer = setTimeout(() => {
      setIsFlippedForPreview(true);
    }, 100);

    // Setelah 3 detik, tutup kembali kartunya dan buka gembok klik
    const closeTimer = setTimeout(() => {
      setIsFlippedForPreview(false);
      setIsPreviewing(false); 
    }, 3100);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  // ==========================================
  // EXPOSE FUNGSI PETUNJUK KE INDUK
  // ==========================================
  useImperativeHandle(ref, () => ({
    triggerHint() {
      if (cards.length === 0 || isWon || isLocked || flippedIndices.length > 0) return;

      const availableIndices = cards
        .map((c, i) => (!c.isMatched && !c.isFlipped ? i : -1))
        .filter((i) => i !== -1);

      if (availableIndices.length === 0) return;

      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const hintCardIndex = availableIndices[randomIndex];

      setHintCount((prev) => prev + 1);

      setIsLocked(true);
      setCards((prev) =>
        prev.map((c, i) =>
          i === hintCardIndex ? { ...c, isFlipped: true } : c
        )
      );

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c, i) =>
            i === hintCardIndex ? { ...c, isFlipped: false } : c
          )
        );
        setIsLocked(false);
      }, 2000);
    }
  }));

  // ==========================================
  // TAHAP 2: SHUFFLE ENGINE
  // ==========================================
  useEffect(() => {
    if (!data.pool || data.pool.length === 0) return;

    const shuffledPool = [...data.pool].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledPool.slice(0, data.pairsToFind);

    const generatedCards: CardItem[] = [];
    selectedPairs.forEach((item, index) => {
      generatedCards.push({
        id: `${item.id}-aksara-${index}`,
        pairId: item.id,
        type: "aksara",
        content: item.aksaraChar,
        isFlipped: false,
        isMatched: false,
      });
      generatedCards.push({
        id: `${item.id}-latin-${index}`,
        pairId: item.id,
        type: "latin",
        content: item.latin,
        isFlipped: false,
        isMatched: false,
      });
    });

    const finalShuffledCards = generatedCards.sort(() => Math.random() - 0.5);
    setCards(finalShuffledCards);
  }, [data.pool, data.pairsToFind]);

  // ==========================================
  // TAHAP 3: LOGIKA GAME LOOP
  // ==========================================
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsLocked(true); 
      
      const index1 = flippedIndices[0];
      const index2 = flippedIndices[1];

      if (cards[index1].pairId === cards[index2].pairId) {
        setCards((prev) =>
          prev.map((card, i) =>
            i === index1 || i === index2 ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
        setIsLocked(false);
        onResult(true, "Hebat! Bener banget, terusno kabeh sampe entek!");
      } else {
        onResult(false, "Waduh, dudu kui barange, baleni maneh!");
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
  // TAHAP 4: KONDISI MENANG
  // ==========================================
  useEffect(() => {
    const matchedPairs = cards.filter((c) => c.isMatched).length / 2;
    
    if (cards.length > 0 && matchedPairs === data.pairsToFind && !isWon) {
      setIsWon(true); 

      const endTime = Date.now();
      const timeElapsedInSeconds = startTimeRef.current 
        ? Math.floor((endTime - startTimeRef.current) / 1000) 
        : 0;

      const idealClicks = data.pairsToFind * 2; 
      const extraClicks = Math.max(0, clickCount - idealClicks);

      const baseScore = 1000;
      const clickPenalty = extraClicks * 20;
      const timePenalty = timeElapsedInSeconds * 5;
      const hintPenalty = hintCount * 100;

      let finalScore = baseScore - clickPenalty - timePenalty - hintPenalty;
      if (finalScore < 100) finalScore = 100;

      setTimeout(() => {
        const randomCode = Math.random().toString(36).substring(2, 4).toUpperCase();
        onComplete(randomCode, finalScore);
      }, 500); 
    }
  }, [cards, data.pairsToFind, onComplete, isWon, clickCount, hintCount]);

  // ==========================================
  // HANDLER KLIK KARTU
  // ==========================================
  const handleCardClick = (index: number) => {
    if (isPreviewing) return; // Dicegah oleh state isPreviewing
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    setClickCount((prev) => prev + 1);

    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices((prev) => [...prev, index]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl w-full mx-auto perspective-1000 items-center justify-items-center">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`relative w-full aspect-[2.5/3.5] max-w-[90px] sm:max-w-[120px] cursor-pointer outline-none transition-opacity duration-500 ${
              card.isMatched ? "opacity-60 cursor-default" : "hover:-translate-y-2"
            } [perspective:1000px]`}
            style={{ transition: "transform 0.2s ease-out" }}
          >
            <div 
              className="w-full h-full duration-500 [transform-style:preserve-3d] shadow-2xl rounded-xl"
              // PERUBAHAN DI SINI: Animasi CSS sekarang mengandalkan isFlippedForPreview
              style={{ transform: card.isFlipped || card.isMatched || isFlippedForPreview ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* SISI DEPAN (Tertutup) */}
              <div className="absolute inset-0 w-full h-full rounded-xl flex items-center justify-center [backface-visibility:hidden] overflow-hidden bg-black/20">
                 <Image src="/src/backCard.png" alt="Card Back" fill className="object-contain p-1 rounded-xl border-2 border-white/20" />
              </div>

              {/* SISI BELAKANG (Terbuka) */}
              <div className="absolute inset-0 w-full h-full rounded-xl border-[3px] border-[rgb(90,24,154)] bg-white flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-inner p-2">
                 
                 {card.type === "aksara" ? (
                   <span className="text-3xl md:text-5xl font-bold text-[#5A189A] drop-shadow-sm text-center whitespace-nowrap">
                     {card.content}
                   </span>
                 ) : (
                   <span className="text-base md:text-2xl font-black text-[#5A189A] capitalize drop-shadow-sm text-center whitespace-nowrap">
                     {card.content}
                   </span>
                 )}

              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

MemoryGame.displayName = "MemoryGame";
export default MemoryGame;