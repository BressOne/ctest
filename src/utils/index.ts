export const getStartOfTheMonth = ({
  month,
  year,
}: {
  month: number;
  year: number;
}): Date => new Date(year, month - 1, 1);
export const getEndOfTheMonth = ({
  month,
  year,
}: {
  month: number;
  year: number;
}): Date => {
  const momentBeforeMidnight = [23, 59, 59, 999];
  return new Date(year, month, 0, ...momentBeforeMidnight);
};
