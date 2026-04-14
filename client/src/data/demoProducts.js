const categories = [
  "Ауырсынуға қарсы",
  "Температура",
  "Витаминдер",
  "Антибиотиктер",
  "Жүрек",
  "Қан қысымы",
  "Асқазан",
  "Аллергия",
  "Жөтел",
  "Тамақ ауруы",
  "Диабет",
  "Тері күтімі",
];

const productNames = [
  "Парацетамол",
  "Ибупрофен",
  "Нурофен",
  "Аспирин",
  "Омепразол",
  "Супрастин",
  "Цитрамон",
  "Амоксициллин",
  "Азитромицин",
  "Колдрекс",
  "Терафлю",
  "Витамин C",
  "Витамин D3",
  "Магний B6",
  "Омега-3",
  "Пантенол",
  "Смекта",
  "Лоперамид",
  "Лоратадин",
  "Эналаприл",
];

const imagePool = [
  "https://images.unsplash.com/photo-1585435557343-3b092031a831",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2",
  "https://images.unsplash.com/photo-1626716493137-b67fe9501e76",
];

const pharmacies = [
  { name: "PharmApp Сарыарқа", address: "Сарыарқа 15" },
  { name: "PharmApp Нұра", address: "Тұран 42" },
  { name: "PharmApp Есіл", address: "Қабанбай батыр 58" },
  { name: "PharmApp Алматы", address: "Достық 15А" },
];

export const demoProducts = Array.from({ length: 500 }, (_, i) => {
  const index = i + 1;
  const baseName = productNames[i % productNames.length];
  const category = categories[i % categories.length];
  const imageUrl = imagePool[i % imagePool.length];
  const pharmacy = pharmacies[i % pharmacies.length];

  const price = 700 + ((index * 137) % 18000);
  const hasDiscount = index % 3 !== 0;
  const discountPrice = hasDiscount ? Math.max(500, Math.round(price * (0.72 + (index % 10) * 0.02))) : null;

  return {
    id: `demo-${index}`,
    name: `${baseName} ${100 + (index % 900)} мг`,
    category,
    imageUrl,
    pharmacy,
    price,
    discountPrice,
  };
});

