import { isAddress } from "viem";
import { splitMultipleInputs } from "@/utils/helpers";

export const validateReceiverAddresses = (
  value: string,
  getAmounts: () => string
) => {
  const addresses = splitMultipleInputs(value);
  if (addresses.length === 0) return "Please enter at least one address";

  const invalidAddressIndex = addresses.findIndex((addr) => !isAddress(addr));
  if (invalidAddressIndex !== -1) {
    return `Address ${invalidAddressIndex + 1} is invalid`;
  }

  const amounts = splitMultipleInputs(getAmounts());
  if (amounts.length !== addresses.length) {
    return "Each recipient should have its own token amount";
  }

  return true;
};

export const validateAmounts = (value: string, getRecipients: () => string) => {
  const amounts = splitMultipleInputs(value);
  if (amounts.length === 0) return "Please enter an amount of wei to be sent";

  const invalidAmountIndex = amounts.findIndex(
    (amount) => !/^\d+$|^\d+e\d+$/i.test(amount)
  );
  if (invalidAmountIndex !== -1) {
    return "Only positive integers or scientific notation allowed (e.g., 10 or 1e18)";
  }

  const addresses = splitMultipleInputs(getRecipients());
  console.log(addresses.length);
  console.log(amounts.length);
  if (amounts.length !== addresses.length) {
    return "Each recipient should have its own token amount";
  }

  return true;
};
