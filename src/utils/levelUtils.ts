export const calculateLevel = (hours: number): number => {
  if (hours <= 10) return 1;
  if (hours <= 20) return 2;
  if (hours <= 30) return 3;
  return 4;
};
