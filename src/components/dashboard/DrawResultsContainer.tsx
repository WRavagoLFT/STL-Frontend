"use client";

import React, { useEffect, useState } from "react";
import { fetchRegions, fetchProvinces } from "@/lib/api/location";
import { fetchGameCategories } from "@/lib/api/gamecategories";
import { getTodaysWinningCombination } from "@/lib/api/winningcombinations";
import DrawResultsPage from "./DrawResults";

const DrawResultsContainer = ({ loading }: { loading?: boolean }) => {
  const [selectedRegion, setSelectedRegion] = useState<number | "">("");
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedGameCategory, setSelectedGameCategory] = useState<number | "">("");
  const [filteredWinningCombinations, setFilteredWinningCombinations] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [gameCategories, setGameCategories] = useState<any[]>([]);
  const [winningCombinations, setWinningCombinations] = useState<any[]>([]);

  const gameCategoryOptions = gameCategories.map((cat) => ({
    value: cat.GameCategoryId,
    label: cat.GameCategory,
  }));
  const regionOptions = regions.map((r) => ({
    value: r.RegionId,
    label: r.RegionName,
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

      if (regionsRes.success) setRegions(regionsRes.data);

      if (provincesRes.success) {
        const filtered = provincesRes.data.filter((p: any) => p.RegionId !== 0);
        setProvinces(filtered);
      }

      if (gameCategoriesRes.success) setGameCategories(gameCategoriesRes.data);

      setSelectedRegion(1);
      setSelectedGameCategory(1);
    }

    loadData();
  }, []);

  useEffect(() => {
    const loadWinningCombinations = async () => {
      const response = await getTodaysWinningCombination();
      if (response.success) {
        const enriched = response.data.map((combo: any) => {
          const region = regions.find((r) => r.RegionId === combo.RegionId);
          const province = provinces.find((p) => p.ProvinceId === combo.ProvinceId);
          const category = gameCategories.find((c) => c.GameCategoryId === combo.GameCategoryId);
          return {
            ...combo,
            RegionName: region?.RegionName || "Unknown Region",
            ProvinceName: province?.ProvinceName || "Unknown Province",
            GameCategory: category?.GameCategory || "Unknown Game Category",
          };
        });
        setWinningCombinations(enriched);
      }
    };

    if (regions.length && provinces.length && gameCategories.length) {
      loadWinningCombinations();
    }
  }, [regions, provinces, gameCategories]);

  useEffect(() => {
    let filtered = winningCombinations;

    if (selectedRegion) filtered = filtered.filter((c) => c.RegionId === Number(selectedRegion));
    if (selectedProvince) filtered = filtered.filter((c) => c.ProvinceId === Number(selectedProvince));
    if (selectedGameCategory) filtered = filtered.filter((c) => c.GameCategoryId === Number(selectedGameCategory));

    setFilteredWinningCombinations(filtered);
  }, [selectedRegion, selectedProvince, selectedGameCategory, winningCombinations]);

  useEffect(() => {
    if (selectedRegion) {
      fetchProvinces({ regionId: Number(selectedRegion) }).then((res) => {
        if (res.success) {
          setProvinces(res.data);
          const defaultProvince = res.data.find((p: any) => p.ProvinceId === 1);
          setSelectedProvince(defaultProvince ? 1 : "");
        }
      });
    }
  }, [selectedRegion]);

  return (
    <DrawResultsPage
      loading={loading}
      filteredWinningCombinations={filteredWinningCombinations}
      regionOptions={regionOptions}
      provinceOptions={filteredProvinceOptions}
      gameCategoryOptions={gameCategoryOptions}
      selectedRegionOption={selectedRegionOption}
      selectedProvinceOption={selectedProvinceOption}
      selectedGameCategoryOption={selectedGameCategoryOption}
      onRegionChange={(value) => {
        setSelectedRegion(value);
        setSelectedProvince("");
      }}
      onProvinceChange={setSelectedProvince}
      onGameCategoryChange={setSelectedGameCategory}
    />
  );
};

export default DrawResultsContainer;
