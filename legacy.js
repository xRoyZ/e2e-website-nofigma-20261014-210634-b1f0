// Helpers kept for data written by the older import format.

function parseLegacy(text) {
  return JSON.parse(text);
}

function legacyTotal(values) {
  let total = 0;
  for (const value of values) total += value;
  return total;
}
