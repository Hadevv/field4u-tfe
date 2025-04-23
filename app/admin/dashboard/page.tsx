import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { prisma } from "@/lib/prisma";
import { GrowthChart } from "./GrowthChart";
import StatisticsCards from "./StatisticsCards";
import { PieChartDistribution } from "./PieChartDistribution";
import { subMonths, format } from "date-fns";

async function generateUserGrowthData() {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  const usersByMonth = await prisma.$queryRaw<
    { month: string; role: string; count: bigint }[]
  >`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM-DD') as month,
      role,
      COUNT(*) as count
    FROM users
    WHERE created_at >= ${sixMonthsAgo}
    GROUP BY month, role
    ORDER BY month ASC
  `;

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, 5 - i);
    return format(date, "yyyy-MM-01");
  });

  let cumulativeGleaners = 0;
  let cumulativeFarmers = 0;

  return months.map((month) => {
    const newGleaners = Number(
      usersByMonth.find((u) => u.month === month && u.role === "GLEANER")
        ?.count || 0,
    );
    const newFarmers = Number(
      usersByMonth.find((u) => u.month === month && u.role === "FARMER")
        ?.count || 0,
    );

    cumulativeGleaners += newGleaners;
    cumulativeFarmers += newFarmers;

    return {
      date: month,
      gleaners: cumulativeGleaners,
      farmers: cumulativeFarmers,
    };
  });
}

async function getCropTypeDistribution() {
  const cropTypes = await prisma.$queryRaw<
    { crop_name: string; count: bigint }[]
  >`
    SELECT 
      ct.name as crop_name,
      COUNT(a.id) as count
    FROM announcements a
    JOIN crop_types ct ON a.crop_type_id = ct.id
    WHERE a.is_published = TRUE
    GROUP BY ct.name
    ORDER BY count DESC
    LIMIT 5
  `;

  const total = cropTypes.reduce((sum, crop) => sum + Number(crop.count), 0);

  const colors = [
    "hsl(171, 80%, 40%)", // vert turquoise
    "hsl(340, 82%, 52%)", // rose framboise
    "hsl(45, 93%, 47%)", // jaune moutarde
    "hsl(205, 90%, 61%)", // bleu ciel
    "hsl(283, 68%, 58%)", // violet
  ];

  return cropTypes.map((crop, index) => ({
    name: crop.crop_name,
    value: Number(crop.count),
    color: colors[index],
    total,
  }));
}

export default async function RoutePage(
  props: PageParams<Record<string, never>>,
) {
  const totalUsers = await prisma.user.count();
  const totalFields = await prisma.field.count();
  const totalGleanings = await prisma.gleaning.count();
  const totalAnnouncements = await prisma.announcement.count();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const activeGleanersResult = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(DISTINCT user_id) as count
    FROM participations
    WHERE created_at >= ${oneWeekAgo}
  `;

  const activeWeeklyGleaners = Number(activeGleanersResult[0]?.count || 0);

  const totalDonations = Math.floor(totalGleanings * 15.7);

  const growthData = await generateUserGrowthData();
  const distributionData = await getCropTypeDistribution();

  return (
    <Layout size="full">
      <LayoutHeader>
        <LayoutTitle>dashboard</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <StatisticsCards
          totalUsers={totalUsers}
          totalFields={totalFields}
          totalGleanings={totalGleanings}
          totalAnnouncements={totalAnnouncements}
          activeWeeklyGleaners={activeWeeklyGleaners}
          totalDonations={totalDonations}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GrowthChart data={growthData} />
          <PieChartDistribution data={distributionData} />
        </div>
      </LayoutContent>
    </Layout>
  );
}
