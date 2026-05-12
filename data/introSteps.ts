export type IntroStep = {
  id: number;
  textTop: string;
  textBottom: string;
  intanPose: string; // path gambar
  bottomComponent: "scroll" | "map";
  buttonText: string;
  itemsContainerClass: string;
  imageScale: string;
};

export const introSteps: IntroStep[] = [
  {
    id: 1,
    textTop: "Hi.. {nama}!! Kenalkan, aku Intan. Kalian tahu tidak? Di balik kabut tebal yang menyelimuti puncak Gunung Lawu dan indahnya air Telaga Sarangan, tersimpan sebuah rahasia kuno yang sudah terkunci selama ratusan tahun.",
    textBottom: "Tadi pagi, aku menemukan gulungan tua ini di sebuah goa tersembunyi. Isinya bukan peta biasa, melainkan petunjuk menuju harta karun ilmu yang kini mulai terlupakan: Aksara Jawa. Cobalah untuk membuka gulungan tersebut!!",
    intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png", // Sesuaikan nama file nanti
    bottomComponent: "scroll",
    buttonText: "BUKA",
    itemsContainerClass: "items-end",
    imageScale: "scale-125"
  },
  {
    id: 2,
    textTop: "Tapi ada masalah besar! Kekuatan kabut misterius telah mengacak-acak urutan Aksara suci ini. Jika kita tidak berhasil menyusunnya kembali, sejarah dan legenda kebanggaan warga Magetan akan hilang selamanya dari ingatan kita.",
    textBottom: "Gerbang dimensi menuju masa lalu hanya bisa dibuka oleh orang-orang terpilih yang memiliki ketelitian dan keberanian tinggi. Apakah itu kalian?",
    intanPose: "/src/girlPoses/cewek_khawatir_nobg.png",
    bottomComponent: "scroll",
    buttonText: "YAA... ITU SAYA",
    itemsContainerClass: "items-start",
    imageScale: "scale-175"
  },
  {
    id: 3,
    textTop: "Kita akan memulai perjalanan dari riaknya air Telaga Sarangan, mendaki dinginnya Cemoro Sewu, menembus rimbunnya hutan Mojosemi, hingga memecahkan teka-teki di Telaga Blego.",
    textBottom: "Di setiap tempat, kalian harus menyelesaikan tantangan Escape Room yang rumit. Ingat, setiap Aksara yang kalian temukan adalah kunci! Kumpulkan kodenya, dan kita akan bertemu di puncak Gunung Lawu untuk membuka gerbang terakhir.",
    intanPose: "/src/girlPoses/cewek_heroic_nobg.png",
    bottomComponent: "map",
    buttonText: "GASS..",
    itemsContainerClass: "items-end",
    imageScale: "scale-175"
  },
  {
    id: 4,
    textTop: "Waktu kita tidak banyak. Kabutnya mulai menebal! Siapkan konsentrasi kalian, asah ketajaman mata, dan mari kita tunjukkan bahwa Aksara Jawa tidak akan pernah padam. Level pertama menantimu di Sarangan.",
    textBottom: "Jangan sampai salah langkah, atau kalian akan terjebak di dalam labirin waktu selamanya! Ayo, petualangan dimulai sekarang!",
    intanPose: "/src/girlPoses/cewek_nantang_nobg.png",
    bottomComponent: "map",
    buttonText: "MULAI PETUALANGAN",
    itemsContainerClass: "items-start",
    imageScale: "scale-140"
  }
];