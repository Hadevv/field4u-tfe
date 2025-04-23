"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipChart, TooltipChartItem } from "@/features/chart/TooltipChart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type GrowthData = {
  date: string;
  gleaners: number;
  farmers: number;
};

export function GrowthChart({ data }: { data: GrowthData[] }) {
  const softGleanerColor = "hsl(171, 70%, 50%, 0.8)";
  const softFarmerColor = "hsl(340, 65%, 60%, 0.8)";

  return (
    <Card>
      <CardHeader>
        <CardTitle>évolution cumulative des inscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            title="évolution cumulative des inscriptions"
          >
            <defs>
              <linearGradient id="gleanersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={softGleanerColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={softGleanerColor}
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id="farmersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={softFarmerColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={softFarmerColor}
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="5 5"
              vertical={false}
              stroke="hsl(var(--muted-foreground) / 0.2)"
            />
            <Area
              type="monotone"
              dataKey="gleaners"
              name="glaneurs"
              stackId="1"
              stroke={softGleanerColor}
              fill="url(#gleanersGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="farmers"
              name="agriculteurs"
              stackId="1"
              stroke={softFarmerColor}
              fill="url(#farmersGradient)"
              strokeWidth={2}
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground) / 0.5)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", { month: "short" });
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground) / 0.5)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <Tooltip
              cursor={{
                stroke: "hsl(var(--background) / 0.5)",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const date = new Date(label);
                  const gleanerValue = Number(payload[0]?.value || 0);
                  const farmerValue = Number(payload[1]?.value || 0);
                  const total = gleanerValue + farmerValue;

                  return (
                    <TooltipChart>
                      <TooltipChartItem label="date">
                        {date.toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </TooltipChartItem>
                      <TooltipChartItem label="glaneurs">
                        {gleanerValue}
                      </TooltipChartItem>
                      <TooltipChartItem label="agriculteurs">
                        {farmerValue}
                      </TooltipChartItem>
                      <TooltipChartItem label="total">{total}</TooltipChartItem>
                    </TooltipChart>
                  );
                }
                return null;
              }}
            />
            <Legend
              align="center"
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                paddingTop: "15px",
                fontSize: "12px",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
