import React from "react";
import { HeliusParsedTransaction } from "@/types/helius";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Tabs, TabsList } from "./ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { fetchTokenMetadata } from "@/lib/helpers";
import Image from "next/image";

interface TransactionDetailsProps {
  parsedTxn: HeliusParsedTransaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = async ({
  parsedTxn,
}) => {
  const tokenTransfersWithMetadata = await Promise.all(
    parsedTxn.tokenTransfers.map(async (tokenTransfer) => {
      const tokenMetadata = await fetchTokenMetadata(tokenTransfer.mint);
      const tokenInfo = { ...tokenTransfer, ...tokenMetadata };
      return tokenInfo;
    })
  );
  return (
    <div className="space-y-4">
      <Card className="bg-[#1c1c1c] border-none">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <p className="text-gray-400">Transaction Hash</p>
              <p className="text-white">{parsedTxn.signature}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Status</p>
              <Badge
                variant={parsedTxn.transactionError ? "destructive" : "default"}
              >
                {parsedTxn.transactionError ? "Failed" : "Success"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Timestamp</p>
              <p className="text-white">
                {new Date(parsedTxn.timestamp * 1000).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Slot</p>
              <p className="text-white">{parsedTxn.slot}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Fee</p>
              <p className="text-white">{parsedTxn.fee / 1e9} SOL</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Fee Payer</p>
              <p className="text-white">{parsedTxn.feePayer}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Action</p>
              <p className="text-white">{parsedTxn.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="native-transfers">
        <TabsList className="grid w-full grid-cols-3 mb-4 rounded">
          <TabsTrigger value="native-transfers">Native Transfers</TabsTrigger>
          <TabsTrigger value="token-transfers">Token Transfers</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        <TabsContent className="rounded-lg" value="native-transfers">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">SOL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedTxn.nativeTransfers.map((transfer, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium h-12">
                      {transfer.fromUserAccount}
                    </TableCell>
                    <TableCell>{transfer.toUserAccount}</TableCell>
                    <TableCell className="text-right">
                      {transfer.amount / LAMPORTS_PER_SOL}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent className="rounded-lg" value={"token-transfers"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenTransfersWithMetadata.map((transfer, index) => {
                return (
                  <TableRow key={index} className="p-4">
                    <TableCell className="font-medium h-12">
                      {transfer.fromUserAccount}
                    </TableCell>
                    <TableCell>{transfer.toUserAccount}</TableCell>
                    <TableCell className="flex items-center">
                      <Image
                        className="rounded-full mr-2"
                        src={transfer.logoURI}
                        alt={transfer.symbol}
                        width={25}
                        height={25}
                      />
                      {transfer.symbol}
                    </TableCell>
                    <TableCell className="text-right">
                      {transfer.tokenAmount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent className="rounded-lg" value="instructions">
          {parsedTxn.instructions.map((instruction, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h4 className="text-white font-semibold mb-2">
                Instruction {index + 1}
              </h4>
              <div className="flex">
                <p className="text-gray-400 mr-2">Program ID:</p>
                <p>{instruction.programId}</p>
              </div>
              {/* <p className="text-gray-400">Data: {instruction.data}</p> */}
              <p className="text-gray-400">Accounts:</p>
              {instruction.accounts.map((account) => {
                return <p key={account}>{account}</p>;
              })}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {parsedTxn.transactionError && (
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-red-500">Transaction Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">{parsedTxn.transactionError}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionDetails;
