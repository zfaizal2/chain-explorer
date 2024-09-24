"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  tps: {
    label: "TPS",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface SolanaTpsChartParams {
  tpsData: TpsData[];
  realTps: number;
}

interface TpsData {
  slot: number;
  tps: number;
}

export function SolanaTpsChart({ tpsData, realTps }: SolanaTpsChartParams) {
  return (
    <Card className="bg-[#1c1c1c] border-none rounded-xl">
      <CardHeader className="flex flex-col items-stretch space-y-0  p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5  text-white sm:py-6">
          <CardTitle>Real TPS</CardTitle>
        </div>
        <div className="flex justify-center px-6 py-5">
          <div className="text-lg text-white font-bold leading-none mr-2 sm:text-3xl">
            {parseInt(realTps.toString())}
          </div>
          <div className="text-gray-400 mt-auto">tx/s</div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={tpsData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="slot"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-[#1c1c1c] text-white"
                  nameKey="tps"
                  labelFormatter={(value) => {
                    return value;
                  }}
                />
              }
            />
            <Bar dataKey={"tps"} fill="#4ade80" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
