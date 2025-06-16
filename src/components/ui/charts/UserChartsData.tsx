import { useEffect, useState, useCallback, useMemo } from "react";
import { ChartBarItem, ChartsDataPageProps, RegionUser } from "~/types/interfaces";
import useDashboardStore from "../../../store/useDashboardStore";
import ChartCard from "./UserCharts";
import { getUserStatus } from "~/hooks/dashboarddata";
import { fetchRegions } from "~/utils/api/location";

const regionMap: Record<string, string> = {
  "I": "Region I", "II": "Region II", "III": "Region III",
  "IV A": "Region IV-A", "IV B": "Region IV-B", "V": "Region V",
  "VI": "Region VI", "VII": "Region VII", "VIII": "Region VIII",
  "IX": "Region IX", "X": "Region X", "XI": "Region XI",
  "XII": "Region XII", "XIII": "Region XIII", "BARMM": "BARMM",
  "CAR": "CAR", "NCR": "NCR",
};

const displayRegions: string[] = Object.keys(regionMap);

interface Region {
  RegionId: number;
  RegionName: string;
}

export const ChartsDataPage = <T extends RegionUser & { OperatorName?: string; BranchRegion?: number }>({
  dashboardData,
  userType,
  pageType,
}: ChartsDataPageProps<T>) => {
  const { sevenDaysAgo, setChartData } = useDashboardStore();
  const [chartData, setLocalChartData] = useState<ChartBarItem[]>([]);
  const [statsPerRegion, setStatsPerRegion] = useState<any[]>([]);
  const [regionList, setRegionList] = useState<Region[]>([]);

  // Load regions on mount once
  useEffect(() => {
    async function loadRegions() {
      const res = await fetchRegions();
      if (res.success) setRegionList(res.data);
    }
    loadRegions();
  }, []);

  // Memoized function to compute stats and chart data
  const computeStatsAndChartData = useCallback(() => {
    //console.log('DASHBOARD DATA: ', dashboardData);
    if (!dashboardData || dashboardData.length === 0 || regionList.length === 0) return null;

    const stats = displayRegions.map((shortRegion) => {
      const fullRegion = regionMap[shortRegion];
      const users = dashboardData.filter((user) => {
        let userRegionName = "";

        if (typeof user.Region === "object" && user.Region !== null && "RegionName" in user.Region) {
          userRegionName = (user.Region as { RegionName: string }).RegionName;

        } else if (typeof user.Region === "string") {
          userRegionName = user.Region;

        } else if (user.OperatorRegion?.RegionName) {
          userRegionName = user.OperatorRegion.RegionName;

        } else if (user.BranchRegion) {
          const matchedRegion = regionList.find((r) => r.RegionId === user.BranchRegion);
          if (matchedRegion) {
            userRegionName = matchedRegion.RegionName;
          } else {
            return false;
          }
        }

        return userRegionName === fullRegion;
      });

      let active = 0, inactive = 0, deleted = 0, newlyRegistered = 0;

      users.forEach((user) => {
        const status = getUserStatus(user, sevenDaysAgo) ?? "Unknown";
        switch (status) {
          case "Active": active++; break;
          case "Inactive": inactive++; break;
          case "Deleted": deleted++; break;
          case "New": newlyRegistered++; break;
        }
      });

      return {
        regionName: shortRegion,
        total: users.length,
        active,
        inactive,
        deleted,
        new: newlyRegistered,
      };
    });

    const newChartData: ChartBarItem[] = [
      {
        label: `Total ${pageType}s`,
        color: "#BB86FC",
        data: stats.map((r) => r.total),
      },
      {
        label: `Active ${pageType}s`,
        color: "#5050A5",
        data: stats.map((r) => r.active),
      },
      {
        label: `Inactive ${pageType}s`,
        color: "#7266C9",
        data: stats.map((r) => r.inactive),
      },
      {
        label: `Deleted ${pageType}s`,
        color: "#3B3B81",
        data: stats.map((r) => r.deleted),
      },
      {
        label: `New ${pageType}s`,
        color: "#282A68",
        data: stats.map((r) => r.new),
      },
    ];

    return { stats, newChartData };
  }, [dashboardData, regionList, sevenDaysAgo, pageType]);

  // useMemo to run computation only when dependencies change
  const computedData = useMemo(() => computeStatsAndChartData(), [computeStatsAndChartData]);

  useEffect(() => {
    if (!computedData) return;

    //console.log("Computed stats per region:", computedData.stats);
    //console.log("Chart data set:", computedData.newChartData);

    setStatsPerRegion(computedData.stats);
    setLocalChartData(computedData.newChartData);
    setChartData(computedData.newChartData);
  }, [computedData, setChartData]);

  return (
    <div>
      <ChartCard
        chartData={chartData}
        regions={displayRegions}
        title={`${(pageType ?? "Unknown").charAt(0).toUpperCase() + (pageType ?? "Unknown").slice(1)} Summary`}
        pageType={pageType}
        statsPerRegion={statsPerRegion}
      />
    </div>
  );
};

export default ChartsDataPage;
