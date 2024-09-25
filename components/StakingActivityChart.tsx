"use client";
import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MappedStakingStats } from "@/lib/helpers";

const chartConfig = {
  activatingStake: {
    label: "Active Stake",
    color: "hsl(var(--chart-1))",
  },
  deactivatingStake: {
    label: "Deactivating Stake",
    color: "hsl(var(--chart-2))",
  },
  totalStake: {
    label: "Circulating Supply",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface StakingActivityChartParams  {
    stakingStats: MappedStakingStats[]
}

export const StakingActivityChart = ({stakingStats}: StakingActivityChartParams) => {

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        data={stakingStats}
        margin={{
          left: 0,
          right: 0,
          top: 16,
          bottom: 0,
        }}
        height={300}
      >
        <CartesianGrid vertical={false} stroke="#2c2c2c" />
        <XAxis
          dataKey="epoch"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#6b7280" }}
          tickMargin={8}

        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="bg-[#1c1c1c] text-white"
              indicator="line"
            />
          }
        />

          <Area
            type="monotone"
            dataKey="activatingStake"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
          />
        <Area
          type="monotone"
          dataKey="deactivatingStake"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2))"
        />
      </AreaChart>
    </ChartContainer>
  );
};
