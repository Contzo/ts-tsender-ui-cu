"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { formatEther, isAddress } from "viem";

import { FormInputs } from "@/types/airdrop";
import {
  validateReceiverAddresses,
  validateAmounts,
  calculateTotalAmount,
} from "@/utils";
import {
  ERC20ContractServices,
  TSenderContractServices,
} from "@/services/contractServices";
import { chainsToTSender } from "@/app/constants";
import { waitForTransactionReceipt } from "@wagmi/core";

export function useAirdropForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    watch,
  } = useForm<FormInputs>();
  const chainId = useChainId();
  const config = useConfig();
  const connectedAccount = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const watchedAmounts = watch("amounts");
  const watchedTokenAddress = watch("tokenAddress");
  const [tokenName, setTokenName] = useState("");
  const totalAmount = useMemo(
    () => calculateTotalAmount(watchedAmounts),
    [watchedAmounts]
  );

  const isFormDisabled =
    Object.keys(errors).length > 0 || isPending || isSubmitting;

  const erc20Contract = useMemo(
    () => new ERC20ContractServices(config, writeContractAsync),
    [config, writeContractAsync]
  );
  const tSenderContract = useMemo(
    () => new TSenderContractServices(writeContractAsync),
    [writeContractAsync]
  );

  useEffect(() => {
    async function getTokenName() {
      try {
        if (isAddress(watchedTokenAddress)) {
          const name = await erc20Contract.getTokenName(watchedTokenAddress);
          setTokenName(name);
        } else setTokenName("");
      } catch (err) {
        console.error("Failed to fetch token name:", err);
        setTokenName("Invalid token address");
      }
    }
    getTokenName();
  }, [erc20Contract, watchedTokenAddress]);
  async function onSubmit(data: FormInputs) {
    const { tokenAddress, recipients, amounts } = data;
    console.log("Form submitted");
    console.log("Token Address:", tokenAddress);
    console.log("Recipients:", recipients);
    console.log("Amounts:", amounts);

    // Get the tsender contract address for the current chain
    const tSenderAddress = chainsToTSender[chainId]?.tsender as `0x${string}`;
    console.log("Current Chain ID:", chainId);
    console.log("TSender Address for this chain:", tSenderAddress);

    // Basic validation
    if (!connectedAccount.address) {
      alert("Please connect your wallet.");
      return;
    }
    if (!tSenderAddress) {
      alert(
        "TSender contract not found for the connected network. Please switch networks."
      );
      return;
    }
    try {
      // --- Step 1: Check Allowance ---
      const approvedAmount = await erc20Contract.checkAllowance(
        tSenderAddress,
        tokenAddress,
        connectedAccount.address
      );
      console.log("Approved allowance:", approvedAmount);

      let isApproved = approvedAmount >= totalAmount;

      if (!isApproved) {
        console.log(
          `Not enough allowance. Approved: ${approvedAmount}, Required: ${totalAmount}`
        );
        const approvalHash = (await erc20Contract.approveTokens(
          tokenAddress,
          tSenderAddress,
          totalAmount
        )) as `0x${string}`;

        console.log("Waiting for approval confirmation...");
        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });
        if (approvalReceipt.status === "success") {
          console.log(approvalReceipt.status);
          toast.success(`Approval for ${formatEther(totalAmount)}ETH granted`);
          isApproved = true;
        }
      }

      if (isApproved) {
        console.log("Proceeding with airdrop...");
        const airDropTransactionHash = await tSenderContract.airdrop(
          tSenderAddress,
          tokenAddress,
          recipients,
          amounts
        );
        console.log("Airdrop transaction hash: ", airDropTransactionHash);
        toast.success(`Airdrop sent! Tx hash:`);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Submission failed. See console for details.");
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    getValues,
    isSubmitting,
    onSubmit,
    isFormDisabled,
    totalAmount,
    tokenName,
    validateReceiverAddresses: (value: string) =>
      validateReceiverAddresses(value, () => getValues("amounts")),
    validateAmounts: (value: string) =>
      validateAmounts(value, () => getValues("recipients")),
  };
}
