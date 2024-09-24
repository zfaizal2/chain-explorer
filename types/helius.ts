/* eslint-disable @typescript-eslint/no-explicit-any */
export type AccountData = {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: {
    mint: string;
    rawTokenAmount: {
      tokenAmount: string;
      decimals: number;
    };
  }[];
};

export type InstructionData = {
  accounts: string[];
  data: string;
  programId: string;
  innerInstructions: {
    accounts: string[];
    data: string;
    programId: string;
  }[];
};

export type TokenTransfer = {
  fromUserAccount: string;
  toUserAccount: string;
  tokenAmount: number;
  mint: string;
  fromTokenAccount: string;
  toTokenAccount: string;
};

export type NativeTransfer = {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
};

export type HeliusParsedTransaction = {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
  accountData: AccountData[];
  transactionError: string | null;
  instructions: InstructionData[];
  events: {
    nft: any;
    swap: any;
    compressed: any;
  };
};


