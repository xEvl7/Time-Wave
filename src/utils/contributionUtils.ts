export function getTotalContributedHours(contributionData: any): number {
  if (!contributionData || typeof contributionData !== "object") return 0;

  const currentDate = new Date();
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.toLocaleString("en-US", { month: "short" });

  return (
    contributionData?.[selectedYear]?.[selectedMonth]?.totalContrHours ?? 0
  );
}
