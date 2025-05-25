// NOTE: While this aims to follow the reusable table pattern,
// the Edit Log component requires customized behavior and data structure

import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import useDetailTableStore from "../../../store/useTableStore";
import useUserRoleStore from "../../../store/useUserStore";
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { getUsersData } from "~/utils/api/users/get.users.service";
import { filterDataEditLog, sortDataEditLog } from "~/utils/sortPaginationSearch";
import { getRoleName } from "~/utils/dashboarddata";
import { EditLogFields, Operator, User } from "~/types/types";
import { EditModalPageProps } from "~/types/interfaces";
import dayjs from "dayjs";
import BackIconButton from "../icons/BackButton";

const EditModalPage: React.FC<EditModalPageProps> = ({ userId, onClose }) => {
  const { editLogColumns: columns, modalData, setModalData, setOperatorMap, setEditLogColumns } = useUserRoleStore();
  const { page, setPage, rowsPerPage, setRowsPerPage, sortConfig, filters, setSortConfig, } = useDetailTableStore();
  const { roleId } = useUserRoleStore();
  const [searchQuery, setSearchQuery] = useState("");

  // FILTER AND SORT
  const sortedAndFilteredData = useMemo(() => {
    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => col.filterKey || col.key.toString())
      .filter((key) => typeof key === "string");

    const updatedFilters = { ...filters };

    const filteredData = filterDataEditLog(modalData, filterKeys, updatedFilters, searchQuery);
    return sortDataEditLog(filteredData, sortConfig);
  }, [modalData, filters, columns, searchQuery, sortConfig]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEditResponse = await getUsersData<{ success: boolean; data: { data: User[] } }>(`/users/getEditLog?userId=${userId}`);
        const operatorEditResponse = await getOperatorsData<Record<number, Operator>>("/operators/getOperatorEdits");

        if (userEditResponse.success && userEditResponse.data && Array.isArray(userEditResponse.data.data)) {
          const filteredLogs = userEditResponse.data?.data?.filter((log) => log.UserId === userId) || [];
          setModalData(filteredLogs);
        }

        if (operatorEditResponse.success && operatorEditResponse.data) {
          setOperatorMap(operatorEditResponse.data);
        }
      } catch (error) {
        console.error("Error during fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    }

    setEditLogColumns([
      { key: "EditedBy", label: "Edited By", sortable: true, filterable: true },
      {
        key: "CreatedAt",
        label: "Time Edited",
        sortable: true,
        filterable: true,
      },
      { key: "OldValue", label: "Previous Value", sortable: true, filterable: true },
      { key: "NewValue", label: "New Value", sortable: true, filterable: true },
      { key: "Remarks", label: "Remarks", sortable: true, filterable: true },
    ]);
  }, [userId, setModalData, setOperatorMap, setEditLogColumns]);

  const handleSort = (columnKey: string) => {
    const direction = sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: columnKey, direction });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-55">
      <div className="bg-[#F8F0E3] w-full max-w-4xl mx-auto rounded-lg shadow-lg p-4 pb-0 pt-1 relative overflow-hidden max-h-[90vh]">
        <div className="mt-4 mb-3">
          <BackIconButton
            bgColor="#0038A8"
            hoverColor="#004ccf"
            iconColor="#fff"
            size={26}
            onClick={onClose}
            to={undefined} // prevents router.push('/')
            paddingLeft="5px"
          />
        </div>
        {sortedAndFilteredData.length > 0 && sortedAndFilteredData[0].User && (
          <div className="mb-2">
            <div className="text-2xl font-bold leading-none">
              {sortedAndFilteredData[0].User}
            </div>
            <div className="text-small">{getRoleName(roleId ?? 0)}</div>
          </div>
        )}

        {/* Table Container with scroll */}
        <div className="overflow-y-auto max-h-[70vh]">
          <TableContainer className="!pb-4">
            <div className="relative w-[350px] py-3">
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
            {sortedAndFilteredData.length === 0 ? (
              <div className="flex flex-col items-center py-7 text-[#0038A8]">
                <EditIcon style={{ fontSize: 50 }} />
                <h6 className="mt-2 font-sm text-lg">No Edit Logs Available</h6>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#F08060" } }}>
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        onClick={() =>
                          col.sortable && handleSort(String(col.key))
                        }
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {col.label}
                          {sortConfig.key === String(col.key) && (
                            <span className="ml-2">
                              {sortConfig.direction === "asc" ? (
                                <ArrowDropUpIcon fontSize="small" />
                              ) : (
                                <ArrowDropDownIcon fontSize="small" />
                              )}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAndFilteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((col) => {
                          const key = String(col.key);
                          const value = row[key as keyof EditLogFields];

                          // Format the date field if it's the CreatedAt field
                          if (key === "CreatedAt" && value) {
                            return (
                              <TableCell key={key}>
                                {dayjs(value).format("YYYY/MM/DD")}
                              </TableCell>
                            );
                          }

                          return <TableCell key={key}>{value}</TableCell>;
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </div>
        <div className="p-3">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={sortedAndFilteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditModalPage;
