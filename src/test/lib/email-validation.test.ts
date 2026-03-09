import { describe, it, expect } from "vitest";
import { isValidEmail, isDisposableEmail } from "@/lib/email-validation";

describe("Email Validation", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@uni.edu")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("detects disposable email providers", () => {
    expect(isDisposableEmail("user@tempmail.com")).toBe(true);
    expect(isDisposableEmail("user@mailinator.com")).toBe(true);
  });

  it("accepts legitimate providers", () => {
    expect(isDisposableEmail("user@gmail.com")).toBe(false);
    expect(isDisposableEmail("user@university.edu")).toBe(false);
  });
});
