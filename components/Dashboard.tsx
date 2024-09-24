import { StakingActivityChart } from "./StakingActivityChart";
import { TxnSearchInput } from "./TxnSearchInput";
import { SolanaPriceCard } from "./SolanaPriceCard";
import { SolanaTpsCard } from "./SolanaTpsCard";


export function Dashboard() {
  return (
    <div className="space-y-4 w-full bg-[#0a0a0a] text-white">
      <h2 className="flex justify-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        SolSearcher
      </h2>
      <TxnSearchInput />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SolanaPriceCard />
        <SolanaTpsCard />
      </div>
      <StakingActivityChart />

    </div>
  );
}
