"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const barConfig = {
  diff: {
    label: "Usage (m³)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const areaConfig = {
  values: {
    label: "Usage (m³)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Report {
  id: number;
  technicianId: number;
  customerId: number;
  location: string;
  values: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WaterUsageChartProps {
  reports: Report[];
}

export default function WaterUsageChart({ reports }: WaterUsageChartProps) {
  const sorted = [...reports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const chartData = sorted.map((report, i) => {
    const current = Number(report.values);
    const previous = i > 0 ? Number(sorted[i - 1].values) : 0;
    const month = new Date(report.createdAt).toLocaleString("id-ID", {
      month: "short",
    });
    return {
      month,
      // Selisih Bulanan: monthly difference between consecutive readings
      diff: current - previous,
      // Penggunaan Progresif: the actual recorded meter value each month
      values: current,
    };
  });

  return (
    <Tabs
      defaultValue="bar"
      className="bg-card w-full flex-col gap-6 p-2 lg:flex-2"
    >
      <TabsContent value="area">
        <Card>
          <CardHeader>
            <CardTitle>Water usage trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-64" config={areaConfig}>
              <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={48}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="values"
                  type="natural"
                  fill="var(--color-values)"
                  fillOpacity={0.4}
                  stroke="var(--color-values)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="bar">
        <Card>
          <CardHeader>
            <CardTitle>Water usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-64" config={barConfig}>
              <BarChart data={chartData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={48}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="diff" fill="var(--color-diff)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsList className="w-full rounded-lg p-2">
        <TabsTrigger value="area">Penggunaan Progresif</TabsTrigger>
        <TabsTrigger value="bar">Selisih Bulanan</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
