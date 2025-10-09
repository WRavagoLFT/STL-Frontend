import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { LoginSectionData } from "../../data/LoginSectionData";

interface ExportRetailDataToPDFProps {
  filterBy: OptionType;
  operationDate: string;
  yearNumber: number;
  receiptDataMetrics: {
    TotalBets: number;
    TotalBettors: number;
    TotalPayout: number;
    TotalRevenue: number;
    TotalWinners: number;
  } | null;
  aacTotalShareAmount: number;
  pcsoTotalShareAmount: number;
  aacTaxTotalShareAmount: number;
  pcsoTaxTotalShareAmount: number;
  netAacTotalAmount: number;
  netPcsoTotalAmount: number;
  receiptData?: {
    Collections?: number;
  };
  aacBreakdown?: {
    ShareTitle?: string;
    Percentage?: number;
    ShareAmount?: number;
  }[];
  pcsoBreakdown?: {
    ShareTitle?: string;
    Percentage?: number;
    ShareAmount?: number;
  }[];
  aacTaxBreakdown?: {
    ShareTitle?: string;
    Percentage?: number;
    ShareAmount?: number;
  }[];
  pcsoTaxBreakdown?: {
    ShareTitle?: string;
    Percentage?: number;
    ShareAmount?: number;
  }[];
  loading?: boolean;
}

interface OptionType {
  label: string;
  value: string;
}

const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => resolve("");
  });
};

export const ExportRetailDataToPDF = ({
  filterBy,
  operationDate,
  yearNumber,
  receiptDataMetrics,
  aacTotalShareAmount = 0,
  pcsoTotalShareAmount = 0,
  aacTaxTotalShareAmount = 0,
  pcsoTaxTotalShareAmount = 0,
  netAacTotalAmount = 0,
  netPcsoTotalAmount = 0,
  receiptData,
  aacBreakdown = [],
  pcsoBreakdown = [],
  aacTaxBreakdown = [],
  pcsoTaxBreakdown = [],
  loading,
}: ExportRetailDataToPDFProps) => {
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "Php0.00";
    return `Php ${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return "0.00%";
    return `${value.toFixed(2)}%`;
  };

  const createBreakdownTable = (
    doc: jsPDF,
    yPosition: number,
    title: string,
    breakdown: {
      ShareTitle?: string;
      Percentage?: number;
      ShareAmount?: number;
    }[],
    totalAmount: number,
    totalPercentage: number
  ) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${title} Breakdown`, 20, yPosition);
    yPosition += 7;

    if (breakdown.length > 0) {
      const tableData = breakdown.map((item) => [
        item.ShareTitle || "N/A",
        formatPercentage(item.Percentage),
        formatCurrency(item.ShareAmount),
      ]);

      tableData.push([
        "TOTAL",
        formatPercentage(totalPercentage),
        formatCurrency(totalAmount),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["Description", "Percentage", "Amount"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [54, 123, 245],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 30 },
          2: { cellWidth: 50 },
        },
        margin: { left: 20, right: 20 },
        styles: {
          cellPadding: 3,
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 7;
    } else {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`No ${title.toLowerCase()} breakdown available`, 20, yPosition);
      yPosition += 7;
    }

    return yPosition;
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // First Page - Title Page (centered as one cohesive unit)
      const title = "STL RETAIL RECEIPT REPORT";

      // Logo configuration
      const logoWidth = 40;
      const logoHeight = 40;
      const logoSpacing = 15; // Reduced spacing between logos

      // Text configuration
      const titleFontSize = 24;
      const subtitleFontSize = 14;
      const textLineHeight = 7;
      const groupPadding = 15; // Space between logos and text

      // Calculate total width of logo group
      const totalLogoWidth = logoWidth * 2 + logoSpacing;

      // Load images
      const pcsoLogo = await loadImage(LoginSectionData.image2);
      const stlLogo = await loadImage(LoginSectionData.image);

      // Calculate the entire group height (logos + text)
      const groupHeight =
        logoHeight +
        groupPadding +
        titleFontSize / 2 + // Approximate title height
        textLineHeight * 3; // Space for 3 text lines

      // Starting Y position to center the whole group vertically
      const startY = (pageHeight - groupHeight) / 2;

      // Add logos (centered horizontally)
      const logosStartX = (pageWidth - totalLogoWidth) / 2;
      doc.addImage(
        pcsoLogo,
        "JPEG",
        logosStartX,
        startY,
        logoWidth,
        logoHeight
      );

      doc.addImage(
        stlLogo,
        "JPEG",
        logosStartX + logoWidth + logoSpacing,
        startY,
        logoWidth,
        logoHeight
      );

      // Add text below logos (centered)
      const textStartY = startY + logoHeight + groupPadding;

      // Title
      doc.setFontSize(titleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text(title, pageWidth / 2, textStartY, { align: "center" });

      // Report date
      doc.setFontSize(subtitleFontSize);
      doc.setFont("helvetica", "normal");
      const reportDate =
        filterBy.value === "Monthly"
          ? new Date(operationDate).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
            })
          : `Year ${yearNumber}`;
      doc.text(
        `Report Period: ${reportDate}`,
        pageWidth / 2,
        textStartY + textLineHeight,
        {
          align: "center",
        }
      );

      // Generated timestamp
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        textStartY + textLineHeight * 2,
        { align: "center" }
      );

      // Add a new page for AAC details
      doc.addPage();
      let yPosition = 20;

      // AAC Section
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("AAC DETAILS", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // AAC Gross Share Breakdown - 51.20% total
      yPosition = createBreakdownTable(
        doc,
        yPosition,
        "AAC Gross Share",
        aacBreakdown,
        aacTotalShareAmount,
        51.2
      );

      // AAC Tax Breakdown - 3.50% total
      yPosition = createBreakdownTable(
        doc,
        yPosition,
        "AAC Taxes",
        aacTaxBreakdown,
        aacTaxTotalShareAmount,
        3.5
      );

      // AAC Net Income
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("AAC Net Income", 20, yPosition);
      yPosition += 7;

      autoTable(doc, {
        startY: yPosition,
        body: [[formatCurrency(netAacTotalAmount)]],
        theme: "grid",
        margin: { left: 20, right: 20 },
        styles: {
          cellPadding: 3,
        },
      });

      // Add a new page for PCSO details
      doc.addPage();
      yPosition = 20;

      // PCSO Section
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("PCSO DETAILS", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // PCSO Gross Share Breakdown - 26.10% total
      yPosition = createBreakdownTable(
        doc,
        yPosition,
        "PCSO Gross Share",
        pcsoBreakdown,
        pcsoTotalShareAmount,
        26.1
      );

      // PCSO Tax Breakdown - 47.71% total
      yPosition = createBreakdownTable(
        doc,
        yPosition,
        "PCSO Taxes",
        pcsoTaxBreakdown,
        pcsoTaxTotalShareAmount,
        47.71
      );

      // PCSO Net Income
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PCSO Net Income", 20, yPosition);
      yPosition += 7;

      autoTable(doc, {
        startY: yPosition,
        body: [[formatCurrency(netPcsoTotalAmount)]],
        theme: "grid",
        margin: { left: 20, right: 20 },
        styles: {
          cellPadding: 3,
        },
      });

      // Save the PDF
      doc.save(`STL_Retail_Receipt_${reportDate.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <button
      onClick={handleExportPDF}
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
