import { detectSandwich } from "@/lib/helpers";
import { HeliusParsedTransaction } from "@/types/helius";
import { BadgeAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import Link from "next/link";

interface SandwichAlertProps {
  bundleId: string;
  parsedTxns: Map<string, HeliusParsedTransaction>;
}

export const SandwichAlert: React.FC<SandwichAlertProps> = async ({
  bundleId,
  parsedTxns,
}) => {
  const txnSandwichInfo = detectSandwich(bundleId, parsedTxns);

  return txnSandwichInfo.isSandwiched ? (
    <div className="mb-4">
      <Alert>
        <BadgeAlert className="h-4 w-4" />
        <AlertTitle className="text-l font-bold">This Transaction may have been sandwiched!</AlertTitle>
        <AlertDescription>
          This transaction has been found in a Jito bundle and may have been
          sandwiched, where {txnSandwichInfo.lostValue} SOL was extracted. Click{" "}
          <Link className="underline" href={`https://explorer.jito.wtf/bundle/${bundleId}`}>
            here
          </Link>{" "}
          for a detailed view in the Jito Explorer.
        </AlertDescription>
      </Alert>
    </div>
  ) : (
    <></>
  );
};
