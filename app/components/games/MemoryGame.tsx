// src/app/components/games/MemoryGame.tsx
"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";

// PERUBAHAN 1: Struktur Kartu Diperbarui agar bisa menampung tipe berbeda (Aksara vs Latin)
export interface CardItem {
  id: string;         // ID unik untuk render react (key)
  pairId: string;     // Kunci pencocokan pasangan (misal: "ha" harus sama dengan "ha")
  type: "aksara" | "latin"; // Penentu wujud kartu
  content: string;    // Isi teksnya (Karakter Aksara Jawa ATAU teks Latin)
  isFlipped: boolean;
  isMatched: boolean;
}

// PERUBAHAN 2: Menerima data pool Aksara dari levelConfig
interface MemoryGameProps {
  data: {
    pairsToFind: number;
    pool: { id: string; aksaraChar: string; latin: string }[]; 
  };
  onResult: (isCorrect: boolean, msg?: string) => void;
  onComplete: (generatedCode: string, score: number) => void;
}

const MemoryGame = forwardRef(({ data, onResult, onComplete }: MemoryGameProps, ref) => {
  // --- STATE MANAGEMENT ---
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // PELACAK METRIK PENILAIAN (TETAP UTUH)
  const [clickCount, setClickCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // ==========================================
  // EXPOSE FUNGSI PETUNJUK KE INDUK (TETAP UTUH)
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
  // TAHAP 2: SHUFFLE ENGINE (DIPERBARUI)
  // ==========================================
  useEffect(() => {
    if (!data.pool || data.pool.length === 0) return;

    // 1. Acak seluruh Bank Aksara yang dikirim dari levelConfig
    const shuffledPool = [...data.pool].sort(() => Math.random() - 0.5);
    
    // 2. Potong sesuai jumlah pasangan yang diminta (misal: 3)
    const selectedPairs = shuffledPool.slice(0, data.pairsToFind);

    // 3. Buat 2 buah kartu berbeda untuk tiap 1 data Aksara
    const generatedCards: CardItem[] = [];
    selectedPairs.forEach((item, index) => {
      // Kartu 1: Wujud Aksara Jawa (Font)
      generatedCards.push({
        id: `${item.id}-aksara-${index}`,
        pairId: item.id, // Kunci Cocok
        type: "aksara",
        content: item.aksaraChar,
        isFlipped: false,
        isMatched: false,
      });
      // Kartu 2: Wujud Teks Latin
      generatedCards.push({
        id: `${item.id}-latin-${index}`,
        pairId: item.id, // Kunci Cocok
        type: "latin",
        content: item.latin,
        isFlipped: false,
        isMatched: false,
      });
    });

    // 4. Acak posisi akhir kartu di atas meja bermain
    const finalShuffledCards = generatedCards.sort(() => Math.random() - 0.5);

    setCards(finalShuffledCards);
  }, [data.pool, data.pairsToFind]);

  // ==========================================
  // TAHAP 3: LOGIKA GAME LOOP (DIPERBARUI)
  // ==========================================
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsLocked(true); 
      
      const index1 = flippedIndices[0];
      const index2 = flippedIndices[1];

      // LOGIKA KUNCI: Sekarang mencocokkan 'pairId', BUKAN 'value' yang sama
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
  // TAHAP 4: KONDISI MENANG (TETAP UTUH 100%)
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
  // HANDLER KLIK KARTU (TETAP UTUH)
  // ==========================================
  const handleCardClick = (index: number) => {
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
              style={{ transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* SISI DEPAN (Tertutup) - TETAP UTUH */}
              <div className="absolute inset-0 w-full h-full rounded-xl flex items-center justify-center [backface-visibility:hidden] overflow-hidden bg-black/20">
                 <Image src="/src/backCard.png" alt="Card Back" fill className="object-contain p-1 rounded-xl border-2 border-white/20" />
              </div>

              {/* SISI BELAKANG (Terbuka) - LOGIKA FONT DINAMIS */}
              <div className="absolute inset-0 w-full h-full rounded-xl border-[3px] border-[rgb(90,24,154)] bg-white flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-inner">
                 
                 {card.type === "aksara" ? (
                   // Jika tipenya Aksara, gunakan ukuran font yang lebih besar (text-4xl/6xl)
                   <span className="text-4xl sm:text-6xl font-normal text-[#5A189A] drop-shadow-sm">
                     {card.content}
                   </span>
                 ) : (
                   // Jika tipenya Latin, gunakan huruf tebal dan ukuran sedikit lebih kecil 
                   <span className="text-2xl sm:text-4xl font-black text-[#5A189A] capitalize drop-shadow-sm">
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