"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "2023-07-01", activeStake: 400, deactivatingStake: 240, totalCirculatingSupply: 700 },
  { date: "2023-07-02", activeStake: 300, deactivatingStake: 139, totalCirculatingSupply: 750 },
  { date: "2023-07-03", activeStake: 200, deactivatingStake: 580, totalCirculatingSupply: 720 },
  { date: "2023-07-04", activeStake: 278, deactivatingStake: 390, totalCirculatingSupply: 710 },
  { date: "2023-07-05", activeStake: 189, deactivatingStake: 480, totalCirculatingSupply: 730 },
  { date: "2023-07-06", activeStake: 239, deactivatingStake: 380, totalCirculatingSupply: 740 },
  { date: "2023-07-07", activeStake: 350, deactivatingStake: 420, totalCirculatingSupply: 760 },
]

const chartConfig = {
  activeStake: {
    label: "Active Stake",
    color: "hsl(var(--chart-1))",
  },
  deactivatingStake: {
    label: "Deactivating Stake",
    color: "hsl(var(--chart-2))",
  },
  totalCirculatingSupply: {
    label: "Circulating Supply",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function StakingActivityChart() {
  return (
    <Card className="bg-[#1c1c1c] border-none rounded-xl">
      <CardHeader>
        <CardTitle className="text-white">Staking Activity</CardTitle>
        <CardDescription className="text-gray-400">
          Showing total stake activity for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  day: 'numeric',
                  month: 'numeric'
                })
              }}    
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="bg-[#1c1c1c] text-white" indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="totalCirculatingSupply"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
            />
            <Area
              type="monotone"
              dataKey="deactivatingStake"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
            />
            <Area
              type="monotone"
              dataKey="activeStake"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-white">
              Active stake trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-gray-400">
              {chartData[0].date} - {chartData[chartData.length - 1].date}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}