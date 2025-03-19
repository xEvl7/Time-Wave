export const getLastDayOfMonth = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const nextMonthFirstDay = new Date(year, month + 1, 1);
  const lastDay = new Date(nextMonthFirstDay.getTime() - 1);

  return `${lastDay.getDate()} ${lastDay.toLocaleString("default", {
    month: "short",
  })} ${lastDay.getFullYear()}`;
};
