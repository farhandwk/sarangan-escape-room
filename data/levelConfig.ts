// src/data/levelConfig.ts
export type GameType = "memory" | "quiz" | "explorer" | "dragdrop" | "maze";

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
export const KATA_BANK = [
  {id: 1, aksaraChar: "ꦕꦫ", latin: "Cara"},
  {id: 2, aksaraChar: "ꦱꦏ", latin: "Saka"},
  {id: 3, aksaraChar: "ꦫꦱ", latin: "Rasa"},
  {id: 4, aksaraChar: "ꦤꦩ", latin: "Nama"},
  {id: 5, aksaraChar: "ꦏꦪ", latin: "Kaya"},
  {id: 6, aksaraChar: "ꦢꦫ", latin: "Dara"},
  {id: 7, aksaraChar: "ꦒꦮ", latin: "Gawa"},
  {id: 8, aksaraChar: "ꦏꦕ", latin: "Kaca"},
  {id: 9, aksaraChar: "ꦢꦢ", latin: "Dada"},
  {id: 10, aksaraChar: "ꦗꦏ", latin: "Jaka"},
  {id: 11, aksaraChar: "ꦏꦭ", latin: "Kala"},
  {id: 12, aksaraChar: "ꦠꦥ", latin: "Tapa"},
  {id: 13, aksaraChar: "ꦤꦠ", latin: "Nata"},
  {id: 14, aksaraChar: "ꦲꦩ", latin: "Hama"},
  {id: 15, aksaraChar: "ꦭꦥ", latin: "Lapa"},
  {id: 16, aksaraChar: "ꦏꦠ", latin: "Kata"},
  {id: 17, aksaraChar: "ꦩꦪ", latin: "Maya"},
  {id: 18, aksaraChar: "ꦝꦤ", latin: "Dhana"},
  {id: 19, aksaraChar: "ꦱꦫ", latin: "Sara"},
  {id: 20, aksaraChar: "ꦤꦥ", latin: "Napa"}
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
      pairsToFind: 4, // Ubah angka ini jika client ingin lebih dari 3 pasang
      pool: KATA_BANK 
    }
  },
  // ... (Data Level 1 sebelumnya) ...

  "2": {
    id: "2",
    name: "Cemoro Sewu",
    gameType: "maze", 
    bgImage: "/src/background/sarangan_1_room.png", // Ganti dengan aset latar Pos 2 Anda
    
    introSequence: [
      {
        text: "Akhire awake dhewe tekan Pos 2, Cemoro Sewu! Hawane soyo adhem krasa nembus balung.",
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png" 
      },
      {
        text: "Eh, deloken kae! Bapak wis nunggu nang ngarep gapura labirin gaib. Katon mbingungake banget dalane.",
        intanPose: "/src/girlPoses/cewek_khawatir_nobg.png" // Atau gunakan pose Bapak jika ada
      },
      {
        text: "Tugasmu saiki nggoleki dalan metu sing bener. Terus pilih dalan sing ana tulisane 'Pitik' ngganggo sandhangan wulu! Aja nganti kleru!",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png"
      }
    ],

    sidebarState: {
      idle: {
        text: "Ayo, golek dalan sing unine 'Pitik'! Geser-geser nggunakake tombol panah ngisor kuwi.",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      },
      success: {
        text: "Bener banget! Kuwi sandhangan sing pas. Lanjut terus menyang dalan metu!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      },
      error: {
        text: "Waduh salah! Iku dudu 'Pitik'. Balik nang posisi awal. Eling-eling wujude aksarane, ayo baleni!",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png",
        imgCustomClass: "scale-[1.3] origin-bottom -translate-x-2"
      },
      hint: {
        text: "Bocorane: Pilih jalur sing ana sandhangan Wulu (i) nang dhuwur aksara!",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      }
    },
    
    // DATA SPESIFIK LABIRIN
    gameData: {
      mazeSize: 25, // Ukuran labirin (angka ganjil direkomendasikan)
      correctWord: "ꦥꦶꦠꦶꦏ꧀", // Contoh: "Pitik"
      wrongWords: [
        "ꦧꦥꦏ꧀",  // Bapak
        "ꦩꦤꦸꦏ꧀",  // Manuk
        "ꦏꦺꦛꦺꦏ꧀", // Kethek
        "ꦏꦺꦴꦢꦺꦴꦏ꧀"  // Kodok
      ]
    }
  },
};