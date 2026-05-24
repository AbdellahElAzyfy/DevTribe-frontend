export function formatCompactCount(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}
