import React from "react";
import { HeliusParsedTransaction } from "@/types/helius";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface TransactionDetailsProps {
  parsedTxn: HeliusParsedTransaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  parsedTxn,
}) => {
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
          </div>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-white p-4 rounded-lg">
            Instructions
          </AccordionTrigger>
          <AccordionContent className="p-4 rounded-lg">
            {parsedTxn.instructions.map((instruction, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="text-white font-semibold mb-2">
                  Instruction {index + 1}
                </h4>
                <p className="text-gray-400">
                  Program ID: {instruction.programId}
                </p>
                {/* <p className="text-gray-400">Data: {instruction.data}</p> */}
                <p className="text-gray-400">
                  Accounts: {instruction.accounts.join(", ")}
                </p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="token-transfers">
          <AccordionTrigger className="text-white p-4 rounded-lg">
            Token Transfers
          </AccordionTrigger>
          <AccordionContent className="p-4 rounded-lg">
            {parsedTxn.tokenTransfers.map((transfer, index) => {
              console.log("tranfer", transfer);
              return (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-gray-400">
                    From: {transfer.fromUserAccount}
                  </p>
                  <p className="text-gray-400">To: {transfer.toUserAccount}</p>
                  <p className="text-gray-400">
                    Amount: {transfer.tokenAmount} tokens
                  </p>
                  <p className="text-gray-400">Mint: {transfer.mint}</p>
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="native-transfers">
          <AccordionTrigger className="text-white p-4 rounded-lg">
            Native Transfers
          </AccordionTrigger>
          <AccordionContent className="p-4 rounded-lg">
            {parsedTxn.nativeTransfers.map((transfer, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <p className="text-gray-400">
                  From: {transfer.fromUserAccount}
                </p>
                <p className="text-gray-400">To: {transfer.toUserAccount}</p>
                <p className="text-gray-400">
                  Amount: {transfer.amount / 1e9} SOL
                </p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
