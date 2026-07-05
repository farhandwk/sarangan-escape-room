import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  currentUnlockedLevel: number;
  collectedCodes: Record<string, string>; 
  levelScores: Record<string, number>; 
  
  // PERBAIKAN 1: Tambahkan parameter levelId agar sistem tahu level mana yang ditamatkan
  unlockNextLevel: (completedLevelId: number) => void; 
  addCollectedCode: (levelId: string, code: string) => void;
  saveLevelScore: (levelId: string, score: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentUnlockedLevel: 1,
      collectedCodes: {},
      levelScores: {},
      
      // LOGIKA BARU: Buka level HANYA JIKA level yang ditamatkan adalah level terakhir yang terbuka
      unlockNextLevel: (completedLevelId) => set((state) => {
        const nextLevel = completedLevelId + 1;
        if (nextLevel > state.currentUnlockedLevel) {
          return { currentUnlockedLevel: nextLevel };
        }
        return state; // Jika main ulang level lama, jangan ubah status unlock
      }),
      
      // LOGIKA BARU: Jangan timpa kode jika level tersebut sudah pernah diselesaikan
      addCollectedCode: (levelId, code) => set((state) => {
        if (state.collectedCodes[levelId]) {
          return state; // Abaikan jika sudah ada kodenya
        }
        return { collectedCodes: { ...state.collectedCodes, [levelId]: code } };
      }),

      // LOGIKA BARU: Sistem High Score (Hanya simpan jika skor baru lebih tinggi)
      saveLevelScore: (levelId, score) => set((state) => {
        const previousScore = state.levelScores[levelId] || 0;
        if (score > previousScore) {
          return { levelScores: { ...state.levelScores, [levelId]: score } };
        }
        return state; // Abaikan jika skor baru lebih kecil/jelek
      }),

      resetGame: () => set({ 
        currentUnlockedLevel: 1, 
        collectedCodes: {}, 
        levelScores: {} 
      }),
    }),
    {
      name: 'sarangan-escape-storage',
    }
  )
);