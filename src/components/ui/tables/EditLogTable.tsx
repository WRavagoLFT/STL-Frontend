// they have separate functions for filtering and sorting to the other table 
// components as they have different data structures and requirements.
// they are not meant to be used interchangeably or be reusable, hence the separation.

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { SortableTableCell } from "../../../utils/sortPaginationSearch";
import { DetailedTableProps } from "../../../types/interfaces";
import { Transactions } from "~/components/betting-summary/BettingSummaryTable";
import CSVExportButtonTable from "../buttons/CSVExportButtonTable";
import {
  filterDataEditLog,
  sortDataEditLog,
} from "~/utils/sortPaginationSearch";

const EditLogsTablePage = <T extends Transactions>({
  data,
  columns,
  pageType,
  operatorMap,
}: DetailedTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter + Sort
  const sortedAndFilteredData = useMemo(() => {
    //console.log("Data length before filtering:", data.length);
    //console.log("Current search query:", searchQuery);
    //console.log("Current filters:", filters);

    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => (col.filterKey ?? col.key).toString()) as string[];

    //console.log("Filter keys used:", filterKeys);

    const filtered = filterDataEditLog(
      data as any[],
      filterKeys,
      filters,
      searchQuery
    );

    //console.log("Data length after filtering:", filtered.length);

    const sorted = sortDataEditLog(
      filtered,
      sortConfig ?? { key: "defaultKey", direction: "asc" }
    );

    //console.log("Data length after sorting:", sorted.length);
    return sorted;
  }, [data, filters, columns, searchQuery, sortConfig]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // optionally reset to first page
  };

  // Pagination
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedAndFilteredData.slice(start, end);
  }, [sortedAndFilteredData, page, rowsPerPage]);

  return (
    <>
      <TableContainer>
        <div className="flex justify-between items-center py-3 px-1">
          <div className="flex items-center">
            <div className="relative w-[350px]">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-[8px] bg-transparent border border-[#0038A8] rounded-md text-sm focus:outline-none"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon style={{ fontSize: 20 }} />
              </div>
            </div>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow sx={{ "&:hover": { backgroundColor: "#F08060" } }}>
              {columns.map((col) =>
                col.sortable || col.filterable ? (
                  <SortableTableCell
                    key={String(col.key)}
                    label={col.label}
                    sortKey={String(col.key)}
                    isFilterVisible={isFilterActive && col.filterable}
                  />
                ) : (
                  <TableCell key={String(col.key)}>{col.label}</TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <div className="flex flex-col items-center py-7 text-[#0038A8]">
                    <PersonOffIcon style={{ fontSize: 50 }} />
                    <h6 className="mt-2 font-sm text-lg">No data available</h6>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col) => {
                    const key = String(col.key);
                    const value = (row as any)[key];

                    return (
                      <TableCell key={key} sx={{ paddingY: 0.5 }}>
                        {col.render
                          ? col.render(row as unknown as T)
                          : col.filterValue
                            ? typeof col.filterValue === "function"
                              ? col.filterValue(row as unknown as T)
                              : col.filterValue
                            : Array.isArray(value)
                              ? value
                                  .map((v) => v?.CityName ?? v?.toString())
                                  .join(", ")
                              : (value?.toString() ?? "")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-0 pt-2">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={sortedAndFilteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => handleChangePage(newPage)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </TableContainer>

      {/* <div className="flex justify-end pt-2">
        <CSVExportButtonTable
          pageType={pageType ?? "unknown"}
          columns={columns}
          statsPerRegion={data}
          operatorMap={operatorMap ? Object.values(operatorMap) : []}
        />
      </div> */}
    </>
  );
};

export default EditLogsTablePage;
