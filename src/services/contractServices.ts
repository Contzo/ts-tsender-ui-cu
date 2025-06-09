import { Config } from "wagmi";
import toast from "react-hot-toast";
import { erc20Abi, tsenderAbi } from "@/app/constants";
import { readContract } from "@wagmi/core";
import { calculateTotalAmount, splitMultipleInputs } from "@/utils";
import { scientificNotationToBigInt } from "../utils/helpers";

export class ERC20ContractServices {
  constructor(private config: Config, private writeContractAsync: any) {}

  async checkAllowance(
    spenderAddress: `0x${string}`,
    erc20TokenAddress: `0x${string}`,
    ownerAddress: `0x${string}`
  ): Promise<bigint> {
    console.log("=== CHECKING ALLOWANCE ===");
    console.log(`Token contract: ${erc20TokenAddress}`);
    console.log(`Owner: ${ownerAddress}`);
    console.log(`Spender: ${spenderAddress}`);
    console.log(`Config state:`, this.config.state);

    try {
      const allowance = await readContract(this.config, {
        abi: erc20Abi,
        address: erc20TokenAddress, // The address of the ERC20 token contract
        functionName: "allowance",
        args: [ownerAddress, spenderAddress], // Arguments: owner, spender
      });

      console.log("Raw allowance response:", allowance);
      console.log("Allowance type:", typeof allowance);
      // The response from 'allowance' is typically a BigInt
      return allowance as bigint; // Assert type if necessary based on ABI return type
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      throw errorMessage;
    }
  }

  async approveTokens(
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: bigint
  ): Promise<string> {
    try {
      const approvalHash = await this.writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "approve",
        args: [spenderAddress, amount],
      });

      return approvalHash;
    } catch (error) {
      console.error("Approval failed:", error);

      const errorMessage = this.extractErrorMessage(error);
      throw error;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "shortMessage" in error) {
      return (error as any).shortMessage;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }
}

export class TSenderContractServices {
  constructor(private writeContractAsync: any) {}

  async airdrop(
    _tsenderAddress: `0x${string}`,
    _erc20TokenAddress: `0x${string}`,
    _recipients: string,
    _amounts: string
  ): Promise<string> {
    const recipientArray = splitMultipleInputs(_recipients);
    const amountsArray = splitMultipleInputs(_amounts);
    const totalAmount = calculateTotalAmount(_amounts);
    if (recipientArray.length !== amountsArray.length)
      throw "Each recipient must have its own amount";
    try {
      const airdropHash = await this.writeContractAsync({
        abi: tsenderAbi,
        address: _tsenderAddress,
        functionName: "airdropERC20",
        args: [
          _erc20TokenAddress,
          recipientArray,
          scientificNotationToBigInt(amountsArray),
          totalAmount,
        ],
      });
      console.log("Airdrop transaction hash", airdropHash);
      return airdropHash;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      throw errorMessage;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "shortMessage" in error) {
      return (error as any).shortMessage;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }
}
