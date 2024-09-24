import React from "react";
import TransactionDetails from "@/components/TransactionDetails";
import {
  fetchBundleFromTransaction,
  fetchBundleInfo,
  fetchParsedTransactionsMap,
} from "@/lib/helpers";
import { SandwichAlert } from "@/components/SandwichAlert";

interface TransactionPageProps {
  params: {
    txn: string;
  };
}

const TransactionPage: React.FC<TransactionPageProps> = async ({ params }) => {
  const { txn } = params;

  const bundleId = await fetchBundleFromTransaction(txn);
  const txns: string[] = [];
  if (bundleId) {
    const bundleData = await fetchBundleInfo(bundleId);
    txns.push(...bundleData[0].txSignatures);
  } else {
    txns.push(txn);
  }
  const parsedTxns = await fetchParsedTransactionsMap(txns);
  const parsedSearchTxn = parsedTxns.get(txn);

  // NOTE(zfaizal2): A crude method to detect if a transaction has been sandwiched
  // Here a few basic checks are done to potentially spot a potential sandwiching
  // First, checking if transaction is present in a jito bundle
  // Then checking if three transactions are present
  // If

  return (
    <div className="container mx-auto p-4">
      <p className="text-white mb-4">Transaction ID: {txn}</p>
      {bundleId ? (
        <SandwichAlert bundleId={bundleId} parsedTxns={parsedTxns} />
      ) : (
        <></>
      )}
      {parsedSearchTxn && <TransactionDetails parsedTxn={parsedSearchTxn} />}
    </div>
  );
};

export default TransactionPage;
