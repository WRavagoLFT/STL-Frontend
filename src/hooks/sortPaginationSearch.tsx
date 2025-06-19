import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { FaSort, FaSortUp, FaSortDown, FaCalendarAlt } from "react-icons/fa";
import { SortableTableCellProps } from "../types/interfaces";
import useDetailTableStore from "../store/useTableStore";
import { User, Operator, SortConfig, EditLogFields } from "~/types/types";

export const SortableTableCell: React.FC<SortableTableCellProps> = ({
  label,
  sortKey,
  isFilterVisible = false,
}) => {
  const { sortConfig, setSortConfig, filters, setFilters } =
    useDetailTableStore();

  const handleSort = () => {
    if (sortConfig.key !== sortKey) {
      setSortConfig({ key: sortKey, direction: "asc" });
    } else if (sortConfig.direction === "asc") {
      setSortConfig({ key: sortKey, direction: "desc" });
    } else {
      setSortConfig({ key: "", direction: "asc" });
    }
  };

  const handleFilterChange =
    (key: string) => (value: string | Dayjs | null) => {
      let filterValue: string;
      if (dayjs.isDayjs(value)) {
        filterValue = value.isValid() ? value.format("YYYY-MM-DD") : "";
      } else {
        filterValue = value || "";
      }
      setFilters((prev) => ({ ...prev, [key]: filterValue }));
    };

  const isActive = sortConfig.key === sortKey;

  return (
    <th className="text-left px-2 align-top">
      <div className="w-full min-w-[180px] max-w-[180px]">
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={handleSort}
        >
          {!isFilterVisible && (
            <>
              {isActive && sortConfig.direction === "asc" && (
                <FaSortUp className="w-4 h-4" />
              )}
              {isActive && sortConfig.direction === "desc" && (
                <FaSortDown className="w-4 h-4" />
              )}
              {!isActive && <FaSort className="w-4 h-4 opacity-30" />}
            </>
          )}
        </div>
        {isFilterVisible && (
          <div className="mt-1">
            {sortKey === "DateOfRegistration" ||
            sortKey === "DateOfOperation" ? (
              <input
                type="date"
                value={filters[sortKey] || ""}
                onChange={(e) => handleFilterChange(sortKey)(e.target.value)}
                className="w-full py-2 px-2 text-sm lg:text-base text-[#FFF] border-[#000] focus:outline-none font-normal border-b"
                style={{
                  colorScheme: "dark",
                }}
              />
            ) : (
              <input
                type="text"
                placeholder={`Filter by ${label}`}
                value={filters[sortKey] || ""}
                onChange={(e) => handleFilterChange(sortKey)(e.target.value)}
                className="w-full py-2 px-2  text-sm lg:text-base text-[#FFF] border-[#000] focus:outline-none font-normal border-b"
              />
            )}
          </div>
        )}
      </div>
    </th>
  );
};

export function sortData<T extends User | Operator>(
  data: T[],
  sortConfig: SortConfig<T>
): T[] {
  if (!sortConfig.key) return data;

  return [...data].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (sortConfig.key === "fullName") {
      valueA =
        `${(a as User).FirstName} ${(a as User).LastName} ${(a as User).Suffix || ""}`
          .trim()
          .toLowerCase();
      valueB =
        `${(b as User).FirstName} ${(b as User).LastName} ${(b as User).Suffix || ""}`
          .trim()
          .toLowerCase();
    } else {
      valueA = getNestedValue(a, sortConfig.key as string);
      valueB = getNestedValue(b, sortConfig.key as string);

      if (sortConfig.key === "Cities") {
        const getCityNames = (cities: any) =>
          Array.isArray(cities)
            ? cities
                .map((c) => c.CityName)
                .join(", ")
                .toLowerCase()
            : "";
        valueA = getCityNames((a as any).Cities);
        valueB = getCityNames((b as any).Cities);
      }
    }

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueB == null) return sortConfig.direction === "asc" ? 1 : -1;

    if (dayjs(valueA).isValid() && dayjs(valueB).isValid()) {
      const dateA = dayjs(valueA).valueOf();
      const dateB = dayjs(valueB).valueOf();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });
}

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const filterData = (
  data: any[],
  filterKeys: string[],
  filters: { [key: string]: string },
  operatorMap?: { [key: number]: Operator }
): (User | Operator)[] => {
  const searchValue = filters.searchQuery?.toLowerCase() || "";

  return data.filter((item) => {
    const operatorName =
      operatorMap?.[item.OperatorId]?.OperatorName?.toLowerCase() ||
      "no operator";

    if (
      searchValue &&
      !Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchValue)
      )
    ) {
      const fullName =
        `${item.FirstName || ""} ${item.LastName || ""}`.toLowerCase();
      const cities = (getNestedValue(item, "Cities") || []) as {
        CityName: string;
      }[];
      const cityNames = cities.map((c) => c.CityName.toLowerCase()).join(", ");

      if (
        ![fullName, operatorName, cityNames].some((val) =>
          val.includes(searchValue)
        )
      ) {
        return false;
      }
    }

    return filterKeys.every((key) => {
      const filterValue = filters[key]?.toLowerCase() || "";
      const itemValue =
        getNestedValue(item, key)?.toString().toLowerCase() || "";

      if (!filterValue) return true;

      if (key === "Cities") {
        const cities = (getNestedValue(item, "Cities") || []) as {
          CityName: string;
        }[];
        const cityNames = cities
          .map((c) => c.CityName.toLowerCase())
          .join(", ");
        return cityNames.includes(filterValue);
      }

      if (key === "DateOfRegistration") {
        const itemDate = dayjs(getNestedValue(item, key)).format("YYYY-MM-DD");
        const filterDate = dayjs(filterValue).format("YYYY-MM-DD");
        return itemDate === filterDate;
      }

      if (key === "OperatorDetails.OperatorName" && "OperatorId" in item) {
        return operatorName.includes(filterValue);
      }

      return itemValue.includes(filterValue);
    });
  });
};

export const filterDataEditLog = (
  data: EditLogFields[],
  filterKeys: string[],
  filters: Record<string, any>,
  searchQuery: string
) => {
  return data.filter((row) => {
    const matchesSearch = filterKeys.some((key) => {
      const value = row[key as keyof EditLogFields];
      return value
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });

    const matchesFilters = filterKeys.every((key) => {
      const filterValue = filters[key];
      if (!filterValue) return true;
      const value = row[key as keyof EditLogFields];
      return value
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });
};

export const sortDataEditLog = (
  data: EditLogFields[],
  sortConfig: { key: string; direction: "asc" | "desc" }
) => {
  const { key, direction } = sortConfig;

  return data.sort((a, b) => {
    const aValue = a[key as keyof EditLogFields];
    const bValue = b[key as keyof EditLogFields];

    if ((aValue ?? "") < (bValue ?? "")) return direction === "asc" ? -1 : 1;
    if ((aValue ?? "") > (bValue ?? "")) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
