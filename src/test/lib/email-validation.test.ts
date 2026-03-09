import { describe, it, expect } from "vitest";
import { validateEmail } from "@/lib/email-validation";

describe("Email Validation", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("test.user@uni.edu")).toBe(true);
  });

  it("rejects empty/invalid emails", () => {
    expect(validateEmail("")).not.toBe(true);
    expect(validateEmail("notanemail")).not.toBe(true);
  });

  it("rejects disposable email providers", () => {
    expect(validateEmail("user@tempmail.com")).not.toBe(true);
    expect(validateEmail("user@mailinator.com")).not.toBe(true);
  });

  it("accepts legitimate providers", () => {
    expect(validateEmail("user@gmail.com")).toBe(true);
  });
});
