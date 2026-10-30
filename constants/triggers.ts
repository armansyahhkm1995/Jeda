export interface TriggerOption {
  id: string;
  category: string;
  categoryLabel: string;
  categorySubtitle: string;
  label: string;
  description: string;
}

export const TRIGGER_CATEGORIES = [
  {
    key: 'fisiologis',
    title: 'A. Pemicu Fisiologis & Kebutuhan Dasar (HALT)',
    subtitle: 'Kapasitas sistem saraf menipis karena tubuh kekurangan energi dasar.',
  },
  {
    key: 'sensorik',
    title: 'B. Pemicu Sensorik & Kognitif (Overload)',
    subtitle: 'Sistem saraf menerima terlalu banyak masukan data sekaligus hingga kelelahan.',
  },
  {
    key: 'psikologis',
    title: 'C. Pemicu Psikologis & Luka Masa Lalu (Inner Child)',
    subtitle: 'Situasi saat ini menyentuh tombol luka lama di alam bawah sadar.',
  },
  {
    key: 'kontrol',
    title: 'D. Pemicu Ilusi Kontrol & Ekspektasi',
    subtitle: 'Keinginan kuat agar realitas berjalan persis seperti isi kepala kita.',
  },
  {
    key: 'entanglement',
    title: 'E. Pemicu Kusut Emosional (Entanglement)',
    subtitle: 'Marah digunakan sebagai mekanisme pertahanan untuk menutupi emosi yang lebih rentan.',
  },
];

