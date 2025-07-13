import React from "react";
import { Button } from "@mui/material";
import { buttonStyles } from "@/styles/theme";
import { CSVExportButtonProps } from "@/types/interfaces";
import { getRoleName, getUserStatus } from "@/hooks/dashboarddata";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const convertToExcelData = (data: any[], columns: any[], operatorMap: any[]) => {
  return data.map((item) => {
    const row: Record<string, any> = {};

    columns.forEach((col) => {
      const { key, label } = col;

      if (key === "OperatorDetails.OperatorName") {
        row[label] = operatorMap[item.OperatorId]?.OperatorName ?? "No operator assigned";
      } else if (key === "Status") {
        const sevenDaysAgo = dayjs().subtract(7, "days");
        row[label] = getUserStatus(item, sevenDaysAgo);
      } else if (key === "Cities") {
        row[label] = Array.isArray(item.Cities)
          ? item.Cities.map((c: any) => c.CityName).join(", ")
          : "No cities";
      } else if (key === "DateOfRegistration") {
        row[label] = item.DateOfRegistration
          ? dayjs(item.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")
          : "";
      } else if (key === "DateOfOperation") {
        row[label] = item.DateOfOperation
          ? dayjs(item.DateOfOperation).format("YYYY/MM/DD HH:mm:ss")
          : "";
      } else {
        const value = key.split(".").reduce((obj: any, k: string) => obj?.[k], item);
        row[label] = value ?? "";
      }
    });

    return row;
  });
};

const CSVExportButtonTable: React.FC<CSVExportButtonProps> = ({
  statsPerRegion,
  pageType,
  roleId,
  columns,
  operatorMap,
}) => {
  const downloadExcel = () => {
    const baseRole = getRoleName(roleId ?? 0);
    const pluralRole = baseRole.endsWith("s") ? baseRole : baseRole + "s";
    const readablePageType = pageType ?? "Summary";

    const title = `${pluralRole} Data Table Summary`;
    const sheetTitle = `${pluralRole} Dashboard`;

    const currentDateTime = new Date().toLocaleString();

    const excelData = convertToExcelData(
      statsPerRegion ?? [],
      columns ?? [],
      operatorMap ?? []
    );

    const headers = columns?.map((col) => col.label);

    const worksheetData = [
      [title],
      [`Generated on: ${currentDateTime}`],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add table data starting from A4
    XLSX.utils.sheet_add_json(worksheet, excelData, {
      origin: "A4",
      skipHeader: false,
    });

    // Merge title and timestamp
    const totalColumns = columns?.length || 10;
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalColumns - 1 } },
    ];

    // Set column widths
    const colWidths = headers?.map((header, colIndex) => {
      const columnData = [
        header,
        ...excelData.map((item) => item[header] ?? ""),
      ];
      const maxLength = columnData.reduce(
        (max, val) => Math.max(max, val.toString().length),
        10
      );
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

    XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_").toLowerCase()}.xlsx`);
  };

  return (
    <Button sx={buttonStyles} variant="contained" onClick={downloadExcel}>
      Export as Excel
    </Button>
  );
};

export default CSVExportButtonTable;
