"use client";

import React, { useState, useEffect } from "react";
import { FaBroadcastTower } from "react-icons/fa";
import { getTodaysWinningCombination } from "../../utils/api/winningcombinations";
import { fetchRegions, fetchProvinces } from "../../utils/api/location";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import Select from "react-select";
import router from "next/router";

const DrawResultsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<number | "">("");
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedGameCategory, setSelectedGameCategory] = useState<number | "">(
    ""
  );
  const [filteredWinningCombinations, setFilteredWinningCombinations] =
    useState<any[]>([]);

  const [regions, setRegions] = useState<
    { RegionName: string; RegionId: number; Region: string }[]
  >([]);
  const [provinces, setProvinces] = useState<
    {
      ProvinceName: string;
      ProvinceId: number;
      Province: string;
      RegionId: number;
    }[]
  >([]);
  const [gameCategories, setGameCategories] = useState<
    { GameCategoryId: number; GameCategory: string }[]
  >([]);
  const [winningCombinations, setWinningCombinations] = useState<
    {
      RegionId: number;
      RegionName: string;
      ProvinceId: number;
      ProvinceName: string;
      GameTypeId: number;
      GameType: string;
      GameCategoryId: number;
      GameCategory: string;
      GameScheduleID: number;
      WinningCombinationOne: string;
      WinningCombinationTwo: string;
      WinningCombinationThree?: string;
      WinningCombinationFour?: string;
    }[]
  >([]);

  const gameCategoryOptions = gameCategories.map((cat) => ({
    value: cat.GameCategoryId,
    label: cat.GameCategory,
  }));

  const regionOptions = regions.map((region) => ({
    value: region.RegionId,
    label: region.RegionName,
  }));

  const filteredProvinceOptions = provinces
    .filter((p) => selectedRegion === "" || p.RegionId === selectedRegion)
    .map((province) => ({
      value: province.ProvinceId,
      label: province.ProvinceName,
    }));

  const selectedGameCategoryOption = gameCategoryOptions.find(
    (option) => option.value === Number(selectedGameCategory)
  );
  const selectedRegionOption = regionOptions.find(
    (option) => option.value === Number(selectedRegion)
  );
  const selectedProvinceOption = filteredProvinceOptions.find(
    (opt) => String(opt.value) === String(selectedProvince)
  );

  useEffect(() => {
    async function loadData() {
      const regionsRes = await fetchRegions();
      const provincesRes = await fetchProvinces();
      const gameCategoriesRes = await fetchGameCategories();

      if (regionsRes.success) {
        setRegions(regionsRes.data);
      }

      if (provincesRes.success) {
        const filteredProvinces = provincesRes.data.filter(
          (p: any) => p.RegionId !== 0
        );
        setProvinces(filteredProvinces);
      }

      if (gameCategoriesRes.success) {
        setGameCategories(gameCategoriesRes.data);
      }

      setSelectedRegion(1);
      setSelectedGameCategory(1);
    }

    loadData();
  }, []);

  useEffect(() => {
    const loadWinningCombinations = async () => {
      const response = await getTodaysWinningCombination();
      if (response.success) {
        const enrichedCombinations = response.data.map((combination: any) => {
          const matchedProvince = provinces.find(
            (prov) => Number(prov.ProvinceId) === Number(combination.ProvinceId)
          );
          const matchedRegion = regions.find(
            (reg) => Number(reg.RegionId) === Number(combination.RegionId)
          );
          const matchedGameCategory = gameCategories.find(
            (cat) =>
              Number(cat.GameCategoryId) === Number(combination.GameCategoryId)
          );

          return {
            ...combination,
            ProvinceName: matchedProvince?.ProvinceName || "Unknown Province",
            RegionName: matchedRegion?.RegionName || "Unknown Region",
            GameCategory:
              matchedGameCategory?.GameCategory || "Unknown Game Category",
          };
        });
        setWinningCombinations(enrichedCombinations);
      } else {
        console.error(
          "Failed to fetch winning combinations:",
          response.message
        );
      }
    };

    if (
      provinces.length > 0 &&
      regions.length > 0 &&
      gameCategories.length > 0
    ) {
      loadWinningCombinations();
    }
  }, [provinces, regions, gameCategories]);

  useEffect(() => {
    let filtered = winningCombinations;

    const regionId = selectedRegion ? Number(selectedRegion) : null;
    const provinceId = selectedProvince ? Number(selectedProvince) : null;
    const gameCategoryId = selectedGameCategory
      ? Number(selectedGameCategory)
      : null;

    if (regionId !== null) {
      filtered = filtered.filter((c) => c.RegionId === regionId);
    }

    if (provinceId !== null) {
      filtered = filtered.filter((c) => c.ProvinceId === provinceId);
    }

    if (gameCategoryId !== null) {
      filtered = filtered.filter((c) => c.GameCategoryId === gameCategoryId);
    }

    setFilteredWinningCombinations(filtered);
  }, [
    selectedRegion,
    selectedProvince,
    selectedGameCategory,
    winningCombinations,
  ]);

  useEffect(() => {
    const regionId = selectedRegion ? Number(selectedRegion) : null;

    if (regionId !== null) {
      fetchProvinces({ regionId }).then((res) => {
        if (res.success) {
          setProvinces(res.data);

          const defaultProvince = res.data.find((p: any) => p.ProvinceId === 1);
          if (defaultProvince) {
            setSelectedProvince(1);
          } else {
            setSelectedProvince("");
          }
        }
      });
    }
  }, [selectedRegion]);

  const displayValue = (value: string | number) => {
    return value === 0 || value === "0" ? "0" : value || "\u00A0";
  };

  return (
    <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div className="w-full mb-2 flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaBroadcastTower size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">Draw Results Today</p>
        </div>
        <div className="mt-2 lg:mt-4 xl:mt-0">
          <button
            onClick={() => {
              router.push("/draw-summary");
            }}
            className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
          >
            View Draw Result
          </button>
        </div>
      </div>
      <div className="h-px bg-[#303030] mb-4" />
      <div className="flex gap-4 w-full mt-2 mb-4">
        <div className="w-full relative">
          <Select
            id="gamecategory-select"
            value={selectedGameCategoryOption ?? null}
            onChange={(option) => setSelectedGameCategory(option?.value || "")}
            options={gameCategoryOptions}
            placeholder="Select a Game Category"
            classNamePrefix="custom-select"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="w-full relative">
          <Select
            id="region-select"
            value={selectedRegionOption ?? null}
            onChange={(option) => {
              setSelectedRegion(option?.value ?? "");
              setSelectedProvince("");
            }}
            options={regionOptions}
            placeholder="Select a Region"
            classNamePrefix="custom-select"
          />
        </div>
        <div className="w-full relative">
          <Select
            id="province-select"
            value={selectedProvinceOption ?? null}
            onChange={(option) => setSelectedProvince(option?.value || "")}
            options={filteredProvinceOptions}
            placeholder="Select a Province"
            classNamePrefix="custom-select" 
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        <div className="flex gap-4 justify-between w-full">
          {[1, 2, 3].map((gameTypeId) => {
            const item =
              selectedGameCategory && selectedRegion && selectedProvince
                ? filteredWinningCombinations.find(
                    (combo) => combo.GameScheduleID === gameTypeId
                  )
                : null;

            const totalBoxes =
              Number(selectedGameCategory) === 4
                ? 4
                : Number(selectedGameCategory) === 3
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
                  <div
                    className={`bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center 
                      ${displayInGrid ? "w-[calc(50%-4px)]" : "w-full sm:flex-1"}`}
                  >
                    <p className="font-bold text-base md:text-2xl text-center break-words">
                      {displayValue(item?.WinningCombinationOne ?? "-")}
                    </p>
                  </div>

                  <div
                    className={`bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center 
                      ${displayInGrid ? "w-[calc(50%-4px)]" : "w-full sm:flex-1"}`}
                  >
                    <p className="font-bold text-base md:text-2xl text-center break-words">
                      {displayValue(item?.WinningCombinationTwo ?? "-")}
                    </p>
                  </div>

                  {totalBoxes >= 3 && (
                    <div className="bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center w-full sm:w-[calc(50%-4px)]">
                      <p className="font-bold text-base md:text-2xl text-center break-words">
                        {displayValue(item?.WinningCombinationThree ?? "-")}
                      </p>
                    </div>
                  )}

                  {totalBoxes >= 4 && (
                    <div className="bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center w-full sm:w-[calc(50%-4px)]">
                      <p className="font-bold text-base md:text-2xl text-center break-words">
                        {displayValue(item?.WinningCombinationFour ?? "-")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DrawResultsPage;
