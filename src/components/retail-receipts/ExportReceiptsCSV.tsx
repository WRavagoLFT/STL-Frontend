import * as XLSX from "xlsx";
import { useRetailReceiptProcessor } from "~/components/retail-receipts/useRetailReceiptProcessor";
import { Button } from "@mui/material";
import { buttonStylesretail } from "~/styles/theme";

export interface ExportRetailDataToExcelProps {
  receiptData: any;
  receiptDataMetrics: any;
  filterBy: { value: string };
  operationDate: string;
  yearNumber: number;
}

// Title descriptions
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
    yearNumber,
  );

  const handleDownloadExcel = (receiptData: any, receiptDataMetrics: any) => {
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

      receiptData?.Collections || 0,
      receiptDataMetrics?.TotalBets || 0,
      receiptDataMetrics?.TotalBettors || 0,
      receiptDataMetrics?.TotalPayout || 0,
      receiptDataMetrics?.TotalRevenue || 0,
      receiptDataMetrics?.TotalWinners || 0,
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

    // Create worksheet and download
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto-fit column widths
    const columnWidths = sheetData[0].map((_: any, colIndex: number) => {
      const column = sheetData.map((row) => {
        const value = row[colIndex];
        return value !== undefined && value !== null ? value.toString() : "";
      });
      const maxLength = Math.max(...column.map((cell) => cell.length), 40);
      return { wch: maxLength + 4 };
    });

    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Retail Receipt");

    XLSX.writeFile(workbook, `RetailReceipt_${new Date().toISOString()}.xlsx`);
  };

  return (
    <Button
      sx={buttonStylesretail}
      variant="contained"
        onClick={() => handleDownloadExcel(receiptData, receiptDataMetrics)}
    >
      Download CSV
    </Button>
  );
};

export default ExportRetailDataToExcel;
