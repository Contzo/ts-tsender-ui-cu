import { afterAll, describe, expect, test, vi } from "vitest";
import { splitMultipleInputs } from "./helpers";
import { calculateTotalAmount } from "./calculateTotalAmount";

describe("splitMultipleInputs", () => {
  test("should handle empty string", () => {
    expect(splitMultipleInputs("")).toEqual([]);
  });

  test("should handle single value", () => {
    expect(splitMultipleInputs("100")).toEqual(["100"]);
  });

  test("should split comma-separated values", () => {
    expect(splitMultipleInputs("100,200,300")).toEqual(["100", "200", "300"]);
  });

  test("should split newline-separated values", () => {
    expect(splitMultipleInputs("100\n200\n300")).toEqual(["100", "200", "300"]);
  });

  test("should handle mixed separators", () => {
    expect(splitMultipleInputs("100\n200,300")).toEqual(["100", "200", "300"]);
  });

  test("should trim whitespace", () => {
    expect(splitMultipleInputs(" 100 , 200 \n 300 ")).toEqual([
      "100",
      "200",
      "300",
    ]);
  });

  test("should filter empty entries", () => {
    expect(splitMultipleInputs("\n100,\n,200\n\n")).toEqual(["100", "200"]);
  });

  test("should handle trailing separators", () => {
    expect(splitMultipleInputs("100,200,")).toEqual(["100", "200"]);
  });
});

describe("calculateTotalAmount", () => {
  // Mock console.log to verify output
  const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  test("should return 0n for empty input", () => {
    expect(calculateTotalAmount("")).toBe(BigInt(0));
  });

  test("should handle single value", () => {
    expect(calculateTotalAmount("100")).toBe(BigInt(100));
  });

  test("should sum comma-separated values", () => {
    expect(calculateTotalAmount("100,200,300")).toBe(BigInt(600));
  });

  test("should sum newline-separated values", () => {
    expect(calculateTotalAmount("100\n200\n300")).toBe(BigInt(600));
  });

  test("should handle mixed separators", () => {
    expect(calculateTotalAmount("100\n200,300")).toBe(BigInt(600));
  });

  test("should handle whitespace", () => {
    expect(calculateTotalAmount(" 100 , 200 \n 300 ")).toBe(BigInt(600));
  });

  test("should handle large numbers", () => {
    const bigNum = "9007199254740993"; // Number larger than Number.MAX_SAFE_INTEGER
    expect(calculateTotalAmount(`${bigNum},1`)).toBe(
      BigInt(bigNum) + BigInt(1)
    );
  });

  test("should log the result", () => {
    calculateTotalAmount("100,200");
    expect(consoleSpy).toHaveBeenCalledWith(BigInt(300));
  });

  test("should throw for invalid numbers", () => {
    expect(() => calculateTotalAmount("abc")).toThrow();
    expect(() => calculateTotalAmount("100, invalid")).toThrow();
  });

  test("should throw for decimal numbers", () => {
    expect(() => calculateTotalAmount("10.5")).toThrow();
  });

  // Restore console mock after tests
  afterAll(() => {
    consoleSpy.mockRestore();
  });
});
