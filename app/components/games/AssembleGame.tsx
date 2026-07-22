// src/app/components/games/AssembleGame.tsx
"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";

interface AssembleWord {
  latin: string;
  javanese: string;
  uniqueId?: string;
}

interface QuestionData {
  id: number;
  imageUrl: string;
  title: string;
  words: AssembleWord[];
  distractors?: AssembleWord[];
}

interface AssembleGameProps {
  data: {
    questions: QuestionData[];
  };
  onResult: (isCorrect: boolean) => void;
  onComplete: (generatedCode: string, score: number) => void;
}

const AssembleGame = forwardRef(({ data, onResult, onComplete }: AssembleGameProps, ref) => {
  const { questions } = data;
  const [qIndex, setQIndex] = useState(0);
  const currentQ = questions[qIndex];

  const [availablePieces, setAvailablePieces] = useState<AssembleWord[]>([]);
  const [slots, setSlots] = useState<(AssembleWord | null)[]>([]);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [score, setScore] = useState(1000);
  
  // State untuk fitur Hint (Petunjuk)
  const [hintActiveFor, setHintActiveFor] = useState<string | null>(null);

  // Inisialisasi Soal saat ini
  useEffect(() => {
    if (!currentQ) return;
    
    const allPieces = [...currentQ.words, ...(currentQ.distractors || [])].map((item, index) => ({
      ...item,
      uniqueId: `piece-${currentQ.id}-${index}`,
    }));

    setAvailablePieces(allPieces.sort(() => Math.random() - 0.5));
    setSlots(new Array(currentQ.words.length).fill(null));
    setIsError(false);
    setIsEvaluating(false);
    setHintActiveFor(null);
  }, [currentQ]);

  // Handle integrasi dengan tombol "PETUNJUK" dari Intan (page.tsx)
  useImperativeHandle(ref, () => ({
    triggerHint() {
      if (isEvaluating || !currentQ) return;
      
      // Potong skor 100
      setScore((prev) => Math.max(0, prev - 100));
      
      // Cari slot kosong pertama
      const firstEmptyIndex = slots.findIndex((slot) => slot === null);
      if (firstEmptyIndex !== -1) {
        // Cari kepingan yang seharusnya mengisi slot tersebut
        const targetLatin = currentQ.words[firstEmptyIndex].latin;
        const pieceToHighlight = availablePieces.find(p => p.latin === targetLatin);
        
        if (pieceToHighlight && pieceToHighlight.uniqueId) {
          // Buat kepingan tersebut menyala selama 2 detik
          setHintActiveFor(pieceToHighlight.uniqueId);
          setTimeout(() => setHintActiveFor(null), 2500);
        }
      }
    }
  }));

  const handleSelectPiece = (piece: AssembleWord) => {
    if (isEvaluating) return;

    const firstEmptyIndex = slots.findIndex((slot) => slot === null);
    if (firstEmptyIndex !== -1) {
      setAvailablePieces((prev) => prev.filter((p) => p.uniqueId !== piece.uniqueId));
      const newSlots = [...slots];
      newSlots[firstEmptyIndex] = piece;
      setSlots(newSlots);
    }
  };

  const handleRemovePiece = (piece: AssembleWord, index: number) => {
    if (isEvaluating || !piece) return;

    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setAvailablePieces((prev) => [...prev, piece]);
  };

  useEffect(() => {
    if (!currentQ) return;
    
    const isBoardFull = slots.every((slot) => slot !== null);
    if (isBoardFull && slots.length > 0) {
      setIsEvaluating(true);
      const isCorrect = slots.every((slot, index) => slot?.latin === currentQ.words[index].latin);

      if (isCorrect) {
        onResult(true);
        // Jika Benar
        setTimeout(() => {
          if (qIndex < questions.length - 1) {
            // Pindah ke soal berikutnya
            setQIndex(qIndex + 1);
          } else {
            // Semua soal selesai, generate kode
            const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            onComplete(randomCode, score); 
          }
        }, 1500); 
      } else {
        // Jika Salah
        onResult(false);
        setIsError(true);
        setScore((prev) => Math.max(0, prev - 50)); // Potong skor jika salah tebak
        
        setTimeout(() => {
          setAvailablePieces((prev) => [...prev, ...(slots as AssembleWord[])]);
          setSlots(new Array(currentQ.words.length).fill(null));
          setIsError(false);
          setIsEvaluating(false);
        }, 1200);
      }
    }
  }, [slots, currentQ, onResult, onComplete, qIndex, questions.length, score]);

  if (!currentQ) return null;

  return (
    <div className="flex flex-row w-[100%] h-[100%] gap-none bg-none shadow-2xl overflow-hidden"> 

    {/* KIRI: Area Jawaban dan Soal */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-4">
        
        {/* Slot Perakitan Kata (Glassmorphism + Teks Suku Kata) */}
        <div className="w-full flex flex-col items-center justify-center flex-1">
            <p className="text-[#D8F3DC] font-bold text-sm tracking-widest opacity-80 mb-2">
            SUSUN ING KENE:
          </p>
          <div className={`flex flex-row flex-wrap justify-center gap-3 sm:gap-4 transition-all duration-300 ${isError ? 'animate-shake' : ''}`}>
            {slots.map((slot, index) => (
              <div 
                key={`slot-${index}`}
                onClick={() => handleRemovePiece(slot!, index)}
                className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all overflow-hidden flex-shrink-0
                  ${slot 
                    ? 'border-[#FFB703] bg-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,183,3,0.3)] scale-100 hover:-translate-y-1' 
                    : 'border-dashed border-white/30 bg-white/5 backdrop-blur-sm scale-95 hover:bg-white/10'
                  }
                  ${isError && slot ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}
                `}
              >
                {slot ? (
                  // State Terisi: Tampilkan Aksara Jawa
                  <span className="relative z-10 text-white font-bold text-4xl sm:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {slot.javanese}
                  </span>
                ) : (
                  // State Kosong: Tampilkan Hint Suku Kata Latin
                  <span className="text-white/40 font-black text-xl sm:text-2xl uppercase tracking-widest drop-shadow-md">
                    {currentQ.words[index].latin}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Indikator Progres Soal (Hanya muncul jika soal > 1) */}
        {questions.length > 1 && (
           <div className="absolute bottom-0 flex gap-3">
              {questions.map((_, idx) => (
                 <div key={idx} className={`w-3 h-3 rounded-full transition-all ${idx === qIndex ? 'bg-[#FFB703] scale-125 shadow-[0_0_8px_#FFB703]' : idx < qIndex ? 'bg-[#95D5B2]' : 'bg-white/20'}`} />
              ))}
           </div>
        )}
      </div>

      {/* KANAN: BANK PILIHAN AKSARA */}
      <div className="w-[35%] flex flex-col p-3 sm:p-4 relative bg-white rounded-xl border-[3px] border-[rgb(90,24,154)]">
        
        <div className="flex-1 flex flex-row flex-wrap content-start justify-center gap-3 sm:gap-2 overflow-y-auto pb-4 scrollbar-hide pt-2">
          {availablePieces.map((piece) => (
            <button
              key={piece.uniqueId}
              onClick={() => handleSelectPiece(piece)}
              disabled={isEvaluating}
              className={`
                relative flex items-center justify-center w-16 h-24 sm:w-20 sm:h-28 rounded-xl transition-all flex-shrink-0 overflow-hidden cursor-pointer
                shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-[0_2px_5px_rgba(0,0,0,0.4)]
                ${hintActiveFor === piece.uniqueId 
                  ? 'ring-4 ring-[#FFB703] animate-pulse scale-110 z-10' 
                  : 'hover:scale-105 hover:ring-2 hover:ring-white/50'
                }
              `}
            >
              {/* Gambar Background Kartu Level 1 */}
              <div className="absolute inset-0 w-full h-full rounded-xl border-[3px] border-[rgb(90,24,154)] bg-white flex items-center justify-center shadow-inner p-2">
                <span className="text-2xl font-bold text-[#5A189A] drop-shadow-sm text-center">
                     {piece.javanese}
                   </span>
            </div>
            </button>
          ))}
        </div>
      </div>
      </div>
  );
});

AssembleGame.displayName = "AssembleGame";
export default AssembleGame;