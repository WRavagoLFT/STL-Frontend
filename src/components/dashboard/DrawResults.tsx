import React, { useState, useEffect } from "react";
import { FaBroadcastTower } from "react-icons/fa";
import { getTodaysWinningCombination } from "../../utils/api/winningcombinations";
import { fetchRegions, fetchProvinces } from "../../utils/api/location";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import Select from "react-select";

const DrawResultsPage = () => {
  // States for filters
  const [selectedRegion, setSelectedRegion] = useState<number | "">("");
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedGameCategory, setSelectedGameCategory] = useState<number | "">(
    ""
  );
  const [filteredWinningCombinations, setFilteredWinningCombinations] =
    useState<any[]>([]);

  // Data states
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

  // Prepare options for selects
  const gameCategoryOptions = gameCategories.map((cat) => ({
    value: cat.GameCategoryId,
    label: cat.GameCategory,
  }));

  const regionOptions = regions.map((region) => ({
    value: region.RegionId,
    label: region.RegionName,
  }));

  // Filter provinces based on selectedRegion
  const filteredProvinceOptions = provinces
    .filter((p) => selectedRegion === "" || p.RegionId === selectedRegion)
    .map((province) => ({
      value: province.ProvinceId,
      label: province.ProvinceName,
    }));

  // Find selected options
  const selectedGameCategoryOption = gameCategoryOptions.find(
    (option) => option.value === Number(selectedGameCategory)
  );
  const selectedRegionOption = regionOptions.find(
    (option) => option.value === Number(selectedRegion)
  );
  const selectedProvinceOption = filteredProvinceOptions.find(
    (option) => option.value === Number(selectedProvince)
  );

  useEffect(() => {
    async function loadData() {
      const regionsRes = await fetchRegions();
      if (regionsRes.success) setRegions(regionsRes.data);

      const provincesRes = await fetchProvinces();
      if (provincesRes.success)
        setProvinces(provincesRes.data.filter((p: any) => p.RegionId !== 0));

      const gameCategoriesRes = await fetchGameCategories();
      if (gameCategoriesRes.success) setGameCategories(gameCategoriesRes.data);
    }
    loadData();
  }, []);

  // Load winning combinations only when provinces, regions, and gameCategories are loaded
  useEffect(() => {
    const loadWinningCombinations = async () => {
      const response = await getTodaysWinningCombination();
      if (response.success) {
        // Enrich data with names from provinces, regions, and gameCategories
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
    //console.log("useEffect triggered with:");
    //console.log("Selected Region:", selectedRegion);
    //console.log("Selected Province:", selectedProvince);
    //console.log("Selected Game Category:", selectedGameCategory);
    //console.log("Original winningCombinations:", winningCombinations);

    let filtered = winningCombinations;

    const regionId = selectedRegion ? Number(selectedRegion) : null;
    const provinceId = selectedProvince ? Number(selectedProvince) : null;
    const gameCategoryId = selectedGameCategory
      ? Number(selectedGameCategory)
      : null;

    // console.log("Parsed filter values:", {
    //   regionId,
    //   provinceId,
    //   gameCategoryId,
    // });

    if (regionId !== null) {
      filtered = filtered.filter((c) => c.RegionId === regionId);
      //console.log(`Filtered by RegionId (${regionId}):`, filtered);
    }

    if (provinceId !== null) {
      filtered = filtered.filter((c) => c.ProvinceId === provinceId);
      //console.log(`Filtered by ProvinceId (${provinceId}):`, filtered);
    }

    if (gameCategoryId !== null) {
      filtered = filtered.filter((c) => c.GameCategoryId === gameCategoryId);
      //console.log(`Filtered by GameCategoryId (${gameCategoryId}):`, filtered);
    }

    setFilteredWinningCombinations(filtered);
    //console.log("Final filtered combinations set:", filtered);
  }, [
    selectedRegion,
    selectedProvince,
    selectedGameCategory,
    winningCombinations,
  ]);

  // Helper
  const displayValue = (value: string | number) => {
    return value === 0 || value === "0" ? "0" : value || "\u00A0";
  };

  return (
    <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div className="flex mb-2 items-center w-full">
        <div className="bg-[#0038A8] rounded-lg p-1">
          <FaBroadcastTower size={24} color={"#F6BA12"} />
        </div>
        <div className="flex items-center justify-between flex-1 ml-3">
          <p className="text-base">Draw Results Today</p>
          <button className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            View Draw Result
          </button>
        </div>
      </div>

      <div className="h-px bg-[#303030] mb-4" />

      <div className="flex gap-4 w-full mt-2 mb-4">
        {/* Game Category Select */}
        <div className="w-full relative">
          <Select
            id="gamecategory-select"
            value={selectedGameCategoryOption ?? null}
            onChange={(option) => setSelectedGameCategory(option?.value || "")}
            options={gameCategoryOptions}
            placeholder="Select a Game Category"
            classNamePrefix="react-select-dashboard"  
            styles={{
              control: (provided, state) => ({
                ...provided,
                borderRadius: "0.5rem",
                color: '#2F2F2F',
                padding: "0.25rem",
                boxShadow: state.isFocused
                  ? "none"
                  : provided.boxShadow,
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#F8C73F",
                zIndex: 10,
              }),
            }}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        {/* Region Select */}
        <div className="w-full relative">
          <Select
            id="region-select"
            value={selectedRegionOption ?? null}
            onChange={(option) => {
              setSelectedRegion(option?.value ?? "");
              setSelectedProvince("");
            }}
            isDisabled={!selectedGameCategory}
            options={regionOptions}
            placeholder="Select a Region"
            classNamePrefix="react-select-dashboard"
            styles={{
              control: (provided, state) => ({
                ...provided,
                borderRadius: "0.5rem",
                padding: "0.25rem",
                boxShadow: state.isFocused
                  ? "none"
                  : provided.boxShadow,
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#F8C73F",
                zIndex: 10,
              }),
            }}
          />
        </div>

        {/* Province Select */}
        <div className="w-full relative">
          <Select
            id="province-select"
            value={selectedProvinceOption ?? null}
            onChange={(option) => setSelectedProvince(option?.value || "")}
            options={filteredProvinceOptions}
            placeholder="Select a Province"
            isDisabled={!selectedRegion}
            classNamePrefix="react-select-dashboard"
            styles={{
              control: (provided, state) => ({
                ...provided,
                borderRadius: "0.5rem",
                padding: "0.25rem",
                boxShadow: state.isFocused
                  ? "none"
                  : provided.boxShadow,
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#F8C73F",
                zIndex: 10,
              }),
            }}
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

            // Determine boxes count; fallback to 2 if no item or invalid state
            const gameCategoryId = item?.GameCategoryId ?? 0;
            const totalBoxes =
              gameCategoryId >= 4 ? 4 : gameCategoryId >= 3 ? 3 : 2;
            const displayInGrid = totalBoxes > 2;

            return (
            <div key={gameTypeId} className="flex-1 min-w-0">
              <p className="text-sm font-light mb-1">
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
                {/* Box 1 */}
                <div
                  className={`bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center 
                    ${displayInGrid ? "w-[calc(50%-4px)]" : "w-full sm:flex-1"}`}
                >
                  <p className="font-bold text-2xl text-center break-words">
                    {displayValue(item?.WinningCombinationOne ?? "-")}
                  </p>
                </div>

                {/* Box 2 */}
                <div
                  className={`bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center 
                    ${displayInGrid ? "w-[calc(50%-4px)]" : "w-full sm:flex-1"}`}
                >
                  <p className="font-bold text-2xl text-center break-words">
                    {displayValue(item?.WinningCombinationTwo ?? "-")}
                  </p>
                </div>

                {/* Box 3 */}
                {totalBoxes >= 3 && (
                  <div className="bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center w-full sm:w-[calc(50%-4px)]">
                    <p className="font-bold text-2xl text-center break-words">
                      {displayValue(item?.WinningCombinationThree ?? "-")}
                    </p>
                  </div>
                )}

                {/* Box 4 */}
                {totalBoxes >= 4 && (
                  <div className="bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center w-full sm:w-[calc(50%-4px)]">
                    <p className="font-bold text-2xl text-center break-words">
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
