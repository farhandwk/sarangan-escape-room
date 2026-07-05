export type IntroStep = {
  id: number;
  textTop: string;
  textBottom: string;
  intanPose: string; // path gambar
  bottomComponent: "scroll" | "map";
  buttonText: string;
  imgCustomClass: string;
};

export const introSteps: IntroStep[] = [
  {
    id: 1,
    textTop: "Hai.. {nama}!!",
    textBottom: "Kenalna, aku Intan. Mau esuk, aku nemu gulungan rahasia kang isine misteri aksara jawa, jajal dibukak!",
    intanPose: "/src/girlPoses/cewek_lambai_nobg_edited.png", // Sesuaikan nama file nanti
    bottomComponent: "scroll",
    buttonText: "BUKAK",
    imgCustomClass: ""
  },
  {
    id: 2,
    textTop: "Wah ternyata pedhut misterius ngalangi awak dewe bukak gulungan iki!",
    textBottom: "Opo kowe wong kang ditakdirke gawe ngilangke pedhut iki?",
    intanPose: "/src/girlPoses/cewek_khawatir_nobg.png",
    bottomComponent: "scroll",
    buttonText: "IYA... KUWI AKU",
    imgCustomClass: ""
  },
  {
    id: 3,
    textTop: "Kanggo ngilangke pedhut mau, kowe kudu mecahna misteri ing setiap level neng magetan iki.",
    textBottom: "Coba tiliki panggone setiap level ing peta ngisor iki!",
    intanPose: "/src/girlPoses/cewek_heroic_nobg.png",
    bottomComponent: "map",
    buttonText: "GASS..",
    imgCustomClass: ""
  },
  {
    id: 4,
    textTop: "Ayo ndang mangkat nyelametke warisan leluhur aksara jawa.",
    textBottom: "Pencet tombol 'Mulai Petualangan' ing ngisor iki!",
    intanPose: "/src/girlPoses/cewek_nantang_nobg.png",
    bottomComponent: "map",
    buttonText: "MULAI PETUALANGAN",
    imgCustomClass: "left-[0%] max-w-none w-48"
  }
];