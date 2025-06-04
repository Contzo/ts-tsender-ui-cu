import { describe, it, expect } from "vitest"
import { splitMultipleInputs } from "../helpers"
import { calculateTotalAmount } from "./calculateTotalAmount"

describe("splitMultipleInputs", () => {
  it("splits by newlines and commas", () => {
    expect(splitMultipleInputs("1,2\n3, 4\n5")).toEqual(["1", "2", "3", "4", "5"])
  })

  it("trims whitespace and ignores empty entries", () => {
    expect(splitMultipleInputs(" 1 ,  \n  ,2")).toEqual(["1", "2"])
  })

  it("returns empty array for empty input", () => {
    expect(splitMultipleInputs("")).toEqual([])
  })
})

describe("calculateTotalAmount", () => {
  it("returns 0 for empty input", () => {
    expect(calculateTotalAmount("")).toBe(BigInt(0))
  })

  it("handles single normal integer", () => {
    expect(calculateTotalAmount("42")).toBe(BigInt(42))
  })

  it("handles multiple integers separated by comma and newline", () => {
    expect(calculateTotalAmount("10\n20,30")).toBe(BigInt(60))
  })

  it("handles valid scientific notation", () => {
    expect(calculateTotalAmount("1e3")).toBe(BigInt(1000))
  })

  it("handles mixed values (normal + sci notation)", () => {
    expect(calculateTotalAmount("500\n1e2,400")).toBe(BigInt(500 + 100 + 400))
  })

  it("skips malformed scientific notation", () => {
    expect(calculateTotalAmount("1e-5, 2e1001, 3e1.5")).toBe(BigInt(0))
  })

  it("skips non-integer and negative numbers", () => {
    expect(calculateTotalAmount("-50, 12.34, abc")).toBe(BigInt(0))
  })

  it("handles extremely large exponent safely", () => {
    const result = calculateTotalAmount("1e18")
    expect(result).toBe(BigInt(1000000000000000000))
  })

  it("ignores invalid exponent syntax", () => {
    expect(calculateTotalAmount("5e")).toBe(BigInt(0))
  })

  it("ignores decimal numbers", () => {
    expect(calculateTotalAmount("1.1, 2.5")).toBe(BigInt(0))
  })
})

