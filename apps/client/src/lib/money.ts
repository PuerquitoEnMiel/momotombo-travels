/**
 * Canonical money formatting for the whole app. Never hand-roll prices:
 * `${x}.00 USD` breaks on fractional values and reads inconsistently.
 */
const usdFormatter = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const plainFormatter = new Intl.NumberFormat("es-NI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** e.g. formatMoney(120.5) -> "US$120.50" */
export function formatMoney(amount: number, currency: string = "USD"): string {
  if (currency === "USD") return usdFormatter.format(amount);
  return `${currency} ${plainFormatter.format(amount)}`;
}

/** e.g. formatMoneyPlain(120.5) -> "120.50" (when the label carries the currency) */
export function formatMoneyPlain(amount: number): string {
  return plainFormatter.format(amount);
}
