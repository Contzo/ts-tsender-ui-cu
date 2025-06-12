import { formatEther } from "viem";

interface TransactionDetailsProps {
  totalAmount: bigint;
  tokenName: string;
}
export default function TransactionDetails({
  totalAmount,
  tokenName,
}: TransactionDetailsProps) {
  return (
    <div className="flex flex-col gap-3 border border-gray-300 rounded-md p-4">
      <h3 className="text-md font-bold">Transaction Details</h3>
      <div className="flex align-center justify-between">
        <span className="text-sm text-zinc-600">Token name:</span>
        <span className="font-mono text-zinc-900">{tokenName}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-zinc-600 whitespace-nowrap">
          Amount (wei)
        </span>
        <span className="font-mono text-zinc-900 max-w-[60%] truncate text-right">
          {totalAmount}
        </span>
      </div>

      <div className="flex align-center justify-between">
        <span className="text-sm text-zinc-600 whitespace-nowrap">
          Amount token:
        </span>
        <span className="font-mono text-zinc-900 max-w-[60%] truncate text-right">
          {formatEther(totalAmount)}
        </span>
      </div>
    </div>
  );
}
