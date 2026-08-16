
/**
 * string -> number
 * @param {string} numberStr - The number string to parse
 * @returns {number} The parsed number
 */
export function parseNumber(numberStr) {
  return parseFloat(numberStr.toString().replace(",", "."));
}

/**
 * number | string -> string
 * @param {number | string} number - The number to format
 * @returns {string} The formatted number
 */
export function formatNumber(number) {
  number = parseNumber(number);

  const numberFormatter = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return numberFormatter.format(number);
}

export function truncate(text, maxLength = 40) {
  if (!text) return "";
  return text.length > maxLength
    ? text.slice(0, maxLength) + "…"
    : text;
}