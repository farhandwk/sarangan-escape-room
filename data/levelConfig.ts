// src/data/levelConfig.ts
export type GameType = "memory" | "quiz" | "explorer" | "dragdrop";

export interface DialogStep {
  text: string;
  intanPose: string; 
}

export interface LevelData {
  id: string;
  name: string;
  gameType: GameType;
  bgImage: string;
  introSequence: DialogStep[];
  sidebarState: {
    idle: DialogStep;
    success: DialogStep;
    error: DialogStep;
    hint?: DialogStep;
  };
  gameData: any; 
}

export const levelConfig: Record<string, LevelData> = {
  "1": {
    id: "1",
    name: "Telaga Sarangan",
    gameType: "memory", 
    bgImage: "/src/background/sarangan_1_room.png", // Pastikan file ini ada di folder public/background/
    
    // Urutan dialog saat pertama kali level dibuka
    introSequence: [
      {
        text: "Wah, kita sudah sampai di Telaga Sarangan! Udara di sini sejuk sekali ya.",
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png" // Pastikan file ini ada di folder public/girlPoses/
      },
      {
        text: "Tunggu sebentar... Sepertinya kabutnya membawa beberapa kartu Aksara Jawa yang berantakan.",
        intanPose: "/src/girlPoses/cewek_khawatir_nobg.png"
      },
      {
        text: "Ayo bantu aku mencari pasangan kartu yang tepat agar kabut ini menghilang!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      }
    ],

    // Reaksi Intan saat permainan sedang berlangsung
    sidebarState: {
      idle: {
        text: "Pilih dua kartu untuk menemukan pasangannya. Ingat-ingat bentuk Aksaranya ya!",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png"
      },
      success: {
        text: "Hebat! Pasangan yang tepat. Lanjutkan!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      },
      error: {
        text: "Ups, sepertinya bukan itu pasangannya. Coba ingat lagi posisinya.",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png" // Pakai pose mikir/nantang
      }
    },

    // Data spesifik yang akan dilempar ke komponen MemoryGame
    gameData: {
      pairsToFind: 3,
      cards: ["ha", "na", "ca"] 
    }
  },
};