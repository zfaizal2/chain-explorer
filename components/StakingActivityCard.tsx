// "use client"

import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StakingActivityChart } from "./StakingActivityChart"
import { fetchStakingStats } from "@/lib/helpers"




export const StakingActivityCard = async () => {
  const stakingStats = await fetchStakingStats();
  // console.log('stakingstats', stakingStats.stakingChartData)
  return (
    <Card className="bg-[#1c1c1c] border-none rounded-xl">
      <CardHeader>
        <CardTitle className="text-white">Staking Activity</CardTitle>
        <CardDescription className="text-gray-400">
          Showing total stake activity for the last 20 epochs
        </CardDescription>
      </CardHeader>
      <CardContent>
      <StakingActivityChart stakingStats={stakingStats.stakingChartData}/>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-white">
              Active stake trending {stakingStats.stakingPercentChange > 0 ? 'up' : 'down'} by {stakingStats.stakingPercentChange.toString().slice(0,4)}% this period <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}