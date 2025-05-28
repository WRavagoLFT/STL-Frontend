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
  month: number,
  shareType: number // no default, must be provided
): { totalPercentage: number; totalShareAmount: number; breakdown: Share[] } {
  // console.log("processShares called with:", { year, month, shareType });
  // console.log("Titles:", titles);
  // console.log("Data keys:", data ? Object.keys(data) : "No data");

  const result: Share[] = titles
    .map((title) => {
      const share = data?.[title];
      // console.log(`Processing title: ${title}`, share);

      if (share && share.ShareType === shareType) {
        const processedShare = {
          ShareTitle: title,
          ShareType: share.ShareType,
          Percentage: share.Percentage,
          ShareAmount: share.ShareAmount,
          OperationDate: new Date(year, month - 1, 1).getTime(),
          OperatorBreakdown: share.OperatorBreakdown ?? {},
        };
        // console.log("Accepted share:", processedShare);
        return processedShare;
      } else {
        if (share) {
          console.log(
            `Skipped share '${title}' due to ShareType mismatch:`,
            share.ShareType
          );
        } else {
          console.log(`No share data found for title: ${title}`);
        }
        return null;
      }
    })
    .filter(Boolean) as Share[];

  const totalPercentage = result.reduce((sum, item) => sum + item.Percentage, 0);
  const totalShareAmount = result.reduce((sum, item) => sum + item.ShareAmount, 0);

  // console.log("Final breakdown:", result);
  // console.log("Total Percentage:", totalPercentage);
  // console.log("Total Share Amount:", totalShareAmount);

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
  taxPercentage: number
) {
  return {
    netAmount: grossAmount - taxAmount,
    netPercentage: grossPercentage - taxPercentage,
  };
}

