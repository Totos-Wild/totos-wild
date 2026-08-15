export function parseNumber(numberStr) {
  return parseFloat(numberStr.toString().replace(",", "."));
}

export const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function truncate(text, maxLength = 40) {
  if (!text) return "";
  return text.length > maxLength
    ? text.slice(0, maxLength) + "…"
    : text;
}