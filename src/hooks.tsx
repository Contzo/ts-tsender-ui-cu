"use client"

import { readContract } from "@wagmi/core";
import { Abi } from "viem";
import { useConfig } from "wagmi"




export async function useAllwances(spenderAddress: `0x${string}`,
    erc20TokenAddress: `0x${string}`,
    ownerAddress: `0x${string}`, erc20Abi: Abi): Promise<bigint> {
    const config = useConfig();
    console.log(`Checking allowance for token ${erc20TokenAddress}`);
    console.log(`Owner: ${ownerAddress}`);
    console.log(`Spender: ${spenderAddress}`);

    try {
        const allowance = await readContract(config, {
            abi: erc20Abi,
            address: erc20TokenAddress,       // The address of the ERC20 token contract
            functionName: 'allowance',
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