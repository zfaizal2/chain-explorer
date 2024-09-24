"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";

export const TxnSearchInput = () => {
  const [txn, setTxn] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (txn.trim()) {
      router.push(`/txn/${txn}`);
    }
  };

  return (
    <div className="w-full rounded-lg">
      <Input
        type="text"
        placeholder="Search by transaction hash"
        className="h-8"
        onChange={(e) => setTxn(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
    </div>
  );
};
