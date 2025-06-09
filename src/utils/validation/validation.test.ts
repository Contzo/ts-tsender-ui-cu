import { describe, it, expect } from "vitest";
import {
  validateReceiverAddresses,
  validateAmounts,
  splitMultipleInputs,
} from "@/utils"; // adjust path as needed

// Mock utility

// Example valid address from Ethereum
const validAddress = "0x000000000000000000000000000000000000dead";
const invalidAddress = "0x123";

describe("validateReceiverAddresses", () => {
  it("should return error if no addresses are provided", () => {
    const result = validateReceiverAddresses("", () => "100");
    expect(result).toBe("Please enter at least one address");
  });

  it("should return error for invalid address", () => {
    const result = validateReceiverAddresses(
      `${validAddress}, ${invalidAddress}`,
      () => "100, 200"
    );
    expect(result).toBe("Address 2 is invalid");
  });

  it("should return error if number of amounts doesn't match addresses", () => {
    const result = validateReceiverAddresses(
      `${validAddress}, ${validAddress}`,
      () => "100"
    );
    expect(result).toBe("Each recipient should have its own token amount");
  });

  it("should return true for valid input", () => {
    const result = validateReceiverAddresses(
      `${validAddress}, ${validAddress}`,
      () => "100,200"
    );
    expect(result).toBe(true);
  });
});

describe("validateAmounts", () => {
  it("should return error if no amounts are provided", () => {
    const result = validateAmounts("", () => validAddress);
    expect(result).toBe("Please enter an amount of wei to be sent");
  });

  it("should return error for non-numeric amount", () => {
    const result = validateAmounts(
      "100,abc",
      () => `${validAddress}, ${validAddress}`
    );
    expect(result).toBe(
      "Only positive integers or scientific notation allowed (e.g., 10 or 1e18)"
    );
  });

  it("should return error if number of amounts doesn't match recipients", () => {
    const result = validateAmounts(
      "100",
      () => `${validAddress}, ${validAddress}`
    );
    expect(result).toBe("Each recipient should have its own token amount");
  });

  it("should return true for valid integer amounts", () => {
    const result = validateAmounts(
      "100,200",
      () => `${validAddress}, ${validAddress}`
    );
    expect(result).toBe(true);
  });

  it("should return true for valid scientific notation amounts", () => {
    const result = validateAmounts(
      "1e18,2e18",
      () => `${validAddress}, ${validAddress}`
    );
    expect(result).toBe(true);
  });
});
