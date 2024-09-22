import React from "react";
import TransactionDetails from "@/components/TransactionDetails";
import { HeliusTransaction } from "@/types/helius";

interface TransactionPageProps {
  params: {
    txn: string;
  };
}

const TransactionPage: React.FC<TransactionPageProps> = async ({ params }) => {
  const { txn } = params;
  const fetchBundleFromTransaction = async (txHash: string) => {
    try {
      const response = await fetch(
        `https://explorer.jito.wtf/wtfrest/api/v1/bundles/transaction/${txHash}`
      );
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, ${response.body}`
        );
      }
      const data = (await response.json())[0].bundle_id;
      return data;
    } catch (error) {
      console.error("Error fetching bundle id:", error);
      return null;
    }
  };

  const fetchBundleInfo = async (bundleId: string) => {
    try {
      const response = await fetch(
        `https://explorer.jito.wtf/wtfrest/api/v1/bundles/bundle/${bundleId}`
      );
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.body}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bundle data:", error);
      return null;
    }
  };

  const fetchParsedTransactions = async (
    txIds: string[]
  ): Promise<HeliusTransaction[]> => {
    try {
      const requestBody = { transactions: txIds };
      const body = JSON.stringify(requestBody);

      const response = await fetch(
        `https://api.helius.xyz/v0/transactions?api-key=${process.env.HELIUS_RPC_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );
      const data: HeliusTransaction[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  const fetchParsedTransactionsMap = async (
    txns: string[]
  ): Promise<Map<string, HeliusTransaction>> => {
    const parsedTransactions = await fetchParsedTransactions(txns);
    const parsedTransactionsMap = new Map<string, HeliusTransaction>();
    parsedTransactions.forEach((parsedTxn, index) => {
      parsedTransactionsMap.set(txns[index], parsedTxn);
    });
    return parsedTransactionsMap;
  };

  const bundleId = await fetchBundleFromTransaction(txn);
  const txns: string[] = [];
  if (bundleId) {
    const bundleData = await fetchBundleInfo(bundleId);
    txns.push(...bundleData[0].txSignatures);
  } else {
    txns.push(txn);
  }
  const parsedTxns = await fetchParsedTransactionsMap(txns);
  console.log("txns", txns, parsedTxns);
  const parsedSearchTxn = parsedTxns.get(txn);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Transaction Details
      </h1>
      <p className="text-white mb-4">Transaction ID: {txn}</p>
      {/* {parsedSearchTxn?.map((parsedIx, index) => {
        console.log("index", index);
        return (
          <TransactionDetails key={index} index={index} parsedTxn={parsedIx} />
        );
      })} */}

      {parsedSearchTxn && <TransactionDetails parsedTxn={parsedSearchTxn} />}
    </div>
  );
};

export default TransactionPage;
