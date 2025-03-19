export function getTotalContributedHours(contributionData: any): number {
  const currentDate = new Date();
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.toLocaleString("en-US", { month: "short" });

  return (
    contributionData?.[selectedYear]?.[selectedMonth]?.totalContrHours || 0
  );
}
