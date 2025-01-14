import { CropCategory, CropSeason } from '@prisma/client';

export const cropTypes = [
  {
    name: 'Pommes de terre',
    type: CropCategory.VEGETABLE,
    season: CropSeason.FALL,
  },
  {
    name: 'Carottes',
    type: CropCategory.VEGETABLE,
    season: CropSeason.YEAR_ROUND,
  },
  {
    name: 'Pommes',
    type: CropCategory.FRUIT,
    season: CropSeason.FALL,
  },
  {
    name: 'Poires',
    type: CropCategory.FRUIT,
    season: CropSeason.FALL,
  },
  {
    name: 'Tomates',
    type: CropCategory.VEGETABLE,
    season: CropSeason.SUMMER,
  },
];