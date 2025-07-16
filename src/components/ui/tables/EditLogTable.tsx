"use client";

import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaUserSlash,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { SortableTableCell } from "../../../utils/sortPaginationSearch";
import { DetailedTableProps } from "../../../types/interfaces";
import { Transactions } from "@/components/betting-summary/BettingSummaryTable";
import CSVExportButtonTable from "../buttons/CSVExportButtonTable";
import {
  filterDataEditLog,
  sortDataEditLog,
} from "@/utils/sortPaginationSearch";

const EditLogsTablePage = <T extends Transactions>({
  data,
  columns,
  pageType,
  operatorMap,
}: DetailedTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedAndFilteredData = useMemo(() => {
    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => (col.filterKey ?? col.key).toString()) as string[];

    const filtered = filterDataEditLog(
      data as any[],
      filterKeys,
      filters,
      searchQuery
    );

    const sorted = sortDataEditLog(
      filtered,
      sortConfig ?? { key: "defaultKey", direction: "asc" }
    );

    return sorted;
  }, [data, filters, columns, searchQuery, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedAndFilteredData.slice(start, end);
  }, [sortedAndFilteredData, page, rowsPerPage]);

  const totalDataCount = sortedAndFilteredData.length;

  return (
    <div className="w-full border border-[#0038A8] rounded-xl px-4 py-2 overflow-x-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-3 w-full">
        <div className="flex items-center w-full max-w-[400px]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8F0E3] border border-blue-900 rounded-md text-sm focus:outline-none"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-auto w-full min-w-[640px] text-xs sm:text-sm">
          <thead className="bg-[#E97451] text-white sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="py-4 text-left font-normal overflow-hidden text-ellipsis min-w-[80px] sm:min-w-[100px] px-2"
                >
                  <div className="flex items-center justify-start gap-1">
                    {col.sortable && (
                      <SortableTableCell
                        label=""
                        sortKey={String(col.key)}
                        isFilterVisible={false}
                      />
                    )}
                    <span>{col.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-blue-900"
                >
                  <div className="flex flex-col items-center">
                    <FaUserSlash size={40} />
                    <p className="mt-2 text-lg">No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[#E0DCBD] border-b border-[#ACA993]"
                >
                  {columns.map((col) => {
                    const key = String(col.key);
                    const value = (row as any)[key];
                    return (
                      <td
                        key={key}
                        className="px-2 py-2 text-sm whitespace-normal min-w-[80px]"
                      >
                        {col.render
                          ? col.render(row as unknown as T)
                          : col.filterValue
                            ? typeof col.filterValue === "function"
                              ? col.filterValue(row as unknown as T)
                              : col.filterValue
                            : typeof value === "string" ||
                                typeof value === "number"
                              ? value.toString()
                              : Array.isArray(value)
                                ? value
                                    .map(
                                      (v: any) => v?.CityName ?? v?.toString()
                                    )
                                    .join(", ")
                                : ""}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-center p-3 text-sm gap-2">

        <div className="flex items-center gap-1 sm:gap-3 mt-2 sm:mt-0">
          <span className="text-xs sm:text-sm">
            {Math.min(page * rowsPerPage + 1, totalDataCount)}–
            {Math.min((page + 1) * rowsPerPage, totalDataCount)} of{" "}
            {totalDataCount}
          </span>

          <button
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="First Page"
          >
            <FaAngleDoubleLeft size={14} />
          </button>

          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="Previous Page"
          >
            <FaChevronLeft size={14} />
          </button>

          <span className="text-xs sm:text-sm">
            Page {page + 1} of {Math.ceil(totalDataCount / rowsPerPage)}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(totalDataCount / rowsPerPage) - 1}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="Next Page"
          >
            <FaChevronRight size={14} />
          </button>

          <button
            onClick={() => setPage(Math.ceil(totalDataCount / rowsPerPage) - 1)}
            disabled={page >= Math.ceil(totalDataCount / rowsPerPage) - 1}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="Last Page"
          >
            <FaAngleDoubleRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex justify-end py-1">
        <CSVExportButtonTable
          pageType={pageType}
          columns={columns}
          statsPerRegion={sortedAndFilteredData}
          operatorMap={operatorMap ? Object.values(operatorMap) : []}
        />
      </div>
    </div>
  );
};

export default EditLogsTablePage;
