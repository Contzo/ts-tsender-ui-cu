"use client";
import FormInputElement from "./FormInputElement";
import { isAddress } from "viem";
import TextAreaElement from "./TextAreaElement";
import SendButton from "./SendButton";

import { useAirdropForm } from "@/hooks/useAirdropFrom";
import TransactionDetails from "./TransactionDetails";

export default function AirDropForm() {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isFormDisabled,
    validateReceiverAddresses,
    validateAmounts,
    isSubmitting,
    totalAmount,
    tokenName,
  } = useAirdropForm();

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
        disabled={isSubmitting}
      />
      <TextAreaElement
        label="Recipients (comma or new line separated)"
        placeholder="0x123..., 0x456"
        error={errors.recipients?.message}
        register={register("recipients", {
          required: "At least one recipient is required",
          validate: validateReceiverAddresses,
        })}
        disabled={isSubmitting}
      />
      <TextAreaElement
        label="Amounts (wei; comma or new line separated, scientific notations allowed E.g. 1e18)"
        placeholder="100, 200, 300"
        error={errors.amounts?.message}
        register={register("amounts", {
          required: "At least one amount is required",
          validate: validateAmounts,
        })}
        disabled={isSubmitting}
      />
      <TransactionDetails totalAmount={totalAmount} tokenName={tokenName} />
      <SendButton disabled={isFormDisabled} isSubmitting={isSubmitting} />
    </form>
  );
}
