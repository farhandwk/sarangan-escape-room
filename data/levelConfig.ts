// src/data/levelConfig.ts
export type GameType = "memory" | "quiz" | "explorer" | "assemble" | "maze";

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
    bgImage: "/src/background/sarangan_1_room.png",
    
    introSequence: [
      {
        text: "Akhire awake dhewe tekan Pos 2, Cemoro Sewu! Hawane soyo adhem krasa nembus balung.",
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png" 
      },
      {
        text: "Eh, deloken kae! Bapak wis nunggu nang ngarep gapura labirin gaib. Katon mbingungake banget dalane.",
        intanPose: "/src/girlPoses/cewek_khawatir_nobg.png"
      },
      {
        text: "Tugasmu saiki nggoleki dalan metu sing bener. Pilih dalan sing ana tulisane '{TARGET_WORD}'! Aja nganti kleru!",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png"
      }
    ],

    sidebarState: {
      idle: {
        text: "Ayo, golek dalan sing unine '{TARGET_WORD}'! Geser-geser nggunakake tombol panah ngisor kuwi.",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      },
      success: {
        text: "Bener banget! Kuwi sandhangan sing pas. Lanjut terus menyang dalan metu!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      },
      error: {
        text: "Waduh salah! Iku dudu '{TARGET_WORD}'. Balik nang posisi awal. Eling-eling wujude aksarane, ayo baleni!",
        intanPose: "/src/girlPoses/cewek_nantang_nobg.png",
        imgCustomClass: "scale-[1.3] origin-bottom -translate-x-2"
      },
      hint: {
        // Teks ini muncul sesaat selama 2.5 detik saat tombol petunjuk ditekan (kabut hilang)
        text: "Kabut gaibe tak ilangi sedela! Gek ndang deloken dalan sing bener kanggo '{TARGET_WORD}'!",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      }
    },
    
    // ==========================================
    // BANK SOAL (FORMAT PERSIS LEVEL 1)
    // ==========================================
    gameData: {
      mazeSize: 35, 
      pool: [
        { id: 1, aksaraChar: "ꦥꦶꦠꦶꦏ꧀", latin: "Pitik" },
        { id: 2, aksaraChar: "ꦩꦤꦸꦏ꧀", latin: "Manuk" },
        { id: 3, aksaraChar: "ꦏꦺꦛꦺꦏ꧀", latin: "Kethek" },
        { id: 4, aksaraChar: "ꦏꦺꦴꦢꦺꦴꦏ꧀", latin: "Kodok" },
        { id: 5, aksaraChar: "ꦮꦼꦢꦸꦱ꧀", latin: "Wedus" },
        { id: 6, aksaraChar: "ꦧꦥꦏ꧀", latin: "Bapak" },
        { id: 7, aksaraChar: "ꦱꦥꦶ", latin: "Sapi" },
        { id: 8, aksaraChar: "ꦏꦸꦕꦶꦁ", latin: "Kucing" },
        { id: 9, aksaraChar: "ꦒꦗꦃ", latin: "Gajah" },
        { id: 10, aksaraChar: "ꦈꦭ", latin: "Ula" }
      ]
    }
  },

  "3": {
    id: "3",
    name: "Hutan Mojosemi",
    gameType: "assemble", 
    bgImage: "/src/background/sarangan_1_room.png", // Sesuaikan nama file background Hutan Mojosemi
    
    introSequence: [
      {
        text: "Sugeng rawuh ing Hutan Mojosemi! Hutan iki rada misterius, lho.",
        intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png"
      },
      {
        text: "Tugase gampang: aku bakal nyekel barang, terus kowe tebak tembung sing nyambung karo barang kuwi.",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png"
      },
      {
        text: "Tapi ati-ati, tebakane kudu disusun nganggo Aksara Jawa lan ana Pasangane. Ayo, asah utekmu lan temokna kabeh kode misterius ing kene!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png",
        imgCustomClass: "scale-[1.2] origin-bottom"
      }
    ],

    sidebarState: {
      idle: {
        text: "Ayo, apa sing tok lakoni nganggo barang iki?",
        intanPose: "/src/assembleObjects/dingklik.png", // Gunakan pose bertanya/menunjuk jika ada
        imgCustomClass: "scale-[1.5] origin-bottom -translate-x-2"
      },
      success: {
        text: "Wah, bener banget, lanjut soal nomer loro!",
        intanPose: "/src/girlPoses/cewek_heroic_nobg.png"
      },
      error: {
        text: "Waduh, susunan iki salah, coba baleni maneh!",
        intanPose: "/src/girlPoses/cewek_khawatir_nobg.png",
        imgCustomClass: "scale-[1.3] origin-bottom -translate-x-2"
      },
      hint: {
        text: "Iki bocorane! Coba eling-eling maneh wujud pasangane, aja nganti kuwalik!",
        intanPose: "/src/girlPoses/cewek_ramah_nobg.png",
        imgCustomClass: "scale-[1.6] origin-bottom -translate-x-2"
      }
    },
    
    gameData: {
      // Kita gunakan array 'questions' agar gamenya bisa melooping beberapa soal
      questions: [
        {
          id: 1,
          imageUrl: "/src/items/dingklik.png", 
          title: "Mancik Dingklik",
          words: [
            { latin: "man", javanese: "ꦩꦤ꧀" },
            { latin: "cik", javanese: "ꦕꦶꦏ꧀" },
            { latin: "ding", javanese: "ꦢꦶꦁ" },
            { latin: "klik", javanese: "ꦏ꧀ꦭꦶꦏ꧀" }
          ],
          distractors: [
            { latin: "me", javanese: "ꦩꦺ" },
            { latin: "tok", javanese: "ꦠꦺꦴꦏ꧀" },
            { latin: "ba", javanese: "ꦧ" }
          ]
        }
        // Tambahkan soal kedua, ketiga, dst di sini nanti
      ]
    }
  },
};