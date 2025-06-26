"use client";

import React, { useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ChartBettorsAndBetsSummary from "~/components/betting-summary/bets-comparison/SummaryTotalBetsAndBettors/SummaryBettors&Bets";
import ChartBettorsAndBetsRegionalSummary from "~/components/betting-summary/bets-comparison/RegionalSummaryBettorsAndBets/RegionalSummaryBettors&Bets";
import ChartTopRegionByBetsandBettors from "~/components/betting-summary/bets-comparison/TopRegionBetting";
import dayjs from "dayjs";
import BackIconButton from "~/components/ui/icons/BackButton";
import { useRouter } from "next/navigation";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { categoryType, useBettingStore } from "~/store/useBettingStore";

type dateType = "Specific Date" | "Date Duration";

const ParentComparisonBetting = ({
  gameCategoryId = 0,
  slug,
  mainSlug,
}: {
  gameCategoryId?: number;
  slug?: string;
  mainSlug?: string;
}) => {
  const {
    categoryFilter,
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    setCategoryFilter,
    setDateFilter,
    setFirstDateSpecific,
    setSecondDateSpecific,
    setFirstDateDuration,
    setSecondDateDuration,
  } = useBettingStore();

  const router = useRouter();
  const GAME_TITLES = [
    "STL",
    "STL Pares",
    "STL Swer 2",
    "STL Swer 3",
    "STL Swer 4",
  ];
  const title = GAME_TITLES[gameCategoryId];

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

  const categoryTypes: categoryType[] = [
    "Total Bettors and Bets",
    "Total Bets by Bet Type",
    "Total Bets by Game Type",
    "Top Betting Region by Total Bets",
    "Top Betting Region by Total Bettors",
    "Total Bettors by Bet Type",
    "Total Bettors by Game Type",
  ];

  useEffect(() => {}, [
    categoryFilter,
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
  ]);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-row items-center">
          <BackIconButton
            bgColor="#0038A8"
            hoverColor="#004ccf"
            iconColor="#fff"
            size={30}
            onClick={() => {
              if (mainSlug) {
                router.push(`/betting-summary/${mainSlug}`);
              } else {
                router.push("/betting-summary");
              }
            }}
          />
          <div className="text-3xl ml-3 font-bold">
            {title === "Dashboard" ? "STL" : title} Betting Summary Overview
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
                      value={
                        firstDateSpecific ? dayjs(firstDateSpecific) : null
                      }
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
                    <InputLabel id="date-filter-label">
                      Filter by Date
                    </InputLabel>
                    <Select
                      labelId="date-filter-label"
                      id="date-filter"
                      value={dateFilter}
                      label="Filter by Date"
                      onChange={(e) =>
                        setDateFilter(e.target.value as dateType)
                      }
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
                      value={
                        firstDateSpecific ? dayjs(firstDateSpecific) : null
                      }
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
                    <InputLabel id="date-filter-label">
                      Filter by Date
                    </InputLabel>
                    <Select
                      labelId="date-filter-label"
                      id="date-filter"
                      value={dateFilter}
                      label="Filter by Date"
                      onChange={(e) =>
                        setDateFilter(e.target.value as dateType)
                      }
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
                      value={
                        firstDateDuration ? dayjs(firstDateDuration) : null
                      }
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
          {categoryFilter === "Top Betting Region by Total Bets" ||
          categoryFilter === "Top Betting Region by Total Bettors" ? (
            <ChartTopRegionByBetsandBettors // if the condition is true
              gameCategoryId={gameCategoryId}
              categoryFilter={categoryFilter}
              dateFilter={dateFilter}
              firstDateSpecific={formattedFirstDateSpecific}
              secondDateSpecific={formattedSecondDateSpecific}
              firstDateDuration={formattedFirstDateDuration}
              secondDateDuration={formattedSecondDateDuration}
            />
          ) : (
            <>
              <ChartBettorsAndBetsSummary // if false
                gameCategoryId={gameCategoryId}
                categoryFilter={categoryFilter}
                dateFilter={dateFilter}
                firstDateSpecific={formattedFirstDateSpecific}
                secondDateSpecific={formattedSecondDateSpecific}
                firstDateDuration={formattedFirstDateDuration}
                secondDateDuration={formattedSecondDateDuration}
              />
              <ChartBettorsAndBetsRegionalSummary // if false
                gameCategoryId={gameCategoryId}
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
    </>
  );
};

export default ParentComparisonBetting;
