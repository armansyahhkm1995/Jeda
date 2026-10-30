export const PHASE_CONFIG_DEFAULTS = {
  phaseA: {
    label: 'Persiapan',
    defaultDurationSeconds: 15, // Cukup untuk bersiap tanpa membuat menunggu terlalu lama
    copy: 'Duduk dengan nyaman. Rasakan telapak kakimu menapak ke lantai dan rilekskan bahumu.',
  },
  phaseC: {
    label: 'Pelepasan & Sadar',
    defaultDurationSeconds: 15,
    copy: 'Biarkan napasmu kembali alami. Amati perbedaan rasa di tubuhmu sekarang.',
  },
} as const;

export const GROUNDING_54321_STEPS = [
  {
    count: 5,
    sense: 'Lihat',
    instruction: 'Temukan 5 benda di sekitarmu yang bisa kamu lihat dengan jelas.',
    durationSeconds: 12,
  },
  {
    count: 4,
    sense: 'Sentuh',
    instruction: 'Rasakan 4 tekstur berbeda yang bisa kamu sentuh (misal baju, meja, jari).',
    durationSeconds: 12,
  },
  {
    count: 3,
    sense: 'Dengar',
    instruction: 'Dengarkan 3 suara di sekitarmu (kipas, kendaraan, napasmu).',
    durationSeconds: 10,
  },
  {
    count: 2,
    sense: 'Cium',
    instruction: 'Amati 2 aroma di udara atau di sekitarmu.',
    durationSeconds: 8,
  },
  {
    count: 1,
    sense: 'Kecap / Rasakan',
    instruction: 'Rasakan 1 sensasi rasa di lidahmu atau detak jantungmu saat ini.',
    durationSeconds: 8,
  },
] as const;

export const HALT_ITEMS = [
  { key: 'H', label: 'Hungry (Lapar)', question: 'Kapan terakhir kali kamu makan atau minum air?', action: 'Makan camilan atau minum segelas air hangat.' },
  { key: 'A', label: 'Angry (Marah)', question: 'Apakah ada hal spesifik yang mengganggumu atau ini reaksi berantai?', action: 'Akui amarahmu tanpa harus melampiaskannya saat ini.' },
  { key: 'L', label: 'Lonely (Kesepian)', question: 'Apakah kamu merasa berjuang sendirian tanpa dukungan?', action: 'Hubungi seseorang atau sadari bahwa kamu tidak sendirian.' },
  { key: 'T', label: 'Tired (Lelah)', question: 'Berapa jam kamu tidur semalam? Apakah tubuhmu kehabisan tenaga?', action: 'Tutup mata selama 10 menit, rebahkan kepala.' },
] as const;

export const EMOTION_LABELS = [
  'Cemas', 'Kewalahan', 'Marah', 'Takut', 'Kecewa',
  'Bingung', 'Sedih', 'Bersalah', 'Lelah Batin', 'Tidak Dihargai'
] as const;
