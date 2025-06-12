import React from "react";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";
import { CSVExportButtonProps } from "~/types/interfaces";
import { getRoleName, getUserStatus } from "~/hooks/dashboarddata";
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
    //const capitalizedPageType = readablePageType.charAt(0).toUpperCase() + readablePageType.slice(1);

    const title = `${pluralRole} Data Table Summary`;
    const sheetTitle = `${pluralRole} Dashboard`;

    const excelData = convertToExcelData(
      statsPerRegion ?? [],
      columns ?? [],
      operatorMap ?? []
    );

    // Create worksheet with title in A1
    const worksheet = XLSX.utils.aoa_to_sheet([[title]]); // Title row

    // Add data starting at A3 (skip title and headers)
    XLSX.utils.sheet_add_json(worksheet, excelData, {
      origin: "A3", // start adding data here
      skipHeader: false,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

    XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_").toLowerCase()}.xlsx`);
  };

  return (
    <Button sx={buttonStyles} variant="contained" onClick={downloadExcel}>
      Export as CSV
    </Button>
  );
};

export default CSVExportButtonTable;
