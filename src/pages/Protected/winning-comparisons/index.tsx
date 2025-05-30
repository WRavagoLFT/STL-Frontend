import React, { useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import ChartWinnersandWinningsSummary from "~/components/winning-summary/wins-comparison/SummaryWinners&Winnings";
import ChartWinnersandWinningsRegionalSummary from "~/components/winning-summary/wins-comparison/RegionalSummaryWinners&Winnings";
import { useWinningStore, categoryType } from "../../../store/useWinningStore";
import { useSideBarStore } from "../../../store/useSideBarStore";
import ChartTopRegionByWinsandWinners from "~/components/winning-summary/wins-comparison/TopRegionWinning";
import BackIconButton from "~/components/ui/icons/BackButton";
import router from "next/router";
import dayjs from "dayjs";

type dateType = "Specific Date" | "Date Duration";

const WinningComparison = () => {
  const {
    // loading,
    activeGameType,
    categoryFilter,
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    // setLoading,
    setGameType,
    setCategoryFilter,
    setDateFilter,
    setFirstDateSpecific,
    setSecondDateSpecific,
    setFirstDateDuration,
    setSecondDateDuration,
  } = useWinningStore();

  // Format dates to MM/DD/YYYY
  const formattedFirstDateSpecific = firstDateSpecific
    ? dayjs(firstDateSpecific).format("MM/DD/YYYY")
    : null;

  const formattedSecondDateSpecific = secondDateSpecific
    ? dayjs(secondDateSpecific).format("MM/DD/YYYY")
    : null;

  const formattedFirstDateDuration = firstDateDuration
    ? dayjs(firstDateDuration).format("MM/DD/YYYY")
    : null;

  const formattedSecondDateDuration = secondDateDuration
    ? dayjs(secondDateDuration).format("MM/DD/YYYY")
    : null;

  const { SideBarActiveGameType } = useSideBarStore();

  useEffect(() => {
    if (SideBarActiveGameType !== activeGameType) {
      setGameType(SideBarActiveGameType); // Update useWinningStore's activeGameType
    }
  }, [SideBarActiveGameType, activeGameType, setGameType]);

  const categoryTypes: categoryType[] = [
    "Total Winnings and Winners",
    "Total Winnings by Bet Type",
    "Total Winnings by Game Type",
    "Top Winning Region by Total Winnings",
    "Top Winner Region by Total Winners",
    "Total Winners by Bet Type",
    "Total Winners by Game Type",
  ];

  // Debugging: Log all states whenever they change
  useEffect(() => {
    //console.log("Active Sidebar State:", activeGameType)
    //console.log("State values:");
    //console.log("categoryFilter:", categoryFilter);
    //console.log("dateFilter:", dateFilter);
    //console.log("firstDateSpecific:", firstDateSpecific);
    //console.log("secondDateSpecific:", secondDateSpecific);
    //console.log("firstDateDuration:", firstDateDuration);
    //console.log("secondDateDuration:", secondDateDuration);
  }, [
    activeGameType,
    categoryFilter,
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
  ]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center">
        <BackIconButton
          bgColor="#0038A8"
          hoverColor="#004ccf"
          iconColor="#fff"
          size={30}
          onClick={() => {
            router.push("/winning-summary/dashboard");
          }} // this should be dynamic
        />
        <div className="text-3xl ml-3 font-bold">
           {(activeGameType === "Dashboard" ? "STL" : activeGameType)} Winnning Summary Overview
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full h-full mt-8">
        <div className="grid grid-cols-12 gap-4">
          {dateFilter === "Specific Date" && (
            <div className="col-span-12 md:col-span-8 flex flex-row gap-4">
              {/* Left Side */}
              <div className="flex flex-col gap-4 w-1/2">
                <FormControl>
                  <InputLabel id="category-label">
                    Filter by Category
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={categoryFilter}
                    label="Filter by Category"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (categoryTypes.includes(value as categoryType)) {
                        setCategoryFilter(value as categoryType);
                      }
                    }}
                    IconComponent={() => (
                      <FilterListIcon style={{ pointerEvents: "none" }} />
                    )}
                    sx={{ pr: 2 }}
                    // size="small"
                  >
                    {categoryTypes.map((gameType) => (
                      <MenuItem key={gameType} value={gameType}>
                        {gameType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="First Date"
                    value={firstDateSpecific ? dayjs(firstDateSpecific) : null}
                    onChange={(newValue) =>
                      newValue
                        ? setFirstDateSpecific(newValue.format("YYYY-MM-DD"))
                        : setFirstDateSpecific("")
                    }
                  />
                </LocalizationProvider>
              </div>

              {/* Right Side */}
              <div className="flex flex-col gap-4 w-1/2">
                <FormControl>
                  <InputLabel id="date-filter-label">Filter by Date</InputLabel>
                  <Select
                    labelId="date-filter-label"
                    id="date-filter"
                    value={dateFilter}
                    label="Filter by Date"
                    onChange={(e) => setDateFilter(e.target.value as dateType)}
                    IconComponent={() => (
                      <FilterListIcon style={{ pointerEvents: "none" }} />
                    )}
                    sx={{ pr: 2 }}
                  >
                    <MenuItem value="Specific Date">Specific Date</MenuItem>
                    <MenuItem value="Date Duration">Date Duration</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Second Date"
                    value={
                      secondDateSpecific ? dayjs(secondDateSpecific) : null
                    }
                    onChange={(newValue) =>
                      setSecondDateSpecific(newValue as unknown as string)
                    }
                  />
                </LocalizationProvider>
              </div>
            </div>
          )}

          {dateFilter === "Date Duration" && (
            <div className="col-span-12 flex flex-row gap-4">
              {/* Column 1 */}
              <div className="flex flex-col gap-4 w-1/4">
                <FormControl>
                  <InputLabel id="category-label">
                    Filter by Category
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={categoryFilter}
                    label="Filter by Category"
                    onChange={(e) =>
                      setCategoryFilter(e.target.value as categoryType)
                    }
                    IconComponent={() => (
                      <FilterListIcon style={{ pointerEvents: "none" }} />
                    )}
                    sx={{ pr: 2 }}
                  >
                    {categoryTypes.map((gameType) => (
                      <MenuItem key={gameType} value={gameType}>
                        {gameType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="First Date"
                    value={firstDateSpecific ? dayjs(firstDateSpecific) : null}
                    onChange={(newValue) =>
                      newValue
                        ? setFirstDateSpecific(newValue.format("YYYY-MM-DD"))
                        : setFirstDateSpecific("")
                    }
                  />
                </LocalizationProvider>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-4 w-1/4">
                <FormControl>
                  <InputLabel id="date-filter-label">Filter by Date</InputLabel>
                  <Select
                    labelId="date-filter-label"
                    id="date-filter"
                    value={dateFilter}
                    label="Filter by Date"
                    onChange={(e) => setDateFilter(e.target.value as dateType)}
                    IconComponent={() => (
                      <FilterListIcon style={{ pointerEvents: "none" }} />
                    )}
                    sx={{ pr: 2 }}
                  >
                    <MenuItem value="Specific Date">Specific Date</MenuItem>
                    <MenuItem value="Date Duration">Date Duration</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Second Date"
                    value={
                      secondDateSpecific ? dayjs(secondDateSpecific) : null
                    }
                    onChange={(newValue) =>
                      newValue
                        ? setSecondDateSpecific(newValue.format("YYYY-MM-DD"))
                        : setSecondDateSpecific("")
                    }
                  />
                </LocalizationProvider>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4 w-1/4">
                <div className="h-[56px]" />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="First Date"
                    value={firstDateDuration ? dayjs(firstDateDuration) : null}
                    onChange={(newValue) =>
                      newValue
                        ? setFirstDateDuration(newValue.format("YYYY-MM-DD"))
                        : setFirstDateDuration("")
                    }
                  />
                </LocalizationProvider>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-4 w-1/4">
                <div className="h-[56px]" />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Second Date"
                    value={
                      secondDateDuration ? dayjs(secondDateDuration) : null
                    }
                    onChange={(newValue) =>
                      newValue
                        ? setSecondDateDuration(newValue.format("YYYY-MM-DD"))
                        : setSecondDateDuration("")
                    }
                  />
                </LocalizationProvider>
              </div>
            </div>
          )}
        </div>

        {/* Conditional MUI Chart Rendering */}
        {categoryFilter === "Top Winning Region by Total Winnings" ||
        categoryFilter === "Top Winner Region by Total Winners" ? (
          <ChartTopRegionByWinsandWinners
            activeGameType={activeGameType}
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            firstDateSpecific={formattedFirstDateSpecific}
            secondDateSpecific={formattedSecondDateSpecific}
            firstDateDuration={formattedFirstDateDuration}
            secondDateDuration={formattedSecondDateDuration}
          />
        ) : (
          <>
            <ChartWinnersandWinningsSummary
              activeGameType={activeGameType}
              categoryFilter={categoryFilter}
              dateFilter={dateFilter}
              firstDateSpecific={formattedFirstDateSpecific}
              secondDateSpecific={formattedSecondDateSpecific}
              firstDateDuration={formattedFirstDateDuration}
              secondDateDuration={formattedSecondDateDuration}
            />
            <ChartWinnersandWinningsRegionalSummary
              activeGameType={activeGameType}
              categoryFilter={categoryFilter}
              dateFilter={dateFilter}
              firstDateSpecific={formattedFirstDateSpecific}
              secondDateSpecific={formattedSecondDateSpecific}
              firstDateDuration={formattedFirstDateDuration}
              secondDateDuration={formattedSecondDateDuration}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WinningComparison;
