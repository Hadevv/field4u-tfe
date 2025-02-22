import { Context } from "../types";
import { CropCategory, CropSeason } from "@prisma/client";

export async function fakerCropTypes(ctx: Context) {
  console.log("🌱 Seeding crop types...");

  const cropTypes = [
    {
      name: "Pommes de terre",
      category: CropCategory.VEGETABLE,
      season: CropSeason.FALL,
    },
    {
      name: "Carottes",
      category: CropCategory.VEGETABLE,
      season: CropSeason.YEAR_ROUND,
    },
    {
      name: "Pommes",
      category: CropCategory.FRUIT,
      season: CropSeason.FALL,
    },
    {
      name: "Poires",
      category: CropCategory.FRUIT,
      season: CropSeason.FALL,
    },
    {
      name: "Tomates",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Courgettes",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Haricots verts",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Fraises",
      category: CropCategory.FRUIT,
      season: CropSeason.SUMMER,
    },
    {
      name: "Oignons",
      category: CropCategory.VEGETABLE,
      season: CropSeason.YEAR_ROUND,
    },
    {
      name: "Poireaux",
      category: CropCategory.VEGETABLE,
      season: CropSeason.WINTER,
    },
    {
      name: "Choux-fleurs",
      category: CropCategory.VEGETABLE,
      season: CropSeason.WINTER,
    },
    {
      name: "Brocolis",
      category: CropCategory.VEGETABLE,
      season: CropSeason.WINTER,
    },
    {
      name: "Cerises",
      category: CropCategory.FRUIT,
      season: CropSeason.SUMMER,
    },
    {
      name: "Framboises",
      category: CropCategory.FRUIT,
      season: CropSeason.SUMMER,
    },
    {
      name: "Mûres",
      category: CropCategory.FRUIT,
      season: CropSeason.SUMMER,
    },
    {
      name: "Salades",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SPRING,
    },
    {
      name: "Épinards",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SPRING,
    },
    {
      name: "Asperges",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SPRING,
    },
    {
      name: "Betteraves",
      category: CropCategory.VEGETABLE,
      season: CropSeason.YEAR_ROUND,
    },
    {
      name: "Navets",
      category: CropCategory.VEGETABLE,
      season: CropSeason.YEAR_ROUND,
    },
    {
      name: "Aubergines",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Concombres",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Piments",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Courges",
      category: CropCategory.VEGETABLE,
      season: CropSeason.FALL,
    },
    {
      name: "Raisins",
      category: CropCategory.FRUIT,
      season: CropSeason.FALL,
    },
    {
      name: "Maïs",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Citrouilles",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SPRING,
    },
    {
      name: "Poivrons",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SPRING,
    },
  ];

  const createdCropTypes = await Promise.all(
    cropTypes.map((cropType) => ctx.prisma.cropType.create({ data: cropType })),
  );

  ctx.created.cropTypes = createdCropTypes;
  return createdCropTypes;
}
