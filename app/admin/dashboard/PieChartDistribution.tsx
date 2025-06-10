"use client";

import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { TooltipChart, TooltipChartItem } from "@/features/chart/TooltipChart";

type DistributionData = {
  name: string;
  value: number;
  color: string;
  total: number;
};

const chartConfig = {
  users: {
    label: "utilisateurs",
    color: "hsl(var(--primary))",
  },
  gleanings: {
    label: "glanages",
    color: "hsl(var(--chart-2))",
  },
  fields: {
    label: "champs",
    color: "hsl(var(--chart-3))",
  },
  farms: {
    label: "fermes",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function PieChartDistribution({ data }: { data: DistributionData[] }) {
  // Couleurs plus douces et harmonieuses
  const softColors = [
    "hsl(171, 70%, 50%, 0.8)", // turquoise adouci
    "hsl(340, 65%, 60%, 0.8)", // rose adouci
    "hsl(45, 70%, 60%, 0.8)", // jaune adouci
    "hsl(205, 70%, 70%, 0.8)", // bleu adouci
    "hsl(283, 50%, 65%, 0.8)", // violet adouci
  ];

  // Remplacer les couleurs dans les données
  const enhancedData = data.map((item, index) => ({
    ...item,
    color: softColors[index % softColors.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>répartition par type de culture</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <Pie
              data={enhancedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={30}
              labelLine={false}
              paddingAngle={4}
            >
              {enhancedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percent = ((data.value / data.total) * 100).toFixed(1);

                  return (
                    <TooltipChart>
                      <TooltipChartItem label="type">
                        {data.name}
                      </TooltipChartItem>
                      <TooltipChartItem label="nombre">
                        {data.value}
                      </TooltipChartItem>
                      <TooltipChartItem label="pourcentage">
                        {percent}%
                      </TooltipChartItem>
                      <TooltipChartItem label="total">
                        {data.total}
                      </TooltipChartItem>
                    </TooltipChart>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
