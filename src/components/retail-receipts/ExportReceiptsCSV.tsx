import * as XLSX from "xlsx";
import { useRetailReceiptProcessor } from "@/components/retail-receipts/RetailReceiptProcessor";

export interface ExportRetailDataToExcelProps {
  receiptData: any;
  receiptDataMetrics: any;
  filterBy: { value: string };
  operationDate: string;
  yearNumber?: number;
  loading?: boolean;
}

const AAC_GROSS_TITLES = [
  "Authorized Agent Share",
  "Commission of Salesforce",
  "Net Prize fund",
];

const PCSO_GROSS_TITLES = [
  "Printing cost to PCSO",
  "PCSO Charity fund",
  "PCSO Operating fund",
];

const AAC_TAX_TITLES = [
  "Expanded witholding tax from Agency Commission",
  "VAT witholding tax from Agency commission",
  "Expanded witholding tax from Salesforce commission",
  "VAT witholding tax from Salesforce commission",
];

const PCSO_TAX_TITLES = [
  "Expanded witholding tax from Agency Commission",
  "VAT witholding tax from Agency commission",
  "Expanded witholding tax from Salesforce commission",
  "VAT witholding tax from Salesforce commission",
  "Prize fund tax",
  "Documentary stamp tax",
];

const ExportRetailDataToExcel = ({
  receiptData,
  receiptDataMetrics,
  filterBy,
  operationDate,
  yearNumber,
  loading
}: ExportRetailDataToExcelProps) => {
  const {
    aacBreakdown,
    aacTotalPercentage,
    aacTotalShareAmount,
    pcsoBreakdown,
    pcsoTotalPercentage,
    pcsoTotalShareAmount,
    aacTaxBreakdown,
    aacTaxTotalPercentage,
    aacTaxTotalShareAmount,
    pcsoTaxBreakdown,
    pcsoTaxTotalPercentage,
    pcsoTaxTotalShareAmount,
    netAacTotalAmount,
    netAacTotalPercentage,
    netPcsoTotalAmount,
    netPcsoTotalPercentage,
  } = useRetailReceiptProcessor(
    receiptData,
    filterBy.value,
    operationDate,
    yearNumber
  );

  const handleDownloadExcel = () => {
    if (!receiptData) return;

    const sheetData: any[] = [];

    // 1. Summary Section
    sheetData.push(["Summary"]);
    sheetData.push([
      "Date",
      "Collections",
      "Total Bets",
      "Total Bettors",
      "Total Payout",
      "Total Revenue",
      "Total Winners",
    ]);
    sheetData.push([
      `Generated Date: ${new Date().toLocaleString()}`,
      receiptData?.Collections ?? 0,
      receiptDataMetrics?.TotalBets ?? 0,
      receiptDataMetrics?.TotalBettors ?? 0,
      receiptDataMetrics?.TotalPayout ?? 0,
      receiptDataMetrics?.TotalRevenue ?? 0,
      receiptDataMetrics?.TotalWinners ?? 0,
    ]);
    sheetData.push([]);

    // 2. AAC Share Section
    sheetData.push(["AAC Share Breakdown"]);
    sheetData.push(["Description", "Percentage", "Share Amount"]);
    aacBreakdown.forEach((item: any, index: number) => {
      sheetData.push([
        AAC_GROSS_TITLES[index] || `${item.Percentage}% Share`,
        `${item.Percentage}%`,
        item.ShareAmount,
      ]);
    });
    sheetData.push(["Total", `${aacTotalPercentage}%`, aacTotalShareAmount]);
    sheetData.push([]);

    // 3. PCSO Share Section
    sheetData.push(["PCSO Share Breakdown"]);
    sheetData.push(["Description", "Percentage", "Share Amount"]);
    pcsoBreakdown.forEach((item: any, index: number) => {
      sheetData.push([
        PCSO_GROSS_TITLES[index] || `${item.Percentage}% Share`,
        `${item.Percentage}%`,
        item.ShareAmount,
      ]);
    });
    sheetData.push(["Total", `${pcsoTotalPercentage}%`, pcsoTotalShareAmount]);
    sheetData.push([]);

    // 4. AAC Tax Section
    sheetData.push(["AAC Tax Breakdown"]);
    sheetData.push(["Description", "Percentage", "Tax Amount"]);
    aacTaxBreakdown.forEach((item: any, index: number) => {
      sheetData.push([
        AAC_TAX_TITLES[index] || `${item.Percentage}% Tax`,
        `${item.Percentage}%`,
        item.ShareAmount,
      ]);
    });
    sheetData.push([
      "Total",
      `${aacTaxTotalPercentage}%`,
      aacTaxTotalShareAmount,
    ]);
    sheetData.push([]);

    // 5. PCSO Tax Section
    sheetData.push(["PCSO Tax Breakdown"]);
    sheetData.push(["Description", "Percentage", "Tax Amount"]);
    pcsoTaxBreakdown.forEach((item: any, index: number) => {
      sheetData.push([
        PCSO_TAX_TITLES[index] || `${item.Percentage}% Tax`,
        `${item.Percentage}%`,
        item.ShareAmount,
      ]);
    });
    sheetData.push([
      "Total",
      `${pcsoTaxTotalPercentage}%`,
      pcsoTaxTotalShareAmount,
    ]);
    sheetData.push([]);

    // 6. Net Shares Section
    sheetData.push(["Net Shares"]);
    sheetData.push(["Type", "Net Percentage", "Net Amount"]);
    sheetData.push([
      "Net AAC Share",
      `${netAacTotalPercentage}%`,
      netAacTotalAmount,
    ]);
    sheetData.push([
      "Net PCSO Share",
      `${netPcsoTotalPercentage}%`,
      netPcsoTotalAmount,
    ]);

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto-fit column widths
    const columnWidths = sheetData[0].map((_: any, colIndex: number) => {
      const column = sheetData.map((row) => {
        const value = row[colIndex];
        return value !== undefined && value !== null ? value.toString() : "";
      });
      const maxLength = Math.max(...column.map((cell) => cell.length), 10);
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = columnWidths;

    // Create workbook and write file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Retail Receipt");

    XLSX.writeFile(workbook, `RetailReceipt_${new Date().toISOString()}.xlsx`);
  };

  return (
    <button
      onClick={handleDownloadExcel}
      className="w-full bg-[#0038A8] text-white px-4 py-2 rounded-md hover:bg-[#002e82] transition-colors duration-200 text-xs font-semibold flex items-center justify-center"
      disabled={loading}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      ) : null}
      {loading ? "Loading..." : "Download as CSV File"}
    </button>
  );
};

export default ExportRetailDataToExcel;
