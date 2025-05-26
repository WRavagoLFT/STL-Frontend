import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useDetailTableStore from '../store/useTableStore';
import { SortableTableCellProps } from '../types/interfaces';
import { User, Operator, SortConfig, EditLogFields } from '~/types/types';
import { filterStyles } from '~/styles/theme';

// SORTING + FILTERING COMPONENT
export const SortableTableCell: React.FC<SortableTableCellProps> = ({
  label,
  sortKey,
  isFilterVisible = false,
}) => {
  const { sortConfig, setSortConfig, filters, setFilters } = useDetailTableStore();

  const handleSort = () => {
    const direction =
      sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: sortKey, direction });
  };

  // Handle filter change for text fields
  const handleFilterChange = (key: string) => (value: string | Dayjs | null) => {
    let filterValue: string;

    // Handle date filters if the value is a Dayjs object
    if (dayjs.isDayjs(value)) {
      filterValue = value.isValid() ? value.format("YYYY-MM-DD") : "";
    } else {
      filterValue = value || "";
    }

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [key]: filterValue,
      };
      return updatedFilters;
    });
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [sortKey]: date ? date.format('YYYY-MM-DD') : '',
    }));
  };

  // Always show the sort icon, but only highlight the selected one
  const isActive = sortConfig.key === sortKey;
  const icon = sortConfig.key === sortKey
    ? (sortConfig.direction === "asc"
        ? <KeyboardArrowUpIcon sx={{ fontSize: 16, marginRight: 1, color: 'primary.main' }} />
        : <KeyboardArrowDownIcon sx={{ fontSize: 16, marginRight: 1, color: 'primary.main' }} />)
    : <KeyboardArrowDownIcon sx={{ fontSize: 16, marginRight: 1, opacity: 0.3 }} />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableCell sx={{ cursor: 'pointer', userSelect: 'none' }} onClick={handleSort}>
        <Tooltip title={isActive ? `Sort ${label} ${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'}` : `Sort by ${label}`}>
          <span>
            {icon}
          </span>
        </Tooltip>
        {label}
        {isFilterVisible && (
          <div>
            {(sortKey === 'DateOfRegistration' || sortKey === 'DateOfOperation') ? (
              <DatePicker
                value={filters[sortKey] ? dayjs(filters[sortKey]) : null}
                onChange={handleDateChange}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: {
                    variant: 'filled',
                    fullWidth: true,
                    sx: { 
                      ...filterStyles, 
                      m: 0, 
                      p: 0, 
                      "& .MuiFilledInput-root": {
                        paddingBottom: "0px",
                        backgroundColor: "transparent !important",
                      },
                    },
                  },
                }}
              />
            ) : (
              <TextField
                placeholder={`Filter by ${label}`}
                variant="filled"
                value={filters[sortKey] || ''}
                onChange={(event) => handleFilterChange(sortKey)(event.target.value)}
                fullWidth
                sx={{ 
                  ...filterStyles, 
                  m: 0, 
                  p: 0, 
                  "& .MuiFilledInput-root": {
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: "transparent !important",
                  },
                }}
              />
            )}
          </div>
        )}
      </TableCell>
    </LocalizationProvider>
  );
};

// SORTING FUNCTION
export function sortData<T extends User | Operator>(
  data: T[],
  sortConfig: SortConfig<T>
): T[] {
  return [...data].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    // Custom logic for fullName
    if (sortConfig.key === "fullName") {
      valueA = `${(a as User).firstName} ${(a as User).lastName} ${(a as User).suffix || ""}`.trim().toLowerCase();
      valueB = `${(b as User).firstName} ${(b as User).lastName} ${(b as User).suffix || ""}`.trim().toLowerCase();
    } else {
      valueA = getNestedValue(a, sortConfig.key as string);
      valueB = getNestedValue(b, sortConfig.key as string);

      // Special handling if sorting key is "Cities" (which is an array)
      if (sortConfig.key === "Cities") {
        const getCityNames = (cities: any) =>
          Array.isArray(cities)
            ? cities.map((c) => c.CityName).join(", ").toLowerCase()
            : "";
        valueA = getCityNames((a as any).Cities);
        valueB = getCityNames((b as any).Cities);
      }
    }

    // Handle null or undefined
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueB == null) return sortConfig.direction === "asc" ? 1 : -1;

    // Handle valid date strings
    if (dayjs(valueA).isValid() && dayjs(valueB).isValid()) {
      const dateA = dayjs(valueA).valueOf();
      const dateB = dayjs(valueB).valueOf();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle strings
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Handle numbers
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });
}

