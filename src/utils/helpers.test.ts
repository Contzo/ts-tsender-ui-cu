import { describe, it, expect } from "vitest";
import { splitMultipleInputs, scientificNotationToBigInt } from "@/utils"; // adjust the path if needed

describe("splitMultipleInputs", () => {
  it("splits by commas", () => {
    const result = splitMultipleInputs("a,b,c");
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("splits by newlines", () => {
    const result = splitMultipleInputs("a\nb\nc");
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("splits by mixed commas and newlines", () => {
    const result = splitMultipleInputs("a\nb,c\n d ");
    expect(result).toEqual(["a", "b", "c", "d"]);
  });

  it("trims whitespace and filters empty values", () => {
    const result = splitMultipleInputs(" a , \n , b , ");
    expect(result).toEqual(["a", "b"]);
  });

  it("returns empty array for empty string", () => {
    expect(splitMultipleInputs("")).toEqual([]);
  });
});

describe("scientificNotationToBigInt", () => {
  it("converts valid scientific notation", () => {
    const input = ["1e3", "2e2"];
    const result = scientificNotationToBigInt(input);
    expect(result).toEqual(["1000", "200"]);
  });

  it("preserves valid integers as-is", () => {
    const input = ["100", "200"];
    const result = scientificNotationToBigInt(input);
    expect(result).toEqual(["100", "200"]);
  });

  it("throws on invalid strings", () => {
    const input = ["abc"];
    expect(() => scientificNotationToBigInt(input)).toThrow(
      "Invalid value: abc"
    );
  });

  it("throws on malformed scientific notation", () => {
    const input = ["1e"];
    expect(() => scientificNotationToBigInt(input)).toThrow();
  });

  it("handles large exponent values", () => {
    const input = ["1e18"];
    const result = scientificNotationToBigInt(input);
    expect(result[0]).toBe("1000000000000000000");
  });

  it("throws on negative exponents", () => {
    const input = ["1e-3"];
    expect(() => scientificNotationToBigInt(input)).toThrow(
      "Invalid value: 1e-3"
    );
  });
  it("Passes and returns an array of string numbers", () => {
    const input = ["100", "5e3", "245", "8e2"];
    const result = scientificNotationToBigInt(input);
    expect(result).toEqual(["100", "5000", "245", "800"]);
  });
});
