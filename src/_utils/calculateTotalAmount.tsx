import { splitMultipleInputs } from "./helpers"

export function calculateTotalAmount(amounts: string): bigint {
    if (!amounts) return BigInt(0)
    const amountsSplit = splitMultipleInputs(amounts)
    const totalAmount = amountsSplit.reduce((acc, amount) => acc + BigInt(amount), BigInt(0))
    console.log(totalAmount)
    return totalAmount
}