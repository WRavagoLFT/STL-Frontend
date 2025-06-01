import { useEffect, useState } from "react";
import { ChartBarItem, ChartsDataPageProps, RegionUser } from "~/types/interfaces";
import useDashboardStore from "../../../store/useDashboardStore";
import ChartCard from "./UserCharts";
import { getUserStatus } from "~/utils/dashboarddata";

const regionMap: Record<string, string> = {
  "I": "Region I",
  "II": "Region II",
  "III": "Region III",
  "IV A": "Region IV-A",
  "IV B": "Region IV-B",
  "V": "Region V",
  "VI": "Region VI",
  "VII": "Region VII",
  "VIII": "Region VIII",
  "IX": "Region IX",
  "X": "Region X",
  "XI": "Region XI",
  "XII": "Region XII",
  "XIII": "Region XIII",
  "BARMM": "BARMM",
  "CAR": "CAR",
  "NCR": "NCR",
};

const regions: string[] = [
  "I", "II", "III", "IV A", "IV B", "V", "VI", "VII", "VIII",
  "IX", "X", "XI", "XII", "XIII", "BARMM", "CAR", "NCR"
];

export const ChartsDataPage = <T extends RegionUser & { OperatorName?: string }>({
  dashboardData,
  userType,
  pageType,
}: ChartsDataPageProps<T>) => {
  const { sevenDaysAgo, setChartData } = useDashboardStore();
  const [chartData, setLocalChartData] = useState<ChartBarItem[]>([]);
  const [statsPerRegion, setStatsPerRegion] = useState<any[]>([]);  // Declare statsPerRegion state

  useEffect(() => {
    if (!dashboardData || dashboardData.length === 0) return;

    const stats = regions.map((regionShort) => {
      const regionFull = regionMap[regionShort];

      const users = dashboardData.filter((user) => {
        let userRegionName = "";

        // If Region is an object with RegionName
        if (typeof user.Region === "object" && "RegionName" in user.Region) {
          userRegionName = (user.Region as { RegionName: string }).RegionName;
        }
        // If Region is a string (already transformed) use it directly
        else if (typeof user.Region === "string") {
          userRegionName = user.Region;
        }
        // Fallback: Try OperatorRegion
        else if (user.OperatorRegion?.RegionName) {
          userRegionName = user.OperatorRegion.RegionName;
        }

        const matches = userRegionName === regionFull;
        return matches;
      });

      let active = 0, inactive = 0, deleted = 0, newlyRegistered = 0;

      users.forEach((user) => {
        const status = getUserStatus(user, sevenDaysAgo) ?? "Unknown";

        switch (status) {
          case "Active":
            active++;
            break;
          case "Inactive":
            inactive++;
            break;
          case "Deleted":
            deleted++;
            break;
          case "New":
            newlyRegistered++;
            break;
          default:
        }
      });

      return {
        region: regionShort,
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

    setStatsPerRegion(stats);
    setLocalChartData(newChartData);
    setChartData(newChartData);
  }, [dashboardData, userType, sevenDaysAgo, setChartData]);

  return (
    <div>
      <ChartCard
        chartData={chartData}
        regions={regions}
        title={`${(pageType ?? "Unknown").charAt(0).toUpperCase() + (pageType ?? "Unknown").slice(1)} Summary`}
        pageType={pageType}
        statsPerRegion={statsPerRegion}
      />
    </div>
  );
};

export default ChartsDataPage;
