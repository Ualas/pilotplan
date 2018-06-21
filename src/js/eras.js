
const eras = [
  {
    attachments: '',
    center: [-22.93989944, -43.16970062],
    dates: [1502, 1808],
    description: '',
    increment: 1,
    name: 'Colonial Rule',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90320015, -43.17459869],
    dates: [1808, 1821],
    description: '',
    increment: 1,
    name: 'Royal Rule',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90320015, -43.17459869],
    dates: [1822, 1831],
    description: '',
    increment: 1,
    name: 'Imperial Rule I',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90660095, -43.18849945],
    dates: [1831, 1839],
    description: '',
    increment: 1,
    name: 'Regency',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90660095, -43.18849945],
    dates: [1840, 1889],
    description: '',
    increment: 1,
    name: 'Imperial Rule II',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90979958, -43.17620087],
    dates: [1889, 1930],
    description: '',
    increment: 1,
    name: 'First Republic',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90920067, -43.17380142],
    dates: [1930, 1945],
    description: '',
    increment: 1,
    name: 'Vargas Era',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.90920067, -43.17380142],
    dates: [1946, 1964],
    description: '',
    increment: 1,
    name: 'Democratic Interlude',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-22.97900009, -43.19540024],
    dates: [1964, 1985],
    description: '',
    increment: 1,
    name: 'Military Dictatorship',
    notes: '',
    zoom: 14,
  },
  {
    attachments: '',
    center: [-23.00009918, -43.36579895],
    dates: [1985, new Date().getFullYear()],
    description: '',
    increment: 1,
    name: 'New Republic',
    notes: '',
    zoom: 14,
  },
];

// _.reduce(eras, (m, e) => m + Math.round((e.dates[1] - e.dates[0]) / e.increment), 0);

export default eras;
