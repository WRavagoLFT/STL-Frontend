import React, { useEffect, useState } from "react";
import { fetchProvinces, fetchRegions } from "~/utils/api/location";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { fetchDrawSummary } from "~/utils/api/transactions";
import Select from "react-select";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { useAuthStore } from "~/store/useAuthStore";

const DrawListSummaryPage = React.lazy(
  () => import("~/components/draw-summary/DrawListSummary")
);
const HotNumberPage = React.lazy(
  () => import("~/components/draw-summary/HotNumbers")
);
const ColdNumberPage = React.lazy(
  () => import("~/components/draw-summary/ColdNumbers")
);
const DrawCounterTablePage = React.lazy(
  () => import("~/components/draw-summary/DrawCounterTable")
);
const DrawResultsSummaryPage = React.lazy(
  () => import("~/components/draw-summary/DrawResultsSummary")
);

const DrawSelectedPage = () => {
  const [regions, setRegions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [provinces, setProvinces] = useState<any[]>([]);
  const [gameCategories, setGameCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [filteredProvinces, setFilteredProvinces] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedRegion, setSelectedRegion] = useState("1");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedGameCategory, setSelectedGameCategory] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [data, setData] = useState<any>({});
  const todayDate = new Date().getDate();
  const [gameCategoryMap, setGameCategoryMap] = useState<Map<string, string>>(
    new Map()
  );
  const [isViewing, setIsViewing] = useState(false);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const fetchData = async () => {
    const dataFetch = await fetchDrawSummary(
      Number(selectedProvince),
      Number(selectedGameCategory),
      Number(selectedMonth)
    );
    setData(dataFetch.data);
  };

  const loadData = async () => {
    const regionFetch = await fetchRegions();
    if (regionFetch?.data && Array.isArray(regionFetch.data)) {
      setRegions(
        regionFetch.data
          .filter((region: any) => region?.RegionName && region?.RegionId)
          .map((region: any) => ({
            label: region.RegionName,
            value: region.RegionId.toString(),
          }))
      );
    }

    const provinceFetch = await fetchProvinces();
    setProvinces(provinceFetch.data);

    if (provinceFetch.data) {
      const filteredProvinces = provinceFetch.data.filter((province: any) => {
        return province && province.RegionId === selectedRegion;
      });

      setFilteredProvinces(
        filteredProvinces
          .filter(
            (province: any) => province.ProvinceId && province.ProvinceName
          )
          .map((province: any) => ({
            label: province.ProvinceName,
            value: province.ProvinceId.toString(),
          }))
      );
    }

    setSelectedRegion("1");
    setSelectedProvince("1");

    const gameCategoryFetch = await fetchGameCategories();
    if (gameCategoryFetch?.data) {
      const options = gameCategoryFetch.data.map((gameCategory: any) => ({
        label: gameCategory.GameCategory,
        value: gameCategory.GameCategoryId.toString(),
      }));
      const gameMap = new Map<string, string>();
      gameCategoryFetch.data.forEach((gc: any) => {
        gameMap.set(gc.GameCategoryId.toString(), gc.GameCategory);
      });
      setGameCategories(options); 
      setGameCategoryMap(gameMap); 
    }
  };

  useEffect(() => {
    loadData();
    fetchData();
  }, []);

  useEffect(() => {
    if (provinces.length > 0 && selectedRegion) {
      const filteredProvinces = provinces.filter((province) => {
        return province.RegionId == selectedRegion;
      });

      const mappedProvinces = filteredProvinces.map((province: any) => ({
        label: province.ProvinceName,
        value: province.ProvinceId.toString(),
      }));

      setFilteredProvinces(mappedProvinces);

      if (mappedProvinces.length > 0) {
        setSelectedProvince(mappedProvinces[0].value); 
      } else {
        setSelectedProvince(""); 
      }
    }
  }, [selectedRegion, provinces]);

  useEffect(() => {
    if (
      Number(selectedRegion) != 0 &&
      Number(selectedProvince) != 0 &&
      Number(selectedGameCategory) != 0 &&
      selectedMonth != 0
    ) {
      fetchData();
    }
  }, [selectedRegion, selectedProvince, selectedGameCategory, selectedMonth]);

  useEffect(() => {
  }, [filteredProvinces]);

  const getTodayResults = (drawOrder: number) => {
    try {
      if (drawOrder == 1) {
        const filtered = data.ResultSummary[todayDate - 1].FirstDraw;
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"];
        if (Number(selectedGameCategory) > 2)
          numbers.push(filtered.NumberThree || "-");
        if (Number(selectedGameCategory) > 3)
          numbers.push(filtered.NumberFour || "-");

        return numbers;
      }

      if (drawOrder == 2) {
        const filtered = data.ResultSummary[todayDate - 1].SecondDraw;
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"];
        if (Number(selectedGameCategory) > 2)
          numbers.push(filtered.NumberThree || "-");
        if (Number(selectedGameCategory) > 3)
          numbers.push(filtered.NumberFour || "-");

        return numbers;
      }

      if (drawOrder == 3) {
        const filtered = data.ResultSummary[todayDate - 1].ThirdDraw;
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"];
        if (Number(selectedGameCategory) > 2)
          numbers.push(filtered.NumberThree || "-");
        if (Number(selectedGameCategory) > 3)
          numbers.push(filtered.NumberFour || "-");

        return numbers;
      }
    } catch (err: unknown) {
      return [];
    }
  };

  const transformResultSummary = (gameCategory: number) => {
    let results: {
      firstDraw: string[];
      secondDraw: string[];
      thirdDraw: string[];
    }[] = [];

    if (data.ResultSummary) {
      for (const result of data.ResultSummary) {
        const firstDrawArr = [
          result.FirstDraw.NumberOne?.toString() || "-",
          result.FirstDraw.NumberTwo?.toString() || "-",
        ];
        if (Number(selectedGameCategory) > 2)
          firstDrawArr.push(result.FirstDraw.NumberThree?.toString() || "-");
        if (Number(selectedGameCategory) > 3)
          firstDrawArr.push(result.FirstDraw.NumberFour?.toString() || "-");

        const secondDrawArr = [
          result.SecondDraw.NumberOne?.toString() || "-",
          result.SecondDraw.NumberTwo?.toString() || "-",
        ];
        if (Number(selectedGameCategory) > 2)
          secondDrawArr.push(result.SecondDraw.NumberThree?.toString() || "-");
        if (Number(selectedGameCategory) > 3)
          secondDrawArr.push(result.SecondDraw.NumberFour?.toString() || "-");

        const thirdDrawArr = [
          result.ThirdDraw.NumberOne?.toString() || "-",
          result.ThirdDraw.NumberTwo?.toString() || "-",
        ];
        if (Number(selectedGameCategory) > 2)
          thirdDrawArr.push(result.ThirdDraw.NumberThree?.toString() || "-");
        if (Number(selectedGameCategory) > 3)
          thirdDrawArr.push(result.ThirdDraw.NumberFour?.toString() || "-");

        results.push({
          firstDraw: firstDrawArr,
          secondDraw: secondDrawArr,
          thirdDraw: thirdDrawArr,
        });
      }
    }

    return results;
  };

  return (
    <AccessGuard allowedUserTypes={[3, 4, 5, 6]}>
      <div className="flex flex-col gap-2 md:gap-4 mt-8 md:mt-0">
        <div className="flex flex-row mb-1">
          <h1 className="text-xl md:text-3xl font-bold">
            STL Provincial Draw Summary
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="w-full">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Region
            </label>
            <Select
              id="region"
              value={regions.find((option) => option.value === selectedRegion)}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setSelectedRegion(selectedOption.value);
                  setSelectedProvince("");
                }
              }}
              options={regions}
              placeholder="Select a Region"
              isDisabled={currentUserType === 5}
              classNamePrefix="custom-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderRadius: "0.5rem",
                  color: "#212121",
                  padding: "0.25rem",
                  boxShadow: state.isFocused ? "none" : provided.boxShadow,
                  backgroundColor: state.isDisabled ? "#ACA993" : "#F8C73F",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#F8C73F",
                  zIndex: 10,
                }),
              }}
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="province"
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Province
            </label>

            <Select
              id="province"
              value={filteredProvinces.find(
                (option) => option.value === selectedProvince
              )}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setSelectedProvince(selectedOption.value);
                }
              }}
              options={filteredProvinces}
              placeholder="Select a Province"
              classNamePrefix="custom-select"
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="gameCategory"
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Game Category
            </label>
            <Select
              id="gameCategory"
              value={gameCategories.find(
                (option) => option.value === selectedGameCategory
              )}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setSelectedGameCategory(selectedOption.value);
                }
              }}
              options={gameCategories}
              placeholder="Select a Game Category"
              classNamePrefix="custom-select"
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="month"
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Month
            </label>
            <Select
              id="month"
              options={monthOptions}
              value={monthOptions.find(
                (option) => parseInt(option.value) === selectedMonth
              )}
              onChange={(selectedOption) =>
                setSelectedMonth(
                  selectedOption ? parseInt(selectedOption.value) : 1
                )
              }
              placeholder="Select a Month"
              classNamePrefix="custom-select"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-12">
            <div className="flex flex-col w-full lg:w-2/3">
              <h1 className="text-xl md:text-3xl font-bold">
                {
                  filteredProvinces.find(
                    (province) => province.value == selectedProvince.toString()
                  )?.label
                }{" "}
                -{" "}
                {
                  gameCategories.find(
                    (gameCategory) =>
                      gameCategory.value == selectedGameCategory.toString()
                  )?.label
                }
              </h1>

              <div>
                <p className="text-base font-bold mb-1">Draw Results</p>
                {data && (
                  <DrawResultsSummaryPage
                    firstDraw={getTodayResults(1) || []}
                    secondDraw={getTodayResults(2) || []}
                    thirdDraw={getTodayResults(3) || []}
                    gameCategoryMap={gameCategoryMap}
                  />
                )}
                <div className="flex w-full gap-3">
                  {data?.HotNumbers && (
                    <HotNumberPage
                      number={data?.HotNumbers[0]?.number || "-"}
                    />
                  )}
                  {data?.ColdNumbers && (
                    <ColdNumberPage
                      number={data?.ColdNumbers[0]?.number || "-"}
                    />
                  )}
                </div>

                <div className="flex gap-2 mt-5">
                  {data && (
                    <DrawCounterTablePage
                      numberArr={data?.FrequencyMap || []}
                      gameCategory={Number(selectedGameCategory)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 w-full lg:w-1/3">
              {data && (
                <DrawListSummaryPage
                  location={
                    filteredProvinces.find(
                      (province) =>
                        province.value == selectedProvince.toString()
                    )?.label || ""
                  }
                  month={selectedMonth}
                  values={transformResultSummary(Number(selectedGameCategory))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AccessGuard>
  );
};

export default DrawSelectedPage;
