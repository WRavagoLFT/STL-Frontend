import { Share } from "~/types/types";
/**
 * Generic function to process shares from any source (AAC, PCSO, etc.)
 * 
 * @param shareData - The object containing share data (e.g. data?.data?.Receipts?.AAC)
 * @param titlesToInclude - Array of ShareTitle strings to include in processing
 * @param year - Year to filter OperationDate
 * @param month - Month to filter OperationDate (1-12)
 */

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

        // Handle yearly if month is undefined or 0
        const operationDate = !month || month === 0
          ? new Date(year, 0, 1).getTime() // Jan 1 of the year
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
          // console.log(
          //   `Skipped share '${title}' due to ShareType mismatch:`,
          //   share.ShareType
          // );
        } else {
          //console.log(`No share data found for title: ${title}`);
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

// function in calculating net income ================
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
      netPercentage: grossPercentage + taxPercentage,
    };
  } else {
    // PCSO case
    return {
      netAmount: grossAmount + taxAmount,
      netPercentage: grossPercentage + taxPercentage,
    };
  }
}

