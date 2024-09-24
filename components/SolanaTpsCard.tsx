import { Card } from "./ui/card";
import { fetchSolanaPerformanceStats } from "@/lib/helpers";
import { SolanaTpsChart } from "./SolanaTpsChart";
import { PERFORMANCE_SAMPLE_LIMIT } from "@/lib/consts";

export const SolanaTpsCard = async () => {
  const solanaPerformanceSamples = await fetchSolanaPerformanceStats();
  let totalTransactions = 0;
  const tpsData = solanaPerformanceSamples.map((sample) => {
    // @ts-expect-error mistyped api from solana/web3.js
    const tps = sample.numNonVoteTransactions / sample.samplePeriodSecs;
    totalTransactions += tps;
    return { slot: sample.slot, tps };
  });
  const realTps = totalTransactions / PERFORMANCE_SAMPLE_LIMIT;

  return (
    <Card className="bg-[#1c1c1c] border-none rounded-xl col-span-3">

    <SolanaTpsChart tpsData={tpsData} realTps={realTps}/>

    </Card>
  );
};
