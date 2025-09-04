export function parseDateWithTimezone(dateStr?: string) {
  if (!dateStr) return undefined;
  const safeStr = dateStr.match(/[zZ]|[+-]\d{2}:?\d{2}$/)
    ? dateStr
    : dateStr + "Z";
  const d = new Date(safeStr);
  return isNaN(d.getTime()) ? undefined : d;
}