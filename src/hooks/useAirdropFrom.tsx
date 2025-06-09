"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import toast from "react-hot-toast";

import { FormInputs } from "@/types/airdrop";
import {
  validateReceiverAddresses,
  validateAmounts,
  splitMultipleInputs,
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
    formState: { errors },
    getValues,
    watch,
  } = useForm<FormInputs>();

  const chainId = useChainId();
  const config = useConfig();
  const connectedAccount = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const watchedAmounts = watch("amounts");
  const totalAmount = useMemo(
    () => calculateTotalAmount(watchedAmounts),
    [watchedAmounts]
  );

  const isFormDisabled = Object.keys(errors).length > 0 || isPending;

  const erc20Contract = useMemo(
    () => new ERC20ContractServices(config, writeContractAsync),
    [config, writeContractAsync]
  );
  const tSenderContract = useMemo(
    () => new TSenderContractServices(writeContractAsync),
    [writeContractAsync]
  );

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
    // --- Step 1: Check Allowance ---
    let approvedAmount;
    try {
      approvedAmount = await erc20Contract.checkAllowance(
        tSenderAddress,
        tokenAddress,
        connectedAccount.address
      );
    } catch (error) {
      console.error("Error during submission process:", error);
      toast.error(
        "An error occurred while fetching allowance. Check the console for details."
      );
      return;
    }
    if (totalAmount > approvedAmount) {
      // update allowance if not enough
      console.log(
        `Approval needed: Current allowance ${approvedAmount}, required: ${totalAmount}`
      );
      try {
        const approvalHash = (await erc20Contract.approveTokens(
          tokenAddress,
          tSenderAddress,
          totalAmount
        )) as `0x${string}`;
        console.log("Approval transaction hash:", approvalHash);
        // wait for transaction confirmation and receipt
        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });

        console.log("Approval confirmed:", approvalReceipt);
        toast.success(`Approval for ${totalAmount} granted`);
      } catch (error) {
        console.error("Error during approval: ", error);
        toast.error(
          "An error occurred while fetching approval. Check the console for details"
        );
      }
    } else {
      console.log(`Sufficient allowance: ${approvedAmount}`);
    }
    // --- Step 2: Air drop amounts to receivers ---
    try {
      console.log("Airdropping the amounts to recepients");
      const airDropTransactionHash = await tSenderContract.airdrop(
        tSenderAddress,
        tokenAddress,
        recipients,
        amounts
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred while fetching approval. Check the console for details"
      );
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    getValues,
    onSubmit,
    isFormDisabled,
    validateReceiverAddresses: (value: string) =>
      validateReceiverAddresses(value, () => getValues("amounts")),
    validateAmounts: (value: string) =>
      validateAmounts(value, () => getValues("recipients")),
  };
}
