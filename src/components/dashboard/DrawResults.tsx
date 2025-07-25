"use client";

import React from "react";
import { FaBroadcastTower } from "react-icons/fa";
import Select from "react-select";
import router from "next/router";

interface DrawResultsPanelProps {
  filteredWinningCombinations: any[];
  regionOptions: any[];
  provinceOptions: any[];
  gameCategoryOptions: any[];
  selectedRegionOption: any;
  selectedProvinceOption: any;
  selectedGameCategoryOption: any;
  onRegionChange: (value: number | "") => void;
  onProvinceChange: (value: number | "") => void;
  onGameCategoryChange: (value: number | "") => void;
  loading?: boolean;
}

const displayValue = (value: string | number) => {
  return value === 0 || value === "0" ? "0" : value || "\u00A0";
};

const DrawResultsPanel = ({
  filteredWinningCombinations,
  regionOptions,
  provinceOptions,
  gameCategoryOptions,
  selectedRegionOption,
  selectedProvinceOption,
  selectedGameCategoryOption,
  onRegionChange,
  onProvinceChange,
  onGameCategoryChange,
  loading,
}: DrawResultsPanelProps) => {
  return (
    <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      {/* Header */}
      <div className="w-full mb-2 flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaBroadcastTower size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">Draw Results Today</p>
        </div>
        <div className="mt-2 lg:mt-4 xl:mt-0">
          <button
            onClick={() => router.push("/draw-summary")}
            disabled={loading}
            className={`rounded-lg px-3 py-2 text-[0.8rem] text-white transition
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0038A8] hover:bg-blue-700"}`}>
            View Draw Result
          </button>
        </div>
      </div>

      <div className="h-px bg-[#303030] mb-4" />

      {/* Filters */}
      <div className="flex gap-4 w-full mt-2 mb-4">
        <div className="w-full">
          <Select
            value={selectedGameCategoryOption ?? null}
            onChange={(option) => onGameCategoryChange(option?.value || "")}
            options={gameCategoryOptions}
            placeholder="Select a Game Category"
            classNamePrefix="custom-select"
            styles={selectStyles}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="w-full">
          <Select
            value={selectedRegionOption ?? null}
            onChange={(option) => onRegionChange(option?.value || "")}
            options={regionOptions}
            placeholder="Select a Region"
            classNamePrefix="custom-select"
            styles={selectStyles}
          />
        </div>
        <div className="w-full">
          <Select
            value={selectedProvinceOption ?? null}
            onChange={(option) => onProvinceChange(option?.value || "")}
            options={provinceOptions}
            placeholder="Select a Province"
            classNamePrefix="custom-select"
            styles={selectStyles}
          />
        </div>
      </div>

      {/* Winning Combinations Grid */}
      <div className="mt-4 w-full">
        <div className="flex gap-4 justify-between w-full">
          {[1, 2, 3].map((gameTypeId) => {
            const item = filteredWinningCombinations.find(
              (combo) => combo.GameScheduleID === gameTypeId
            );

            const totalBoxes =
              Number(selectedGameCategoryOption?.value) === 4
                ? 4
                : Number(selectedGameCategoryOption?.value) === 3
                ? 3
                : 2;

            const displayInGrid = totalBoxes > 2;

            return (
              <div key={gameTypeId} className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-light mb-1">
                  {gameTypeId === 1
                    ? "First Draw"
                    : gameTypeId === 2
                    ? "Second Draw"
                    : "Third Draw"}
                </p>

                <div
                  className={`flex flex-wrap gap-2 w-full ${
                    displayInGrid ? "" : "sm:flex-nowrap"
                  }`}
                >
                  {[1, 2, 3, 4].slice(0, totalBoxes).map((boxNum) => (
                    <div
                      key={boxNum}
                      className={`${
                        loading
                          ? "animate-pulse bg-gray-300 border border-gray-300"
                          : "bg-transparent border border-[#0038A8]"
                      } rounded-lg p-2 flex items-center justify-center ${
                        displayInGrid ? "w-[calc(50%-4px)]" : "w-full sm:flex-1"
                      }`}
                    >
                      <p
                        className={`font-bold text-base md:text-2xl text-center break-words ${
                          loading ? "text-transparent" : ""
                        }`}
                      >
                        {loading
                          ? "000"
                          : displayValue(
                              item?.[
                                `WinningCombination${["One", "Two", "Three", "Four"][boxNum - 1]}`
                              ] ?? "-"
                            )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DrawResultsPanel;

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "0.875rem",
    minHeight: "35px",
    height: "32px",
    borderRadius: "9px",
    borderColor: "#0038A8",
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#0038A8",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 10,
  }),
};
