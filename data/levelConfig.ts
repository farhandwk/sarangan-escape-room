// src/data/levelConfig.ts
export type GameType = "memory" | "quiz" | "explorer" | "dragdrop";

export interface DialogStep {
  text: string;
  intanPose: string;
  imgCustomClass?: string; 
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
        text: "Wah, awake dhewe wis tekan Telaga Sarangan! Hawane ing kene adhem banget ya.",
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png" // Pastikan file ini ada di folder public/girlPoses/
      },
      {
        text: "Enteni sedhela... Sajake pedhute nggawa pirang-pirang kartu Aksara Jawa sing pating sumebar.",
        intanPose: "/src/girlPoses/cewek_khawatir_nobg.png"
      },
      {
        text: "Ayo rewangi aku nggoleki pasangan kartu sing bener supaya pedhut iki ilang!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      }
    ],

    // Reaksi Intan saat permainan sedang berlangsung
    sidebarState: {
      idle: {
        text: "Pilih rong kartu kanggo nemokake pasangane. Eling-eling wujude Aksarane ya!",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      },
      success: {
        text: "Hebat! Pasangane pas. Terusna!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      },
      error: {
        text: "Waduh, sajake dudu kuwi pasangane. Jajal eling-eling maneh posisine.",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png",
        imgCustomClass: "scale-[1.3] origin-bottom -translate-x-2"
        
      },
      hint: {
        text: "Iki bocorane! Gatekna apik-apik ya, sedhela lho iki!",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      }
    },
    

    // Data spesifik yang akan dilempar ke komponen MemoryGame
    gameData: {
      pairsToFind: 3,
      cards: ["ꦲ", "ꦤ", "ꦕ"] 
    }
  },
};