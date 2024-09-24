import { HeliusParsedTransaction } from "@/types/helius";
import { WSOL_MINT } from "./consts";

export const fetchBundleFromTransaction = async (txHash: string) => {
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

export const fetchBundleInfo = async (bundleId: string) => {
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

export const fetchParsedTransactions = async (
    txIds: string[]
  ): Promise<HeliusParsedTransaction[]> => {
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
      const data: HeliusParsedTransaction[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  export const fetchTokenPrice = async (
    tokenAddress: string
  ): Promise<string> => {
    try {

      const response = await fetch(
        `https://api.jup.ag/price/v2?ids=${tokenAddress}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      const priceInfo = data.data[tokenAddress].price
      console.log('data', priceInfo)
      return priceInfo;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return '';
    }
  };

export const fetchParsedTransactionsMap = async (
    txns: string[]
  ): Promise<Map<string, HeliusParsedTransaction>> => {
    const parsedTransactions = await fetchParsedTransactions(txns);
    const parsedTransactionsMap = new Map<string, HeliusParsedTransaction>();
    parsedTransactions.forEach((parsedTxn, index) => {
      parsedTransactionsMap.set(txns[index], parsedTxn);
    });
    return parsedTransactionsMap;
  };

// NOTE(zfaizal2): A crude method to detect if a transaction has been sandwiched
// Here a few basic checks are done to potentially spot a potential sandwiching
// First, checking if transaction is present in a jito bundle
// Then checking if three transactions are present
// If present, parse out SOL transfer amounts to calculate sandwich profit

export const detectSandwich = (
    bundleId: string,
    parsedTxns: Map<string, HeliusParsedTransaction>
  ): { isSandwiched: boolean; lostValue: number } => {
    const sandwichResult = {isSandwiched: false, lostValue: 0};

    if (!bundleId) return sandwichResult;

    const txnsArray = Array.from(parsedTxns.values()) as HeliusParsedTransaction[];
    if (txnsArray.length === 1) return sandwichResult;

    let sandwichSolSpend = 0;
    let sandwichSolEarn = 0;
    
    // Find amount of SOL spent
    const sandwichStartTxn = txnsArray[0]
    for (let i = 0; i < sandwichStartTxn.tokenTransfers.length; i++) {
        const transferInfo = sandwichStartTxn.tokenTransfers[i]
        // Check wsol mint transfer, and ensure spend with negative transfer
        if (transferInfo.mint === WSOL_MINT) {
            sandwichSolSpend = transferInfo.tokenAmount
            break;
        }
    }

    // Find amount of SOL earned
    const sandwichEndTxn = txnsArray[2]
    for (let i = 0; i < sandwichEndTxn.tokenTransfers.length; i++) {
        const transferInfo = sandwichEndTxn.tokenTransfers[i]
        // Check wsol mint transfer, and ensure earn with positive transfer
        if (transferInfo.mint === WSOL_MINT) {
            sandwichSolEarn = transferInfo.tokenAmount
            break;
        }
    }

    // Calculate profit
    const sandwichProfit = sandwichSolEarn - sandwichSolSpend

    if (sandwichProfit < 0) return sandwichResult
    
    sandwichResult.isSandwiched = true
    sandwichResult.lostValue = sandwichProfit

    return sandwichResult
  };

