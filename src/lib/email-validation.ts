import { z } from "zod";

/**
 * Disposable / temporary email domains (common offenders).
 * This list covers the most popular throwaway services.
 */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
  "throwaway.email", "yopmail.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "dispostable.com", "maildrop.cc", "10minutemail.com", "trashmail.com",
  "trashmail.net", "trashmail.me", "mailnesia.com", "temp-mail.org", "fakeinbox.com",
  "tempail.com", "emailondeck.com", "getnada.com", "mohmal.com", "discard.email",
  "mailcatch.com", "mytemp.email", "burnermail.io", "inboxbear.com", "mintemail.com",
  "spamgourmet.com", "jetable.org", "harakirimail.com", "mailexpire.com",
  "safetymail.info", "filzmail.com", "devnullmail.com", "tempmailo.com",
  "crazymailing.com", "mailforspam.com", "tempr.email", "binkmail.com",
  "tmail.ws", "tmpmail.org", "tmpmail.net", "emailfake.com", "generator.email",
  "guerrillamail.de", "guerrillamail.biz", "mailsac.com", "mailslurp.com",
  "receiveee.com", "33mail.com", "mailtothis.com", "spam4.me", "trash-mail.com",
]);

/** Domains that are almost certainly not real email providers */
const SUSPICIOUS_TLD = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz"];

/** Bot / fake patterns in the local part (before @) */
const BOT_PATTERNS = [
  /^test[0-9]*@/i,
  /^user[0-9]*@/i,
  /^admin[0-9]*@/i,
  /^fake[0-9]*@/i,
  /^bot[0-9]*@/i,
  /^spam[0-9]*@/i,
  /^noreply@/i,
  /^no-reply@/i,
  /^root@/i,
  /^null@/i,
  /^void@/i,
  /^nobody@/i,
  /^temp[0-9]*@/i,
  /^asdf+@/i,
  /^qwerty@/i,
  /^aaa+@/i,
  /^xxx+@/i,
  /^zzz+@/i,
  /^123+@/i,
];

/**
 * Check if the local part looks like keyboard mashing / random noise.
 * Heuristic: too many consecutive consonants (≥6) or too many digits in a row (≥8).
 */
const looksLikeGibberish = (local: string): boolean => {
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(local)) return true;
  if (/\d{8,}/.test(local)) return true;
  return false;
};

/**
 * Validates an email string beyond simple format checking.
 * Returns `true` if the email passes, or an error message string if not.
 */
export const validateEmail = (email: string): true | string => {
  const trimmed = email.trim().toLowerCase();

  // basic format
  const basicResult = z.string().email().safeParse(trimmed);
  if (!basicResult.success) return "Please enter a valid email address.";

  const [local, domain] = trimmed.split("@");
  if (!local || !domain) return "Please enter a valid email address.";

  // length limits
  if (local.length > 64) return "Email local part is too long.";
  if (domain.length > 255) return "Email domain is too long.";

  // disposable domain
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return "Temporary or disposable email addresses are not allowed.";
  }

  // suspicious TLD
  if (SUSPICIOUS_TLD.some((tld) => domain.endsWith(tld))) {
    return "This email domain is not accepted. Please use a different provider.";
  }

  // bot / fake patterns
  if (BOT_PATTERNS.some((re) => re.test(trimmed))) {
    return "This email looks like a test or bot address. Please use your real email.";
  }

  // gibberish local part
  if (looksLikeGibberish(local)) {
    return "This email doesn't look real. Please use a valid email address.";
  }

  // plus-alias abuse (allow single +, block 2+)
  if ((local.match(/\+/g) || []).length > 1) {
    return "Too many plus aliases in this email address.";
  }

  return true;
};

/**
 * Zod refinement you can chain onto any string schema:
 *   z.string().email().refine(...emailRefinement)
 */
export const emailRefinement = [
  (val: string) => validateEmail(val) === true,
  (val: string) => ({ message: validateEmail(val) as string }),
] as const;

/**
 * Ready-to-use Zod schema for validated emails.
 */
export const safeEmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(320, "Email is too long.")
  .email("Please enter a valid email address.")
  .refine((val) => validateEmail(val) === true, (val) => ({
    message: (validateEmail(val) as string) || "Invalid email.",
  }));
