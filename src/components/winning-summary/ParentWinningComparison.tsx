"use client";

import React, { useMemo, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import BackIconButton from "~/components/ui/icons/BackButton";
import { useRouter } from "next/navigation";
import { categoryType, useWinningStore } from "~/store/useWinningStore";
import ChartWinnersandWinningsSummary from "~/components/winning-summary/wins-comparison/SummaryWinners&Winnings";
import ChartWinnersandWinningsRegionalSummary from "~/components/winning-summary/wins-comparison/RegionalSummaryWinners&Winnings";
import ChartTopRegionByWinsandWinners from "~/components/winning-summary/wins-comparison/TopRegionWinning";
import { AccessGuard } from "~/components/auth/AccessGuard";
import dayjs from "dayjs";
import Swal from "sweetalert2";

type dateType = "Specific Date" | "Date Duration";

type Props = {
  gameCategoryId?: number;
  slug?: string;
  mainSlug?: string;
};

const WinningComparisonPage = ({ gameCategoryId = 0, slug, mainSlug }: Props) => {
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
  } = useWinningStore();

  const router = useRouter();
  const GAME_TITLES = [
    "STL",
    "STL Pares",
    "STL Swer 2",
    "STL Swer 3",
    "STL Swer 4",
  ];
  const title = GAME_TITLES[gameCategoryId] || "STL";

  // Local state for Second Duration to avoid overwriting global state
  const [secondDurationFrom, setSecondDurationFrom] = useState<string>("");
  const [secondDurationTo, setSecondDurationTo] = useState<string>("");

  const formattedFirstDateSpecific = useMemo(
    () => (firstDateSpecific ? dayjs(firstDateSpecific).format("MM/DD/YYYY") : null),
    [firstDateSpecific]
  );
  const formattedSecondDateSpecific = useMemo(
    () => (secondDateSpecific ? dayjs(secondDateSpecific).format("MM/DD/YYYY") : null),
    [secondDateSpecific]
  );
  const formattedFirstDateDuration = useMemo(
    () => (firstDateDuration ? dayjs(firstDateDuration).format("MM/DD/YYYY") : null),
    [firstDateDuration]
  );
  const formattedSecondDateDuration = useMemo(
    () => (secondDateDuration ? dayjs(secondDateDuration).format("MM/DD/YYYY") : null),
    [secondDateDuration]
  );

  const categoryTypes: categoryType[] = [
    "Total Winnings and Winners",
    "Total Winnings by Bet Type",
    "Total Winnings by Game Type",
    "Top Winning Region by Total Winnings",
    "Top Winner Region by Total Winners",
    "Total Winners by Bet Type",
    "Total Winners by Game Type",
  ];

  const handleDateChange = (
    setter: (date: string) => void,
    date: string,
    compareDate?: string | null | undefined,
    isSecondDuration: boolean = false
  ) => {
    // Validate "To" date is not before "From" date
    if (compareDate && dayjs(date).isBefore(dayjs(compareDate))) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "End date must be after start date",
      });
      return;
    }

    // For Second Duration, prevent selecting dates within First Duration range
    if (isSecondDuration && firstDateDuration && secondDateDuration) {
      const selectedDate = dayjs(date);
      const firstDurationStart = dayjs(firstDateDuration);
      const firstDurationEnd = dayjs(secondDateDuration);
      if (
        selectedDate.isAfter(firstDurationStart.subtract(1, "day")) &&
        selectedDate.isBefore(firstDurationEnd.add(1, "day"))
      ) {
        Swal.fire({
          icon: "error",
          title: "Invalid Date",
          text: "Second duration cannot select dates within the first duration range",
        });
        return;
      }
    }

    setter(date);
  };

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <div className="w-full p-4">
        <div className="flex items-center">
          <BackIconButton
            bgColor="#0038A8"
            hoverColor="#004ccf"
            iconColor="#fff"
            size={30}
            onClick={() => {
              if (mainSlug) {
                router.push(`/winning-summary/${mainSlug}`);
              } else {
                router.push("/winning-summary");
              }
            }}
          />
          <h1 className="text-3xl ml-3 font-bold text-[#0038A8]">
            {title} Winning Summary Overview
          </h1>
        </div>
        <div className="mt-8 space-y-4">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as categoryType)}
                className="block w-full pl-3 pr-10 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                aria-label="Filter by category"
              >
                {categoryTypes.map((gameType) => (
                  <option key={gameType} value={gameType}>
                    {gameType}
                  </option>
                ))}
              </select>
              <FilterListIcon
                className="absolute right-3 top-8 text-[#ACA993] pointer-events-none"
                aria-hidden="true"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="date-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Date
              </label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as dateType)}
                className="block w-full pl-3 pr-10 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                aria-label="Filter by date"
              >
                <option value="Specific Date">Specific Date</option>
                <option value="Date Duration">Date Duration</option>
              </select>
              <FilterListIcon
                className="absolute right-3 top-8 text-[#ACA993] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Specific Date Inputs */}
          {dateFilter === "Specific Date" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="from-date-specific"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From
                </label>
                <input
                  type="date"
                  id="from-date-specific"
                  value={firstDateSpecific || ""}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => handleDateChange(setFirstDateSpecific, e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                  aria-label="Select start date for specific date"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="to-date-specific"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To
                </label>
                <input
                  type="date"
                  id="to-date-specific"
                  value={secondDateSpecific || ""}
                  min={firstDateSpecific || undefined}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => handleDateChange(setSecondDateSpecific, e.target.value, firstDateSpecific)}
                  className="block w-full pl-3 pr-3 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                  aria-label="Select end date for specific date"
                />
              </div>
            </div>
          )}

          {/* Date Duration Inputs */}
          {dateFilter === "Date Duration" && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3 flex flex-col">
                <label
                  htmlFor="first-date-duration-from"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Duration From
                </label>
                <input
                  type="date"
                  id="first-date-duration-from"
                  value={firstDateDuration || ""}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => handleDateChange(setFirstDateDuration, e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                  aria-label="Select start date for first duration"
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex flex-col">
                <label
                  htmlFor="first-date-duration-to"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Duration To
                </label>
                <input
                  type="date"
                  id="first-date-duration-to"
                  value={secondDateDuration || ""}
                  min={firstDateDuration || undefined}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => handleDateChange(setSecondDateDuration, e.target.value, firstDateDuration)}
                  className="block w-full pl-3 pr-3 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                  aria-label="Select end date for first duration"
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex flex-col">
                <label
                  htmlFor="second-date-duration-from"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Second Duration From
                </label>
                <input
                  type="date"
                  id="second-date-duration-from"
                  value={secondDurationFrom}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => handleDateChange(setSecondDurationFrom, e.target.value, undefined, true)}
                  className="block w-full pl-3 pr-3 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                  aria-label="Select start date for second duration"
                  title="Second duration is for UI display only and does not affect data"
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex flex-col">
                <label
                  htmlFor="second-date-duration-to"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Second Duration To
                </label>
                <input
                  type="date"
                  id="second-date-duration-to"
                  value={secondDurationTo}
                  min={secondDurationFrom || undefined}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => handleDateChange(setSecondDurationTo, e.target.value, secondDurationFrom, true)}
                  className="block w-full pl-3 pr-3 py-2 text-base bg-[#F8F0E3] border border-[#0038A8] rounded-md focus:outline-none appearance-none"
                  aria-label="Select end date for second duration"
                  title="Second duration is for UI display only and does not affect data"
                />
              </div>
            </div>
          )}

          {/* Charts */}
          {categoryFilter === "Top Winning Region by Total Winnings" ||
          categoryFilter === "Top Winner Region by Total Winners" ? (
            <ChartTopRegionByWinsandWinners
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
              <ChartWinnersandWinningsSummary
                gameCategoryId={gameCategoryId}
                categoryFilter={categoryFilter}
                dateFilter={dateFilter}
                firstDateSpecific={formattedFirstDateSpecific}
                secondDateSpecific={formattedSecondDateSpecific}
                firstDateDuration={formattedFirstDateDuration}
                secondDateDuration={formattedSecondDateDuration}
              />
              <ChartWinnersandWinningsRegionalSummary
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
    </AccessGuard>
  );
};

export default WinningComparisonPage;