import { StakingActivityCard } from "./StakingActivityCard";
import { TxnSearchInput } from "./TxnSearchInput";
import { SolanaPriceCard } from "./SolanaPriceCard";
import { SolanaTpsCard } from "./SolanaTpsCard";
import { Package2 } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-4 w-full bg-[#0a0a0a] text-white">
      <div className="flex justify-center">
        <Package2 className="h-8 w-8" />
        <h2 className="flex ml-2 justify-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          SolSearcher
        </h2>
      </div>
      <TxnSearchInput />

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <SolanaPriceCard />
        <SolanaTpsCard />
      </div>
      <StakingActivityCard />
    </div>
  );
}
