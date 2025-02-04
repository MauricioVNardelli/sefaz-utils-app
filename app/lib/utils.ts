export function FormattDate(prValue: string): string {
  const day = prValue[0] + prValue[1];
  const month = prValue[2] + prValue[3];
  const year = prValue.substring(4, 8);

  return day + "/" + month + "/" + year;
}
