import { describe, it, expect } from "vitest";
import { validateEmail } from "@/lib/email-validation";

describe("Email Validation", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("alice@example.com")).toBe(true);
    expect(validateEmail("john.doe@uni.edu")).toBe(true);
  });

  it("rejects empty/invalid emails", () => {
    expect(validateEmail("")).not.toBe(true);
    expect(validateEmail("notanemail")).not.toBe(true);
  });

  it("rejects disposable email providers", () => {
    expect(validateEmail("alice@tempmail.com")).not.toBe(true);
    expect(validateEmail("alice@mailinator.com")).not.toBe(true);
  });

  it("accepts legitimate providers", () => {
    expect(validateEmail("alice@gmail.com")).toBe(true);
  });
});
