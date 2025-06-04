import { splitMultipleInputs } from "../helpers";

export function calculateTotalAmount(amounts: string): bigint {
    if (!amounts) return BigInt(0)
    const amountsSplit = splitMultipleInputs(amounts)

    const totalAmount = amountsSplit.reduce((acc, amount) => {
        // Handle scientific notation (e.g., 12e5)
        if (/^\d+e\d+$/i.test(amount)) {
            const [base, exponent] = amount.split(/e/i);
            try {
                const baseBigInt = BigInt(base);
                const exponentNumber = Number(exponent);

                // Validate exponent is safe and reasonable
                if (exponentNumber < 0 ||
                    exponentNumber > 1000 ||
                    !Number.isInteger(exponentNumber)) {
                    return acc;
                }

                return acc + (baseBigInt * (BigInt(10) ** BigInt(exponentNumber)));
            } catch {
                return acc;
            }
        }
        // Handle regular positive integers
        else if (/^\d+$/.test(amount)) {
            return acc + BigInt(amount);
        }
        // Skip all other formats
        return acc;
    }, BigInt(0))

    console.log(totalAmount)
    return totalAmount
}