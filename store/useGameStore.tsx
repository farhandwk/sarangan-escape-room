// src/store/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  currentUnlockedLevel: number;
  collectedCodes: Record<string, string>; // Menyimpan kode per level, misal: { "1": "A7", "2": "X9" }
  
  unlockNextLevel: () => void;
  addCollectedCode: (levelId: string, code: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentUnlockedLevel: 1,
      collectedCodes: {},
      
      unlockNextLevel: () => set((state) => ({ 
        currentUnlockedLevel: state.currentUnlockedLevel + 1 
      })),
      
      addCollectedCode: (levelId, code) => set((state) => ({
        collectedCodes: { ...state.collectedCodes, [levelId]: code }
      })),
    }),
    {
      name: 'sarangan-escape-storage', // Nama penyimpanan di LocalStorage browser
    }
  )
);