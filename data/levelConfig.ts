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

// ==========================================
// BANK AKSARA (Gudang Data Master)
// Tambahkan semua aksara di sini nanti!
// ==========================================
export const AKSARA_BANK = [
  { id: "ha", aksaraChar: "ꦲ", latin: "Ha" },
  { id: "na", aksaraChar: "ꦤ", latin: "Na" },
  { id: "ca", aksaraChar: "ꦕ", latin: "Ca" },
  { id: "ra", aksaraChar: "ꦫ", latin: "Ra" },
  { id: "ka", aksaraChar: "ꦏ", latin: "Ka" },
  { id: "da", aksaraChar: "ꦢ", latin: "Da" },
  { id: "ta", aksaraChar: "ꦠ", latin: "Ta" },
  { id: "sa", aksaraChar: "ꦱ", latin: "Sa" },
  { id: "wa", aksaraChar: "ꦮ", latin: "Wa" },
  { id: "la", aksaraChar: "ꦭ", latin: "La" },
  // Tinggal tambah sisanya kapan pun Anda mau boss!
];
export const levelConfig: Record<string, LevelData> = {
  "1": {
    id: "1",
    name: "Telaga Sarangan",
    gameType: "memory", 
    bgImage: "/src/background/sarangan_1_room.png", 
    
    introSequence: [
      {
        text: "Wah, awake dhewe wis tekan Telaga Sarangan! Hawane ing kene adhem banget ya.",
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png" 
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
    
    // PERUBAHAN: Masukkan Bank Aksara dan jumlah pasangan
    gameData: {
      pairsToFind: 3, // Ubah angka ini jika client ingin lebih dari 3 pasang
      pool: AKSARA_BANK 
    }
  },
};