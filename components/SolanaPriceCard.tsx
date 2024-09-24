import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { WSOL_MINT } from "@/lib/consts";
import { fetchTokenPrice } from "@/lib/helpers";

export const SolanaPriceCard = async () => {
  const priceInfo = await fetchTokenPrice(WSOL_MINT);
  return (
    <Card className="bg-[#1c1c1c] border-none rounded-xl flex flex-col">
      <CardHeader>
        <CardTitle className="text-white">SOL Price</CardTitle>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="text-4xl font-bold text-white">${priceInfo.slice(0,6)}</div>
        <div className="text-sm text-gray-400">$61.4B Market Cap</div>
        <div className="text-sm text-green-500 flex items-center">
          0.38% <TrendingUp className="h-4 w-4 ml-1" />
        </div>
        <div className="text-xs text-gray-400">via Jupiter vs yesterday</div>
      </CardContent>
    </Card>
  );
};
