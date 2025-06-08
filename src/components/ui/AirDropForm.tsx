"use client";
import FormInputElement from "./FormInputElement";
import { useForm } from "react-hook-form";
import { isAddress } from "viem";
import TextAreaElement from "./TextAreaElement";
import SendButton from "./SendButton";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/app/constants";
import { splitMultipleInputs, getApprovedAmount } from "@/utils/helpers";
import { useMemo } from "react";
import { calculateTotalAmount } from "@/utils";
import toast from "react-hot-toast";
import useIsMounted from "@/hooks/useIsMounted";
// import { Config, readContract } from "@wagmi/core";
// import { Abi } from "viem";
type Inputs = {
  tokenAddress: string;
  recipients: string;
  amounts: string;
};

export default function AirDropForm() {
  /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<Inputs>();
  const chainId = useChainId(); // get the chain Id wagmi hook
  const config = useConfig();
  const connectedAccount = useAccount();
  const isDisabled = Object.keys(errors).length !== 0;
  const watchedAmounts = watch("amounts"); // subscribe to the amounts changes.
  const totalAmount: bigint = useMemo(
    () => calculateTotalAmount(watchedAmounts),
    [watchedAmounts]
  );
  const { data: hash, isPending, writeContractAsync } = useWriteContract();


  /*//////////////////////////////////////////////////////////////
                        EVENTS HANDLERS
//////////////////////////////////////////////////////////////*/
  async function onSubmit(data: Inputs) {
    const tokenAddress = getValues("tokenAddress");
    const recipients = getValues("recipients");
    const amounts = getValues("amounts");
    console.log("Form submitted");
    console.log("Token Address:", tokenAddress);
    console.log("Recipients:", recipients);
    console.log("Amounts:", amounts);

    // Get the tsender contract address for the current chain
    const tSenderAddress = chainsToTSender[chainId]?.tsender;
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
    // Add validation for recipients and amounts later...

    // --- Step 1: Check Allowance ---
    let approvedAmount;
    try {
      approvedAmount = await getApprovedAmount(
        tSenderAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        connectedAccount.address,
        erc20Abi,
        config
      );
      console.log(`Current allowance: ${approvedAmount}`);

      // TODO: If allowance is insufficient, call the approve function
      // TODO: If allowance is sufficient, call the airdrop function on tsender contract
    } catch (error) {
      console.error("Error during submission process:", error);
      toast.error(
        "An error occurred while fetching allowance. Check the console for details."
      );
      return;
    }
    console.log("tdss", approvedAmount)
    console.log("ts", totalAmount)
    if (totalAmount > approvedAmount) {
      // update allowance if not enough
      console.log(
        `Approval needed: Current allowance ${approvedAmount}, required: ${totalAmount}`
      );
      try {
        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tSenderAddress as `0x${string}`, totalAmount],
        });
        console.log("Approval transaction hash:", approvalHash);
        // ---> Next: wait for confirmation(transaction to be mined)
        toast.success(`Approval for ${totalAmount} granted`);
      } catch (error) {
        console.error("Approval failed:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "shortMessage" in error
        ) {
          toast.error((error as any).shortMessage);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } else {
      console.log(`Sufficient allowance: ${approvedAmount}`);
      // ---> Proceed to airdrop logic.
    }
  }

  /*//////////////////////////////////////////////////////////////
                             AUX FUNCTIONS
    //////////////////////////////////////////////////////////////*/

  function validateReceiverAddresses(value: string) {
    const addresses = splitMultipleInputs(value);
    if (addresses.length === 0) return "Please enter at least one address";

    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index];
      if (!isAddress(address)) {
        return `Address ${index + 1} is invalid`;
      }
    }

    const amounts = splitMultipleInputs(getValues("amounts"));
    if (amounts.length !== addresses.length)
      return "Each recipient should have its own token amount";

    return true;
  }

  function validateAmounts(value: string) {
    const amounts = splitMultipleInputs(value);

    if (amounts.length === 0) return "Please an amount of wei to be sent";

    for (let index = 0; index < amounts.length; index++) {
      // Allow both regular integers and scientific notation
      if (!/^\d+$|^\d+e\d+$/i.test(amounts[index])) {
        return "Only positive integers or scientific notation allowed (e.g., 10 or 1e1)";
      }
    }

    const addresses = splitMultipleInputs(getValues("recipients"));
    if (amounts.length !== addresses.length)
      return "Each recipient should have its own token amount";

    return true;
  }

  return (
    <form
      className="max-w-2xl w-full lg:mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl ring-[4px] border-2  border-blue-500 ring-blue-500/25"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-semibold text-zinc-900">T-Sender</h2>
      <FormInputElement
        label="Token Address"
        register={register("tokenAddress", {
          required: "Token address is required!",
          validate: (value) => isAddress(value) || "Invalid Ethereum Address",
        })}
        error={errors.tokenAddress?.message}
        placeholder="0x"
      />
      <TextAreaElement
        label="Recipients (comma or new line separated)"
        placeholder="0x123..., 0x456"
        error={errors.recipients?.message}
        register={register("recipients", {
          required: "At least one recipient is required",
          validate: validateReceiverAddresses,
        })}
      />
      <TextAreaElement
        label="Amounts (wei; comma or new line separated)"
        placeholder="100, 200, 300"
        error={errors.amounts?.message}
        register={register("amounts", {
          required: "At least one amount is required",
          validate: validateAmounts,
        })}
      />
      <SendButton disabled={isDisabled} />
    </form>
  );
}