export const TRIGGER_LIST: TriggerOption[] = [
  // A. Pemicu Fisiologis & Kebutuhan Dasar (The HALT Triggers)
  {
    id: 'lapar_dehidrasi',
    category: 'fisiologis',
    categoryLabel: 'A. Pemicu Fisiologis & Kebutuhan Dasar',
    categorySubtitle: 'Kekurangan energi dasar memicu survival mode tubuh.',
    label: 'Lapar & Dehidrasi',
    description: 'Gula darah rendah memicu pelepasan adrenalin & kortisol, membuat otak berada dalam survival mode.',
  },
  {
    id: 'kelelahan_kurang_tidur',
    category: 'fisiologis',
    categoryLabel: 'A. Pemicu Fisiologis & Kebutuhan Dasar',
    categorySubtitle: 'Kekurangan energi dasar memicu survival mode tubuh.',
    label: 'Kelelahan Fisik & Kurang Tidur',
    description: 'Tanpa tidur cukup, otak prefrontal melemah dan amigdala menjadi hiper-reaktif pada hal sepele.',
  },
  {
    id: 'sakit_tidak_nyaman',
    category: 'fisiologis',
    categoryLabel: 'A. Pemicu Fisiologis & Kebutuhan Dasar',
    categorySubtitle: 'Kekurangan energi dasar memicu survival mode tubuh.',
    label: 'Sakit atau Rasa Tidak Nyaman di Tubuh',
    description: 'Nyeri kronis, pegal linu, atau hormon tidak seimbang menyita bandwidth mental dan menipiskan kesabaran.',
  },

  // B. Pemicu Sensorik & Kognitif (Overload)
  {
    id: 'sensory_overload',
    category: 'sensorik',
    categoryLabel: 'B. Pemicu Sensorik & Kognitif',
    categorySubtitle: 'Terlalu banyak masukan data hingga otak kelebihan beban.',
    label: 'Sensory Overload (Banjir Sensorik)',
    description: 'Suara bising anak menangis/TV, sentuhan fisik berlebih (touched out), atau rumah berantakan.',
  },
  {
    id: 'decision_fatigue',
    category: 'sensorik',
    categoryLabel: 'B. Pemicu Sensorik & Kognitif',
    categorySubtitle: 'Terlalu banyak masukan data hingga otak kelebihan beban.',
    label: 'Decision Fatigue (Kelelahan Keputusan)',
    description: 'Terlalu banyak membuat keputusan sejak pagi membuat otak merespons pertanyaan kecil dengan bentakan.',
  },
  {
    id: 'badai_pikiran',
    category: 'sensorik',
    categoryLabel: 'B. Pemicu Sensorik & Kognitif',
    categorySubtitle: 'Terlalu banyak masukan data hingga otak kelebihan beban.',
    label: 'Badai Pikiran (Overthinking)',
    description: 'Terus membayangkan skenario terburuk di masa depan (finansial, kerjaan) memicu reaksi bahaya seketika.',
  },

  // C. Pemicu Psikologis & Luka Masa Lalu (Inner Child / Trauma)
  {
    id: 'tidak_dihargai',
    category: 'psikologis',
    categoryLabel: 'C. Pemicu Psikologis & Luka Masa Lalu',
    categorySubtitle: 'Situasi menyentuh memori atau luka emosional masa lalu.',
    label: 'Merasa Tidak Dihargai atau Diabaikan',
    description: 'Pasangan asyik dengan ponsel atau anak tidak mendengar memicu luka "aku tidak penting/berharga".',
  },
  {
    id: 'insecurity',
    category: 'psikologis',
    categoryLabel: 'C. Pemicu Psikologis & Luka Masa Lalu',
    categorySubtitle: 'Situasi menyentuh memori atau luka emosional masa lalu.',
    label: 'Merasa Tidak Aman (Insecurity)',
    description: 'Kritik dari orang lain (meski bermaksud baik) dipersepsikan sistem saraf sebagai serangan harga diri.',
  },
  {
    id: 'proyeksi_luka_kecil',
    category: 'psikologis',
    categoryLabel: 'C. Pemicu Psikologis & Luka Masa Lalu',
    categorySubtitle: 'Situasi menyentuh memori atau luka emosional masa lalu.',
    label: 'Proyeksi Luka Masa Kecil',
    description: 'Membentak anak karena mereka menampilkan perilaku yang di masa kecil kita dulu dilarang/dihukum keras.',
  },

  // D. Pemicu Ilusi Kontrol & Ekspektasi
  {
    id: 'kehilangan_kendali',
    category: 'kontrol',
    categoryLabel: 'D. Pemicu Ilusi Kontrol & Ekspektasi',
    categorySubtitle: 'Keinginan agar realitas berjalan persis seperti isi kepala.',
    label: 'Kehilangan Kendali',
    description: 'Makanan tumpah atau hal mendadak saat buru-buru; marah muncul karena kehilangan kontrol jadwal.',
  },
  {
    id: 'ekspektasi_tidak_realistis',
    category: 'kontrol',
    categoryLabel: 'D. Pemicu Ilusi Kontrol & Ekspektasi',
    categorySubtitle: 'Keinginan agar realitas berjalan persis seperti isi kepala.',
    label: 'Ekspektasi yang Tidak Realistis',
    description: 'Berharap orang lain bisa membaca pikiran kita tanpa dikomunikasikan atau anak balita diam 2 jam.',
  },

  // E. Pemicu "Kusut Emosional" (Entanglement)
  {
    id: 'menutupi_takut',
    category: 'entanglement',
    categoryLabel: 'E. Pemicu Kusut Emosional (Entanglement)',
    categorySubtitle: 'Marah sebagai tameng untuk menutupi emosi rapuh.',
    label: 'Menutupi Rasa Takut / Khawatir',
    description: 'Membentak anak saat ia lari ke jalan; emosi aslinya adalah ketakutan luar biasa kehilangan anak.',
  },
  {
    id: 'menutupi_sedih',
    category: 'entanglement',
    categoryLabel: 'E. Pemicu Kusut Emosional (Entanglement)',
    categorySubtitle: 'Marah sebagai tameng untuk menutupi emosi rapuh.',
    label: 'Menutupi Kesedihan atau Kecewa',
    description: 'Merasa gagal dalam peran orang tua/pekerjaan diekspresikan jadi amarah agar terasa lebih bertenaga.',
  },
  {
    id: 'menutupi_bersalah',
    category: 'entanglement',
    categoryLabel: 'E. Pemicu Kusut Emosional (Entanglement)',
    categorySubtitle: 'Marah sebagai tameng untuk menutupi emosi rapuh.',
    label: 'Menutupi Rasa Bersalah',
    description: 'Saat melakukan kesalahan, bersikap defensif dan marah memutarbalikkan fakta agar terhindar dari rasa malu.',
  },
];

export const TRIGGER_MAP: Record<string, TriggerOption> = TRIGGER_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, TriggerOption>
);

export function getTriggerInfo(idOrLabel?: string | null): TriggerOption | null {
  if (!idOrLabel) return null;
  if (TRIGGER_MAP[idOrLabel]) return TRIGGER_MAP[idOrLabel];
  // Cari berdasarkan label atau partial match
  const found = TRIGGER_LIST.find(
    (t) => t.label.toLowerCase() === idOrLabel.toLowerCase() || t.id === idOrLabel
  );
  return found || null;
}
