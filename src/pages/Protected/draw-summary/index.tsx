import React, { useEffect, useState } from "react";
import HotNumberPage from "~/components/draw-summary/HotNumbers";
import DrawResultsSummaryPage from "~/components/draw-summary/DrawResultsSummary";
import ColdNumberPage from "~/components/draw-summary/ColdNumbers";
import DrawCounterTablePage from "~/components/draw-summary/DrawCounterTable";
import { fetchProvinces, fetchRegions } from "~/utils/api/location";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { fetchDrawSummary } from "~/utils/api/transactions";
import Select from 'react-select';
import { AccessGuard } from "~/components/auth/AccessGuard";

const DrawListSummaryPage = React.lazy(() => import("~/components/draw-summary/DrawListSummary"));

const DrawSelectedPage = () => {

  const [regions, setRegions] = useState<{label: string, value: string}[]> ([]);
  const [provinces, setProvinces] = useState<any[]> ([]);
  const [gameCategories, setGameCategories] = useState<{label: string, value: string}[]> ([]);
  const [filteredProvinces, setFilteredProvinces] = useState<{label: string, value: string}[]> ([]);
  
  const [selectedRegion, setSelectedRegion] = useState("1");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedGameCategory, setSelectedGameCategory] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth() + 1);

  const [data, setData] = useState<any>({});

  const todayDate = new Date().getDate()

  // fetch data
  const fetchData = async () => {
    const dataFetch = await fetchDrawSummary(Number(selectedProvince), Number(selectedGameCategory), Number(selectedMonth))
    setData(dataFetch.data)
    console.log(dataFetch)
  }

  const loadData = async () => {

    const regionFetch = await fetchRegions()
    console.log(regionFetch)
    setRegions(regionFetch.data.map((region: any) => {
      return {
        label: region.RegionName,
        value: region.RegionId.toString()
      }
    }))

    
    const provinceFetch = await fetchProvinces()
    console.log(provinceFetch)
    setProvinces(provinceFetch.data)

    const filteredProvinces = provinceFetch.data.filter((province: any) => {
      return province.RegionId == selectedRegion
    })
    
    setFilteredProvinces(filteredProvinces.map((province: any) => {
      return {
        label: province.ProvinceName,
        value: province.ProvinceId.toString()
      }
    })) 

    // default region
    setSelectedRegion("1")
    setSelectedProvince("1")

    const gameCategoryFetch = await fetchGameCategories()
    console.log(gameCategoryFetch)
    setGameCategories(gameCategoryFetch.data.map((gameCategory: any) => {
      return {
        label: gameCategory.GameCategory,
        value: gameCategory.GameCategoryId.toString()
      }
    }))
  }

  useEffect(() => {
    // Initial Fetch
    loadData()
    fetchData()
  }, [])

  useEffect(() => { 
    if(provinces.length > 0){
      const filteredProvinces = provinces.filter((province) => {
        return province.RegionId == selectedRegion
      })

      setFilteredProvinces(filteredProvinces.map((province: any) => {
        return {
          label: province.ProvinceName,
          value: province.ProvinceId.toString()
        }
      }))

      setSelectedProvince(filteredProvinces[0].ProvinceId)
    }
  }, [selectedRegion, provinces])

  useEffect(() => {
    if(Number(selectedRegion) != 0 && Number(selectedProvince) != 0 && Number(selectedGameCategory) != 0 && selectedMonth != 0){
      fetchData()
    }
  }, [selectedRegion, selectedProvince, selectedGameCategory, selectedMonth])

  useEffect(() => {
    console.log(filteredProvinces)
  }, [filteredProvinces])

  const getTodayResults = (drawOrder: number) => {
    try {
      
      if(drawOrder == 1){
        const filtered = data.ResultSummary[todayDate-1].FirstDraw
        console.log(`accessing data.ResultSummary[${todayDate-1}][${todayDate}].FirstDraw`)
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"]
        if(Number(selectedGameCategory) > 2) numbers.push(filtered.NumberThree || "-") 
        if(Number(selectedGameCategory) > 3) numbers.push(filtered.NumberFour || "-")
        
        return numbers
      }
  
      if(drawOrder == 2){
        const filtered = data.ResultSummary[todayDate-1].SecondDraw
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"]
        if(Number(selectedGameCategory) > 2) numbers.push(filtered.NumberThree || "-")
        if(Number(selectedGameCategory) > 3) numbers.push(filtered.NumberFour || "-")
        
        return numbers
      }
  
      if(drawOrder == 3){
        const filtered = data.ResultSummary[todayDate-1].ThirdDraw
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"]
        if(Number(selectedGameCategory) > 2) numbers.push(filtered.NumberThree || "-")
        if(Number(selectedGameCategory) > 3) numbers.push(filtered.NumberFour || "-")
        
        return numbers
      }
    }
    catch (err: unknown){
      return []
    }
  }

  const transformResultSummary = (gameCategory: number) => {
    let results: {firstDraw: string[], secondDraw: string[], thirdDraw: string[]}[] = []

    if(data.ResultSummary){
      for( const result of data.ResultSummary ){
        const firstDrawArr = [(result.FirstDraw.NumberOne?.toString() || "-"), (result.FirstDraw.NumberTwo?.toString() || "-")]
        if(Number(selectedGameCategory) > 2) firstDrawArr.push(result.FirstDraw.NumberThree?.toString() || "-") 
        if(Number(selectedGameCategory) > 3) firstDrawArr.push(result.FirstDraw.NumberFour?.toString() || "-")
  
        const secondDrawArr = [(result.SecondDraw.NumberOne?.toString() || "-"), (result.SecondDraw.NumberTwo?.toString() || "-")]
        if(Number(selectedGameCategory) > 2) secondDrawArr.push(result.SecondDraw.NumberThree?.toString() || "-") 
        if(Number(selectedGameCategory) > 3) secondDrawArr.push(result.SecondDraw.NumberFour?.toString() || "-")
        
        const thirdDrawArr = [(result.ThirdDraw.NumberOne?.toString() || "-"), (result.ThirdDraw.NumberTwo?.toString() || "-")]
        if(Number(selectedGameCategory) > 2) thirdDrawArr.push(result.ThirdDraw.NumberThree?.toString() || "-") 
        if(Number(selectedGameCategory) > 3) thirdDrawArr.push(result.ThirdDraw.NumberFour?.toString() || "-")
  
        results.push({firstDraw: firstDrawArr, secondDraw: secondDrawArr, thirdDraw: thirdDrawArr})
      }
    }
    
    return results
  }

  return (
    <AccessGuard allowedUserTypes={[3, 4, 5, 6]}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row mb-1">
          <h1 className="text-3xl font-bold">
            STL Pares Provincial Draw Summary
          </h1>
        </div>

        {/* Input Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* First Select */}
          <div className="w-full">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Region
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedRegion(val);
                setSelectedProvince("");
              }}
              className="w-full border rounded px-3 py-3 text-sm !bg-[#F6BA12] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-white text-black">
                Select Region
              </option>
              {regions.map((region) => (
                <option
                  key={region.value}
                  value={region.value}
                  className="bg-white text-black"
                >
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          {/* Second Select */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="province"
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Province
            </label>
            <select
              id="province"
              value={selectedProvince}
              onChange={(e) => {
                const val = e.target.value;
                console.log("Province changed to " + val);
                setSelectedProvince(val);
              }}
              className="w-full border rounded px-3 py-3 text-sm !bg-[#F6BA12] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filteredProvinces.map((province) => (
                <option
                  key={province.value}
                  value={province.value}
                  className="bg-white text-black"
                >
                  {province.label}
                </option>
              ))}
            </select>
          </div>

          {/* Third Select */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="gameCategory"
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Game Category
            </label>
            <select
              id="gameCategory"
              value={selectedGameCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedGameCategory(val);
              }}
              className="w-full border rounded px-3 py-3 text-sm !bg-[#F6BA12] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {gameCategories.map((gameCategory) => (
                <option
                  key={gameCategory.value}
                  value={gameCategory.value}
                  className="bg-white text-black"
                >
                  {gameCategory.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fourth Select */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="month"
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Month
            </label>
            <select
              id="select-4"
              value={selectedMonth}
              onChange={(e: any) => {
                const val = e.target.value;
                setSelectedMonth(val);
              }}
              className="w-full border rounded px-3 py-3 text-sm !bg-[#F6BA12] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-white text-black">
                Select Month
              </option>
              <option value="1" className="bg-white text-black">
                January
              </option>
              <option value="2" className="bg-white text-black">
                February
              </option>
              <option value="3" className="bg-white text-black">
                March
              </option>
              <option value="4" className="bg-white text-black">
                April
              </option>
              <option value="5" className="bg-white text-black">
                May
              </option>
              <option value="6" className="bg-white text-black">
                June
              </option>
              <option value="7" className="bg-white text-black">
                July
              </option>
              <option value="8" className="bg-white text-black">
                August
              </option>
              <option value="9" className="bg-white text-black">
                September
              </option>
              <option value="10" className="bg-white text-black">
                October
              </option>
              <option value="11" className="bg-white text-black">
                November
              </option>
              <option value="12" className="bg-white text-black">
                December
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4m mt-2">
          <div className="flex flex-col md:flex-row w-full gap-12">
            <div className="flex flex-col w-full md:w-2/3">
              <h1 className="text-3xl font-bold mb-3">
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
                <p className="text-md font-bold mb-1">Draw Results</p>
                {data && (
                  <DrawResultsSummaryPage
                    firstDraw={getTodayResults(1) || []}
                    secondDraw={getTodayResults(2) || []}
                    thirdDraw={getTodayResults(3) || []}
                  />
                )}
                <div className="flex gap-3">
                  {data?.HotNumbers && (
                    <HotNumberPage number={data?.HotNumbers[0]?.number || "-"} />
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
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              {data && (
                <DrawListSummaryPage
                  location={
                    filteredProvinces.find(
                      (province) => province.value == selectedProvince.toString()
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
