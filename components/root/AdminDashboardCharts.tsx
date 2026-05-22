"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  reports: {
    label: "Laporan",
    color: "var(--chart-1)",
  },
  complaints: {
    label: "Keluhan",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface MonthlyData {
  month: string;
  reports: number;
  complaints: number;
}

export default function AdminDashboardCharts({
  data,
}: {
  data: MonthlyData[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan & Keluhan per Bulan</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-72" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="reports"
                fill="var(--color-reports)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="complaints"
                fill="var(--color-complaints)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
