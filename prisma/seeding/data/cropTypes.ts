import { CropCategory, CropSeason } from '@prisma/client';

export const cropTypes = [
  {
    name: 'Pommes de terre',
    category: CropCategory.VEGETABLE,
    season: CropSeason.FALL,
  },
  {
    name: 'Carottes',
    category: CropCategory.VEGETABLE,
    season: CropSeason.YEAR_ROUND,
  },
  {
    name: 'Pommes',
    category: CropCategory.FRUIT,
    season: CropSeason.FALL,
  },
  {
    name: 'Poires',
    category: CropCategory.FRUIT,
    season: CropSeason.FALL,
  },
  {
    name: 'Tomates',
    category: CropCategory.VEGETABLE,
    season: CropSeason.SUMMER,
  },
];