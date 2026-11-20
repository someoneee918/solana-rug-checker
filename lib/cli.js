/**
 * Parse and validate the --fail-on risk threshold.
 *
 * Must be an integer between 0 and 100 inclusive.
 * Returns 60 when value is undefined.
 * Throws an Error for non-integers, booleans, or values out of range.
 */
export function parseFailOn(value) {
  if (value === undefined) return 60;
  if (typeof value === "boolean" || typeof value === "object" || value === null) {
    throw new Error(`--fail-on must be a whole number between 0 and 100 (got "${value}").`);
  }
  const str = String(value).trim();
  if (!/^\d+$/.test(str)) {
    throw new Error(`--fail-on must be a whole number between 0 and 100 (got "${value}").`);
  }
  const n = Number(str);
  if (n < 0 || n > 100) {
    throw new Error(`--fail-on must be between 0 and 100 (got ${n}).`);
  }
  return n;
}
