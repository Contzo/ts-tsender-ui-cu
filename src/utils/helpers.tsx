"use client";

export function splitMultipleInputs(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function scientificNotationToBigInt(_input: string[]): string[] {
  return _input.map((value) => {
    if (/^\d+e\d+$/i.test(value)) {
      try {
        const [base, exponent] = value.split(/e/i);
        const baseBigInt = BigInt(base);
        const exponentBigInt = BigInt(exponent);
        const wholeNumber = baseBigInt * BigInt(10) ** exponentBigInt;
        return wholeNumber.toString();
      } catch (error) {
        console.error(error);
        throw "Error occurred during conversion, check console for more details";
      }
    } else if (/^\d+$/.test(value)) return value;
    else throw `Invalid value: ${value}`;
  });
}
