import { Share } from "@/types/types";

export function processShares(
  data: any,
  titles: string[],
  year: number,
  month?: number,
  shareType?: number
): { totalPercentage: number; totalShareAmount: number; breakdown: Share[] } {
  const st = shareType ?? 1;
  const result: Share[] = titles
    .map((title) => {
      const share = data?.[title];
      if (share && share.ShareType === shareType) {

        const operationDate = !month || month === 0
          ? new Date(year, 0, 1).getTime()
          : new Date(year, month - 1, 1).getTime();

        const processedShare = {
          ShareTitle: title,
          ShareType: share.ShareType,
          Percentage: share.Percentage,
          ShareAmount: share.ShareAmount,
          OperationDate: operationDate,
          OperatorBreakdown: share.OperatorBreakdown ?? {},
        };
        return processedShare;
      } else {
        if (share) {

        } else {
          //console.error(`No share data found for title: ${title}`);
        }
        return null;
      }
    })
    .filter(Boolean) as Share[];

  const totalPercentage = result.reduce((sum, item) => sum + item.Percentage, 0);
  const totalShareAmount = result.reduce((sum, item) => sum + item.ShareAmount, 0);

  return {
    totalPercentage,
    totalShareAmount,
    breakdown: result,
  };
}

export function calculateNetIncome(
  grossAmount: number,
  grossPercentage: number,
  taxAmount: number,
  taxPercentage: number,
  mode: "AAC" | "PCSO" = "AAC"
): { netAmount: number; netPercentage: number } {
  if (mode === "AAC") {
    return {
      netAmount: grossAmount - taxAmount,
      netPercentage: grossPercentage - taxPercentage,
    };
  } else {
    return {
      netAmount: grossAmount + taxAmount,
      netPercentage: grossPercentage + taxPercentage,
    };
  }
}

