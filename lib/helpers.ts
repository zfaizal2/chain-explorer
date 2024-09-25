import { HeliusParsedTransaction } from "@/types/helius";
import { PERFORMANCE_SAMPLE_LIMIT, WSOL_MINT } from "./consts";
import { Connection, PerfSample } from "@solana/web3.js";

const connection = new Connection(
  `https://rpc.helius.xyz/v0/transactions?api-key=${process.env.HELIUS_RPC_API_KEY}`
);

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
    const priceInfo = data.data[tokenAddress].price;
    return priceInfo;
  } catch (error) {
    console.error("Error fetching token price:", error);
    return "";
  }
};

export const fetchSolanaPerformanceStats = async (): Promise<PerfSample[]> => {
  try {
    return connection.getRecentPerformanceSamples(PERFORMANCE_SAMPLE_LIMIT);
  } catch (error) {
    console.error("Error fetching performance stats:", error);
    return [];
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

type TokenMetadata = {
  name: string;
  symbol: string;
  address: string;
  decimals: string;
  logoURI: string;
};

export const fetchTokenMetadata = async (
  tokenAddress: string
): Promise<TokenMetadata | never> => {
  try {
    const response = await fetch(
      `https://tokens.jup.ag/token/${tokenAddress}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data as TokenMetadata;
  } catch (error) {
    console.error("Error fetching token metadat:", error);
    return {} as never;
  }
};

type EpochChart = {
  name: string;
  data: number[]
};

export type StakingStatsResponse = {
  epochCharts: {
    activated: EpochChart;
    balance: EpochChart;
    deactivated: EpochChart;
    net: EpochChart;
  };
};

export const fetchStakingStats = async () => {
  try {
    const response = await fetch(`https://solanacompass.com/stats`, {
      method: "GET",
    });
    const data = await response.json();
    // return data as StakingStatsResponse;
    return mappedStakingStats(data);
  } catch (error) {
    console.error("Error fetching token metadat:", error);
    return {} as never;
  }
};

export type MappedStakingStats = {
    epoch: string,
    activatingStake: number,
    deactivatingStake: number,
    totalStake:number,
}

export const mappedStakingStats = async (
  stakingStats: StakingStatsResponse
) => {
  const epochs = Object.keys(stakingStats.epochCharts.activated.data);
  const activatingStake = Object.values(
    stakingStats.epochCharts.activated.data
  );
  const totalStake = Object.values(stakingStats.epochCharts.balance.data).slice(
    -activatingStake.length
  );
  const deactivatedStake = Object.values(
    stakingStats.epochCharts.deactivated.data
  );
  let stakingChange = 0;
  const stakingChartData = epochs.map((epoch, index) => {
    stakingChange +=
      activatingStake[index] +
      deactivatedStake[index];
    return {
      epoch,
      activatingStake: activatingStake[index],
      deactivatingStake: deactivatedStake[index],
      totalStake: totalStake[index],
    } as MappedStakingStats;
  });
  const startEpochStake = stakingChartData[0].totalStake;
  const stakingPercentChange = (stakingChange / startEpochStake) * 100;
  return {
    stakingChartData,
    stakingPercentChange
  }
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
  const sandwichResult = { isSandwiched: false, lostValue: 0 };

  if (!bundleId) return sandwichResult;

  const txnsArray = Array.from(
    parsedTxns.values()
  ) as HeliusParsedTransaction[];
  if (txnsArray.length === 1) return sandwichResult;

  let sandwichSolSpend = 0;
  let sandwichSolEarn = 0;

  // Find amount of SOL spent
  const sandwichStartTxn = txnsArray[0];
  for (let i = 0; i < sandwichStartTxn.tokenTransfers.length; i++) {
    const transferInfo = sandwichStartTxn.tokenTransfers[i];
    // Check wsol mint transfer, and ensure spend with negative transfer
    if (transferInfo.mint === WSOL_MINT) {
      sandwichSolSpend = transferInfo.tokenAmount;
      break;
    }
  }

  // Find amount of SOL earned
  const sandwichEndTxn = txnsArray[2];
  for (let i = 0; i < sandwichEndTxn.tokenTransfers.length; i++) {
    const transferInfo = sandwichEndTxn.tokenTransfers[i];
    // Check wsol mint transfer, and ensure earn with positive transfer
    if (transferInfo.mint === WSOL_MINT) {
      sandwichSolEarn = transferInfo.tokenAmount;
      break;
    }
  }

  // Calculate profit
  const sandwichProfit = sandwichSolEarn - sandwichSolSpend;

  if (sandwichProfit < 0) return sandwichResult;

  sandwichResult.isSandwiched = true;
  sandwichResult.lostValue = sandwichProfit;

  return sandwichResult;
};
