"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  FaSearch,
  FaUserSlash,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaEllipsisH,
} from "react-icons/fa";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import {
  SortableTableCell,
  filterData,
  sortData,
} from "../../../utils/sortPaginationSearch";
import { DetailedTableProps } from "../../../types/interfaces";
import { SortConfig } from "@/types/types";
import { getUserStatus } from "@/hooks/dashboarddata";
import dayjs from "dayjs";
import CSVExportButtonTable from "../buttons/CSVExportButtonTable";
import Swal from "sweetalert2";
import router, { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";
import useDetailTableStore from "@/store/useTableStore";
import { useAuthStore } from "@/store/useAuthStore";
import ConfirmUserActionModalPage from "../modals/ConfirmUserActionModal";
import { UsersItem } from "@/lib/api/users/users.service";
import { OperatorsItem } from "@/lib/api/operators/operators.service";
import { DeviceItem } from "@/lib/api/device/device.service";

const DetailedTable = function <
  T extends UsersItem | OperatorsItem | DeviceItem,
>({
  data,
  columns,
  actionsRender,
  pageType,
  operatorMap,
  onClose,
  source,
  onAddClick,
  onUpdateClick,
  onSubmit,
  onSuspendClick,
  loading,
}: DetailedTableProps<T>) {
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
    anchorEl,
    selectedRow,
    setAnchorEl,
    setSelectedRow,
    resetMenu,
  } = useDetailTableStore();
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [remarks, setRemarks] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const [actionType, setActionType] = useState("suspend");
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const modalStore = useModalStore.getState();
  const sevenDaysAgo = useMemo(() => dayjs().subtract(7, "day"), []);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => col.filterKey ?? col.key?.toString())
      .filter((key): key is string => !!key);
    const enrichedData = data.map((item) => {
      let operatorId =
        "OperatorId" in item && typeof item.OperatorId === "number"
          ? item.OperatorId
          : undefined;
      const operator =
        operatorId !== undefined ? operatorMap?.[operatorId] : undefined;
      return {
        ...item,
        OperatorDetails: { OperatorName: operator?.OperatorName || "" },
        Status: getUserStatus(item, sevenDaysAgo),
      };
    });
    return filterData(
      enrichedData,
      filterKeys,
      { ...filters, searchQuery },
      operatorMap
    );
  }, [data, filters, searchQuery, columns, operatorMap, sevenDaysAgo]);

  const sortedData = useMemo(
    () =>
      sortConfig
        ? sortData(
            filteredData,
            sortConfig as SortConfig<UsersItem | OperatorsItem>
          )
        : [],
    [filteredData, sortConfig]
  );
  const paginatedData = useMemo(
    () =>
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  const handleOpenView = useCallback(
    (row?: T) => {
      const targetRow = row || selectedRow;
      if (!targetRow) return;

      const {
        OperatorName,
        OperatorId,
        FirstName,
        LastName,
        UserId,
        UserTypeId,
        DeviceId,
        AssignedUser,
      } = targetRow;

      if (source === "operators" && OperatorName && OperatorId) {
        const slug = `${OperatorId}-${OperatorName.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")}`;
        modalStore.setSelectedData(targetRow);
        modalStore.setOperatorId(OperatorId);
        router.push(`/operators/operators-view/${slug}`);
      } else if (
        source === "users" &&
        (UserTypeId === 1 || UserTypeId === 2 || UserTypeId === 3)
      ) {
        if (!FirstName || !UserId) return;
        const fullName = `${FirstName} ${LastName || ""}`.trim();
        const slug = `${UserId}-${fullName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")}`;
        modalStore.setSelectedData(targetRow);
        router.push(`/users/users-view/${slug}`);
      } else if (source === "device" && AssignedUser && DeviceId) {
        const slug = `${DeviceId}-${AssignedUser.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")}`;
        modalStore.setSelectedData(targetRow);
        router.push(`/device-information/device-information-view/${slug}`);
      } else {
        onUpdateClick
          ? onUpdateClick(targetRow)
          : modalStore.openModal("view", targetRow);
      }
    },
    [selectedRow, source, onUpdateClick]
  );

  const handleSuspend = async (row: T) => {
    const fullName =
      "FirstName" in row && "LastName" in row
        ? `${row.FirstName} ${row.LastName}`
        : "this user";
    const result = await Swal.fire({
      title: "<strong>Delete Confirmation</strong>",
      html: `This action will delete the accounts and any related data for <strong>${fullName}</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: '<i class="fa fa-ban"></i> Delete',
      customClass: {
        popup: "bg-[#FFFFFF] text-black rounded-md",
        title: "text-lg font-semibold",
        confirmButton:
          "bg-[#CE1126] rounded-md text-white text-base hover:bg-red-700 px-8 py-1.5",
        cancelButton: "bg-transparent px-4 text-base",
      },
      buttonsStyling: false,
    });
    if (result.isConfirmed) {
      const userId = "UserId" in row ? row.UserId : "";
      if (!userId) return;
      setFormData({ UserId: userId });
      setActionType("suspend");
      setIsConfirmModalOpen(true);
      setSelectedRow(null);
      resetMenu();
    }
  };

  return (
    <div className="overflow-x-auto w-full border border-[#0038A8] rounded-xl px-4 py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-3">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-[350px]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8F0E3] border border-blue-900 rounded-md text-sm focus:outline-none"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch size={16} />
            </div>
          </div>
          <button
            onClick={() => {
              if (isFilterActive) {
                useDetailTableStore.getState().setFilters?.({});
              }
              setIsFilterActive(!isFilterActive);
            }}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {isFilterActive ? (
              <MdFilterListOff size={24} />
            ) : (
              <MdFilterList size={24} />
            )}
          </button>
        </div>
        {currentUserType !== 3 && pageType && (
          <button
            className={`rounded-lg px-7 py-2 text-[0.8rem] text-white transition
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0038A8] hover:bg-blue-700"}`}
            onClick={onAddClick}
            disabled={loading}
          >
            Add{" "}
            {pageType === "Device Information"
              ? "Device"
              : pageType.charAt(0).toUpperCase() + pageType.slice(1)}
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-fixed w-full">
          <thead className="bg-[#E97451] text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={String(col.key)}
                  className={`py-4 text-left font-normal overflow-hidden text-ellipsis ${
                    index === 1 ? "w-[30%]" : "w-[20%]"
                  }`}
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
              <th className="text-center font-normal w-[10%]">Actions</th>
            </tr>

            {isFilterActive && (
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={String(col.key)}
                    className={`text-left pb-4 font-normal overflow-hidden text-ellipsis ${
                      index === 1 ? "w-[30%]" : "w-[20%]"
                    }`}
                  >
                    {col.filterable ? (
                      <SortableTableCell
                        label={col.label}
                        sortKey={String(col.key)}
                        isFilterVisible={true}
                      />
                    ) : (
                      <span className="block h-4" />
                    )}
                  </th>
                ))}
                <th className="w-[10%]"></th>
              </tr>
            )}
          </thead>

          <tbody>
            {loading ? (
              // Render 5 placeholder rows while loading
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
                  <td className="text-center">
                    <div className="h-4 w-10 bg-gray-300 rounded animate-pulse mx-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
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
                  className={`
                    border-b border-[#ACA993]
                    ${openMenuRow === `${rowIndex}` ? "bg-[#F8F4D2]" : ""}
                    ${openMenuRow !== null && openMenuRow !== `${rowIndex}` ? "pointer-events-none opacity-50" : "hover:bg-[#E0DCBD]"}
                  `}
                >
                  {columns.map((col) => {
                    const key = String(col.key);
                    const value = (row as any)[key];
                    return (
                      <td
                        key={key}
                        className="px-2 py-2 w-[150px] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row as T)
                          : col.filterValue
                            ? typeof col.filterValue === "function"
                              ? col.filterValue(row as T)
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
                  <td className="text-center relative">
                    {currentUserType === 3 ? (
                      <span
                        className="text-[#0038A8] cursor-pointer hover:underline"
                        onClick={() => handleOpenView(row as T)}
                      >
                        View
                      </span>
                    ) : (
                      <div className="inline-block text-left">
                        <button
                          onClick={(e) =>
                            openMenuRow === `${rowIndex}`
                              ? setOpenMenuRow(null)
                              : setOpenMenuRow(`${rowIndex}`)
                          }
                          className="text-[#0038A8] hover:text-blue-800 focus:outline-none"
                        >
                          <FaEllipsisH size={18} />
                        </button>

                        {openMenuRow === `${rowIndex}` && (
                          <div
                            className="absolute right-0 mt-2 w-28 bg-[#D9D4B0] shadow z-10"
                            onMouseLeave={() => setOpenMenuRow(null)}
                          >
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-[#0038A8] hover:bg-[#0038A8] hover:text-white"
                              onClick={() => {
                                setOpenMenuRow(null);
                                handleOpenView(row as T);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-[#0038A8] hover:bg-[#0038A8] hover:text-white"
                              onClick={() => {
                                setOpenMenuRow(null);
                                handleSuspend(row as T);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-3 text-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 rounded px-1"
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
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <span>
            {Math.min(page * rowsPerPage + 1, filteredData.length)}–
            {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </span>
          <button
            onClick={(e) => handleChangePage(e, 0)}
            disabled={page === 0}
            className="p-2 border rounded disabled:opacity-30"
            title="First Page"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={(e) => handleChangePage(e, page - 1)}
            disabled={page === 0}
            className="p-2 border rounded disabled:opacity-30"
            title="Previous Page"
          >
            <FaChevronLeft />
          </button>
          <span>
            Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}
          </span>
          <button
            onClick={(e) => handleChangePage(e, page + 1)}
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            className="p-2 border rounded disabled:opacity-30"
            title="Next Page"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={(e) =>
              handleChangePage(
                e,
                Math.ceil(filteredData.length / rowsPerPage) - 1
              )
            }
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            className="p-2 border rounded disabled:opacity-30"
            title="Last Page"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>

      {currentUserType !== 3 && (
        <div className="flex justify-end pt-2">
          <CSVExportButtonTable
            pageType={pageType}
            columns={columns}
            statsPerRegion={data}
            operatorMap={operatorMap ? Object.values(operatorMap) : []}
            loading={loading}
          />
        </div>
      )}

      <ConfirmUserActionModalPage
        open={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          onClose?.();
        }}
        mode="suspend"
        remarks={remarks}
        setRemarks={setRemarks}
        onConfirm={async (remarksFromModal?: string) => {
          try {
            if (onSubmit) {
              const finalFormData = {
                ...formData,
                ...(actionType === "suspend" && { remarks: remarksFromModal }),
              };
              await onSubmit(finalFormData as T);
            }
            setIsConfirmModalOpen(false);
            onClose?.();
          } catch (err) {
            console.error("Error during onSubmit:", err);
          }
        }}
      />
    </div>
  );
};

export default DetailedTable;
