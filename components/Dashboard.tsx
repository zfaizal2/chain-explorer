"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "recharts";
import dynamic from "next/dynamic";
import { StakingActivityChart } from "./StakingActivityChart";
import { TxnSearchInput } from "./TxnSearchInput";
import { SolanaPriceCard } from "./SolanaPriceCard";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);

const mockTpsData = [
  { name: "1", tps: 500 },
  { name: "2", tps: 520 },
  { name: "3", tps: 510 },
  { name: "4", tps: 530 },
  { name: "5", tps: 550 },
  { name: "6", tps: 540 },
  { name: "7", tps: 560 },
  { name: "8", tps: 570 },
  { name: "9", tps: 555 },
  { name: "10", tps: 560 },
  { name: "11", tps: 565 },
  { name: "12", tps: 557 },
];

export function Dashboard() {


  return (
    <div className="space-y-4 bg-[#0a0a0a] text-white">
      <h2 className="flex justify-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        SolSearcher
      </h2>
      {/* <div className="w-full rounded-lg">
        <Input
          type="text"
          placeholder="Search by transaction hash"
          className="h-8"
          onChange={(e) => setTxn(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div> */}
      <TxnSearchInput/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SolanaPriceCard/>
        <Card className="bg-[#1c1c1c] border-none rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Epoch 672</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <div className="h-2 bg-purple-600 rounded-full w-1/3"></div>
            <div className="text-sm text-gray-400 mt-2">in a day</div>
            <div className="text-right text-sm text-gray-400">35.44%</div>
          </CardContent> */}
        </Card>

        <Card className="bg-[#1c1c1c] border-none rounded-xl">
          <CardHeader>
            <CardTitle className="flex justify-between text-white">
              True TPS
              <span className="text-xs bg-[#2c2c2c] px-2 py-1 rounded-full">
                Live
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={100} data={mockTpsData} margin={{}}>
              <CartesianGrid vertical={false} stroke="#2c2c2c" />
              <Bar dataKey="tps" fill="#4ade80" />
            </BarChart>
            <div className="text-2xl font-bold mt-2 text-white">557 tx/s</div>
          </CardContent>
        </Card>
      </div>
      <StakingActivityChart />

      {/* <Card className="bg-[#1c1c1c] border-none rounded-xl">
        <CardHeader>
          <CardTitle className="flex justify-between text-white">
            Latest Blocks
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Live</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockBlocks.map((block) => (
              <div key={block.number} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-white">{block.number}</div>
                  <div className="text-sm text-gray-400">{block.sol} SOL</div>
                </div>
                <div className="text-sm text-right">
                  <div className="text-white">{block.creator}</div>
                  <div className="text-gray-400">a few seconds ago</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-[#2c2c2c] text-white py-2 rounded-lg">
            View all blocks →
          </button>
        </CardContent>
      </Card> */}
    </div>
  );
}
