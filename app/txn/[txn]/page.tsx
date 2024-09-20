import React from 'react';

interface TransactionPageProps {
  params: {
    txn: string;
  };
}

const TransactionPage: React.FC<TransactionPageProps> = ({ params }) => {
  const { txn } = params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
      <p>Transaction ID: {txn}</p>
      {/* Add more transaction details here */}
    </div>
  );
};

export default TransactionPage;