// Helper function to get nested value safely
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// FILTERING + SEARCHING FUNCTION
export const filterData = (
  data: (any)[],
  filterKeys: string[],
  filters: { [key: string]: string },
  operatorMap?: { [key: number]: Operator }

): (User | Operator)[] => {
  const searchValue = filters.searchQuery?.toLowerCase() || "";

  const filterItem = (key: string, value: string | undefined) => {
    return value && value.toLowerCase().includes(searchValue);
  };

  return data.filter((item) => {
    const operatorName =
      operatorMap?.[item.OperatorId]?.OperatorName?.toLowerCase() || "no operator";

    if (searchValue && !Object.values(item).some((val) => filterItem("", String(val)))) {
      const fullName = `${"FirstName" in item ? item.FirstName : ""} ${"LastName" in item ? item.LastName : ""}`.toLowerCase();
      const cities = (getNestedValue(item, "Cities") || []) as { CityName: string }[];
      const cityNames = cities.map(city => city.CityName.toLowerCase()).join(", ");

      if (![fullName, operatorName, cityNames].some(val => val.includes(searchValue))) {
        return false;
      }
    }

    return filterKeys.every((key) => {
      const filterValue = filters[key]?.toLowerCase() || "";
      const itemValue = getNestedValue(item, key)?.toString().toLowerCase() || "";

      if (!filterValue) return true;

      if (key === "Cities") {
        const cities = (getNestedValue(item, "Cities") || []) as { CityName: string }[];
        const cityNames = cities.map(city => city.CityName.toLowerCase()).join(", ");
        return cityNames.includes(filterValue);
      }

      if (key === "DateOfRegistration") {
        // Compare dates if filtering by date
        const itemDate = dayjs(getNestedValue(item, key)).format("YYYY-MM-DD");
        const filterDate = dayjs(filterValue).format("YYYY-MM-DD");
        return itemDate === filterDate;
      }

      // Handle the 'OperatorName' filtering logic for Users
      if (key === "OperatorDetails.OperatorName" && "OperatorId" in item) {
        return operatorName.includes(filterValue);
      }

      return itemValue.includes(filterValue);
    });
  });
};

// ======================================================= FOR EDIT LOGS MODAL

// Filter function with search and additional filters for Edit Log
export const filterDataEditLog = (
  data: EditLogFields[], filterKeys: string[], filters: Record<string, any>, searchQuery: string
) => {
  return data.filter((row) => {
    // Search filter logic
    const matchesSearch = filterKeys.some((key) => {
      const value = row[key as keyof EditLogFields];
      return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Other filters logic
    const matchesFilters = filterKeys.every((key) => {
      const filterValue = filters[key];
      if (!filterValue) return true;
      const value = row[key as keyof EditLogFields];
      return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });
};

// Sorting function for Edit Log
export const sortDataEditLog = (data: EditLogFields[], sortConfig: { key: string, direction: 'asc' | 'desc' }) => {
  const { key, direction } = sortConfig;

  return data.sort((a, b) => {
    const aValue = a[key as keyof EditLogFields];
    const bValue = b[key as keyof EditLogFields];

    if ((aValue ?? '') < (bValue ?? '')) return direction === 'asc' ? -1 : 1;
    if ((aValue ?? '') > (bValue ?? '')) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};