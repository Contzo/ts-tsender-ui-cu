"use client"
import FormInputElement from "./FormInputElement";
import { useForm } from "react-hook-form";
import { isAddress } from "viem";
import TextAreaElement from "./TextAreaElement";
import SendButton from "./SendButton";
import { useAccount, useChainId, useConfig } from "wagmi";
import { chainsToTSender, tsenderAbi, erc20Abi } from "../../app/constants"
import { readContract } from "@wagmi/core";

type Inputs = {
    tokenAddress: string;
    recipients: string;
    amounts: string;
}

export default function AirDropForm() {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputs>();
    const chainId = useChainId(); // get the chain Id wagmi hook
    const config = useConfig();
    const connectedAccount = useAccount();
    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            // If the contract TSender address is not valid return 0 and alert the user to change the chain
            alert("No address found, please use a supported chain");
            return 0;
        }
        try {

            const allowance = await readContract(config, {
                abi: erc20Abi,
                address: tSenderAddress as `0x${string}`,
                functionName: "allowance",
                args: [connectedAccount.address, tSenderAddress as `0x${string}`]
            })
            return allowance as number
        } catch (error) {
            console.log(error)
            return 0;
        }
    }

    async function onSubmit(data: Inputs) {
        //1. Get the TSender contract address according to the chain id 
        const TSenderAddress = chainsToTSender[chainId]["tsender"];
        const approvedAmount = await getApprovedAmount(TSenderAddress);
        console.log(approvedAmount)
    }

    const isDisabled = Object.keys(errors).length !== 0;
    function splitMultipleInputs(value: string): string[] {
        return value.split(/[\n,]+/).map(value => value.trim()).filter(value => value.length > 0);
    }

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
        if (amounts.length !== addresses.length) return "Each recipient should have its own token amount"

        return true;
    }

    function validateAmounts(value: string) {
        const amounts = splitMultipleInputs(value)

        if (amounts.length === 0) return "Please an amount of wei to be sent";
        for (let index = 0; index < amounts.length; index++) {
            if (!/^\d+$/.test(amounts[index])) return 'Only positive integers allowed'
        }

        const addresses = splitMultipleInputs(getValues("recipients"))
        if (amounts.length !== addresses.length) return "Each recipient should have its own token amount"


        return true;
    }


    return (
        <form className="max-w-2xl w-full lg:mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl ring-[4px] border-2  border-blue-500 ring-blue-500/25" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold text-zinc-900">T-Sender</h2>
            <FormInputElement label="Token Addres" register={register("tokenAddress", { required: "Token address is required!", validate: (value) => isAddress(value) || "Invalid Ethereum Address" })} error={errors.tokenAddress?.message} placeholder="0x" />
            <TextAreaElement label="Recipients (comma or new line separated)" placeholder="0x123..., 0x456" error={errors.recipients?.message} register={register("recipients", { required: "At least one reciepient is required", validate: validateReceiverAddresses })} />
            <TextAreaElement label="Amounts (wei; comma or new line separated)" placeholder="100, 200, 300" error={errors.amounts?.message} register={register("amounts", { required: "At least one amount is required", validate: validateAmounts })} />
            <SendButton disabled={isDisabled} />
        </form>
    )
}