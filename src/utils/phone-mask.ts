export function maskPhone(value: string): string {
  let cleaned = value.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length === 0) return "";
  if (cleaned.length < 3) return `(${cleaned}`;
  if (cleaned.length < 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length < 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
    7,
    11
  )}`;
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "");
}
