import React from "react";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";
import * as XLSX from "xlsx";

interface GenericExportButtonProps {
  data: any[];
  headers: string[];
  title: string;
  getRowData: (item: any) => (string | number)[];
  filename?: string;
}

const GenericCSVExportButton: React.FC<GenericExportButtonProps> = ({
  data,
  headers,
  title,
  getRowData,
  filename
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

    // Merge the title and date rows across all header columns
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const link = document.createElement("a");
    const file = `${(filename ?? title).replace(/\s+/g, "_").toLowerCase()}.xlsx`;
    link.href = URL.createObjectURL(blob);
    link.download = file;
    link.click();
  };

  return (
    <Button sx={buttonStyles} variant="contained" onClick={exportToExcel}>
      Export as CSV
    </Button>
  );
};

export default GenericCSVExportButton;

