"use client";

import React, { useMemo } from "react";
import {
  FaSearch,
  FaUserSlash,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { DetailedTableProps } from "../../../types/interfaces";
import useDetailTableStore from "../../../store/useTableStore";
import {
  SortableTableCell,
  filterData,
  sortData,
} from "../../../utils/sortPaginationSearch";
import CSVExportButtonTable from "../buttons/CSVExportButtonTable";
import { Transactions } from "@/components/betting-summary/BettingSummaryTable";
import { SortConfig } from "@/types/types";
import { UsersItem } from "@/lib/api/users/users.service";
import { OperatorsItem } from "@/lib/api/operators/operators.service";

const ReadOnlyTablePage = <T extends Transactions>({
  data,
  columns,
  actionsRender,
  pageType,
  operatorMap,
  loading,
}: DetailedTableProps<T>) => {
  const {
    searchQuery,
    setIsFilterActive,
    isFilterActive,
    page,
    rowsPerPage,
    sortConfig,
    filters,
    handleChangePage,
    handleChangeRowsPerPage,
    setSearchQuery,
    resetFilters,
  } = useDetailTableStore();

  const filteredData = useMemo(() => {
    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => col.filterKey ?? col.key?.toString())
      .filter((key): key is string => !!key);

    const enrichedData = data.map((item) => ({ ...item }));

    return filterData(enrichedData, filterKeys, { ...filters, searchQuery });
  }, [data, filters, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!filteredData || !sortConfig) return [];
    return sortData(
      filteredData,
      sortConfig as SortConfig<UsersItem | OperatorsItem>
    );
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  return (
    <div className="w-full border border-[#0038A8] rounded-xl px-4 py-2 overflow-x-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-3 w-full">
        <div className="flex items-center w-full max-w-[500px]">
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
          <button
            onClick={() => {
              setIsFilterActive(!isFilterActive);
              if (isFilterActive) {
                resetFilters(); // Reset filters when toggling off
                // setSearchQuery(""); // Optional: Uncomment to reset search query too
              }
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 shrink-0"
          >
            {isFilterActive ? (
              <MdFilterListOff size={24} />
            ) : (
              <MdFilterList size={24} />
            )}
          </button>
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

            {isFilterActive && (
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="text-left pb-4 font-normal overflow-hidden text-ellipsis min-w-[80px] sm:min-w-[100px] px-2"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {col.filterable ? (
                        <SortableTableCell
                          label={col.label}
                          sortKey={String(col.key)}
                          isFilterVisible={true}
                        />
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, rowIndex) => (
                <tr
                  key={`loading-${rowIndex}`}
                  className="border-b border-[#ACA993]"
                >
                  {columns.map((_, colIndex) => (
                    <td
                      key={`loading-${rowIndex}-${colIndex}`}
                      className="px-2 py-2 w-[150px] max-w-[150px]"
                    >
                      <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actionsRender ? 1 : 1)}
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

      <div className="flex flex-col sm:flex-row justify-between items-center p-3 text-sm gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 rounded px-1 text-sm"
            value={rowsPerPage}
            onChange={(e) =>
              handleChangeRowsPerPage({
                target: { value: e.target.value },
              } as any)
            }
          >
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 mt-2 sm:mt-0">
          <span className="text-xs sm:text-sm">
            {Math.min(page * rowsPerPage + 1, filteredData.length)}–
            {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </span>

          <button
            onClick={(e) => handleChangePage(e, 0)}
            disabled={page === 0}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="First Page"
          >
            <FaAngleDoubleLeft size={14} />
          </button>

          <button
            onClick={(e) => handleChangePage(e, page - 1)}
            disabled={page === 0}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="Previous Page"
          >
            <FaChevronLeft size={14} />
          </button>

          <span className="text-xs sm:text-sm">
            Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}
          </span>

          <button
            onClick={(e) => handleChangePage(e, page + 1)}
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="Next Page"
          >
            <FaChevronRight size={14} />
          </button>

          <button
            onClick={(e) =>
              handleChangePage(
                e,
                Math.ceil(filteredData.length / rowsPerPage) - 1
              )
            }
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            className="p-1 sm:p-2 border rounded disabled:opacity-30"
            title="Last Page"
          >
            <FaAngleDoubleRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <CSVExportButtonTable
          pageType={pageType}
          columns={columns}
          statsPerRegion={sortedData}
          operatorMap={operatorMap ? Object.values(operatorMap) : []}
        />
      </div>
    </div>
  );
};

export default ReadOnlyTablePage;
