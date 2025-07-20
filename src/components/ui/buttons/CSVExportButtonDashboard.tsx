import React from "react";
import * as XLSX from "xlsx";

interface GenericExportButtonProps {
  data: any[];
  headers: string[];
  title: string;
  getRowData: (item: any) => (string | number)[];
  filename?: string;
  loading?: boolean;
}

const GenericCSVExportButton: React.FC<GenericExportButtonProps> = ({
  data,
  headers,
  title,
  getRowData,
  filename,
  loading
}) => {
  const exportToExcel = () => {
    const currentDateTime = new Date().toLocaleString();

    const worksheetData = [
      [title],
      [`Generated on: ${currentDateTime}`],
      [],
      headers,
      ...data.map(getRowData),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ];

    const colWidths = headers.map((_, colIndex) => {
      const columnData = [
        headers[colIndex],
        ...data.map((item) => {
          const value = getRowData(item)[colIndex];
          return value != null ? value.toString() : "";
        }),
      ];
      const maxLength = columnData.reduce(
        (max, val) => Math.max(max, val.length),
        10
      );
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const link = document.createElement("a");
    const file = `${(filename ?? title).replace(/\s+/g, "_").toLowerCase()}.xlsx`;
    link.href = URL.createObjectURL(blob);
    link.download = file;
    link.click();
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={loading}
      className={`rounded-lg px-6 py-2 text-[0.8rem] text-white transition
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0038A8] hover:bg-blue-700"}`}
    >
      Export as CSV
    </button>
  );
};

export default GenericCSVExportButton;
