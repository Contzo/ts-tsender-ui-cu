"use client";
import { Config, readContract } from "@wagmi/core";
import { Abi } from "viem";

export function splitMultipleInputs(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export async function getApprovedAmount(
  spenderAddress: `0x${string}`,
  erc20TokenAddress: `0x${string}`,
  ownerAddress: `0x${string}`,
  erc20Abi: Abi,
  config: Config
): Promise<bigint> {
  // Return type should be bigint for uint256

  console.log(`Checking allowance for token ${erc20TokenAddress}`);
  console.log(`Owner: ${ownerAddress}`);
  console.log(`Spender: ${spenderAddress}`);

  try {
    const allowance = await readContract(config, {
      abi: erc20Abi,
      address: erc20TokenAddress, // The address of the ERC20 token contract
      functionName: "allowance",
      args: [ownerAddress, spenderAddress], // Arguments: owner, spender
    });

    console.log("Raw allowance response:", allowance);
    // The response from 'allowance' is typically a BigInt
    return allowance as bigint; // Assert type if necessary based on ABI return type
  } catch (error) {
    console.error("Error fetching allowance:", error);
    // Rethrow or handle error appropriately
    throw new Error("Failed to fetch token allowance.");
  }
}
