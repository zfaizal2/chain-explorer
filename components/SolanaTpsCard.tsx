import { Card } from "./ui/card";
import { fetchSolanaPerformanceStats } from "@/lib/helpers";
import { SolanaTpsChart } from "./SolanaTpsChart";

export const SolanaTpsCard = async () => {
  const solanaPerformanceSamples = await fetchSolanaPerformanceStats();
  let totalTransactions = 0;
  const tpsData = solanaPerformanceSamples.map((sample) => {
    // @ts-expect-error mistyped api from solana/web3.js
    const tps = sample.numNonVoteTransactions / sample.samplePeriodSecs;
    totalTransactions += tps;
    return { slot: sample.slot, tps };
  });
  const realTps = totalTransactions / 60;

  return (
    <Card className="bg-[#1c1c1c] border-none rounded-xl col-span-2">

    <SolanaTpsChart tpsData={tpsData} realTps={realTps}/>

    </Card>
  );
};
