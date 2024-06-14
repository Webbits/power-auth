export const secondsDiff = (
  date1: Date | string,
  date2: Date = new Date()
): number => {
  date1 = typeof date1 === "string" ? new Date(date1) : date1;

  const date1Seconds = date1.getTime() / 1000;
  const date2Seconds = date2.getTime() / 1000;

  return Math.abs(date1Seconds - date2Seconds);
};
