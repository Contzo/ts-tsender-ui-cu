"use client"
import FormInputElement from "./FormInputElement";
import { useForm } from "react-hook-form";
import { isAddress } from "viem";
import TextAreaElement from "./TextAreaElement";

type Inputs = {
    tokenAddress: string;
    recipients: string;
    amounts: string;
}

export default function AirDropForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    function onSubmit(data: Inputs) {
        console.log(data)
    }
    function validateReceiverAddresse(value: string) {
        const addresses = value.split(/[\n,]+/).map(address => address.trim()).filter(address => address.length > 0);
        console.log(addresses)
        if (addresses.length === 0) return "Please enter at least one address";

        for (let index = 0; index < addresses.length; index++) {
            const address = addresses[index];
            if (!isAddress(address)) {
                return `Address ${index + 1} is invalid`;
            }
        }

        return true;
    }

    function validateAmounts(value: string) {
        const amounts = value.split(/[\n,]+/).map(amount => amount.trim()).filter(amount => amount.length > 0);

        if (amounts.length === 0) return "Please enter at least one address";

        return true;
    }

    return (
        <form className="max-w-2xl w-full lg:mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl ring-[4px] border-2  border-blue-500 ring-blue-500/25" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold text-zinc-900">T-Sender</h2>
            <FormInputElement label="Token Addres" register={register("tokenAddress", { required: "Token address is required!", validate: (value) => isAddress(value) || "Invalid Ethereum Address" })} error={errors.tokenAddress?.message} placeholder="0x" />
            <TextAreaElement label="Recipients (comma or new line separated)" placeholder="0x123..., 0x456" error={errors.recipients?.message} register={register("recipients", { required: "At least one reciepient is required", validate: validateReceiverAddresse })} />
            <TextAreaElement label="Amounts (wei; comma or new line separated)" placeholder="100, 200, 300" error={errors.amounts?.message} register={register("amounts", { required: "At least one amount is required", validate: validateAmounts })} />
            <input type="submit" />
        </form>
    )
}