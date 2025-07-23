import React, { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { fetchWinners } from "@/lib/api/winners";
import { useAuthStore } from "@/store/useAuthStore";
import { FaSpinner } from "react-icons/fa";

// Define bet type series per GameCategory
const getBetTypeSeries = (gameCategoryId?: number) => {
  switch (gameCategoryId) {
    case 1: // STL PARES
    case 2: // STL SWER2
      return [
        { dataKey: "Tumbok", color: "#E5C7FF" },
        { dataKey: "Sahod", color: "#5050A5" },
        { dataKey: "Casas", color: "#7266C9" },
      ];
    case 3: // STL SWER3
    case 4: // STL SWER4
      return [
        { dataKey: "Tumbok", color: "#E5C7FF" },
        { dataKey: "Ramble", color: "#5050A5" },
      ];
    default:
      return [];
  }
};

// Custom Legend Component
const CustomLegend = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const series = useMemo(
    () => getBetTypeSeries(gameCategoryId),
    [gameCategoryId]
  );

  return (
    <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
      {series.map(({ dataKey, color }) => (
        <div key={dataKey} className="flex items-center">
          <div
            className="w-3.5 h-3.5 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          <p className="text-sm">{dataKey}</p>
        </div>
      ))}
    </div>
  );
};

const ChartWinnersBetTypeSummary = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const [data, setData] = useState<
    Array<{ draw: string; [key: string]: number | string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const series = useMemo(
    () => getBetTypeSeries(gameCategoryId),
    [gameCategoryId]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });

      const response = await fetchWinners({ from: today, to: today });

      if (!response.success || !Array.isArray(response.data)) {
        console.warn("[DEBUG] Invalid fetchWinners response");
        setLoading(false);
        return;
      }

      // Convert DateOfTransaction to PHT and filter
      let res = response.data.filter(
        (item: { DateOfTransaction?: string; GameCategoryId: number }) => {
          if (!item.DateOfTransaction) return false;
          const localDate = new Date(item.DateOfTransaction).toLocaleDateString(
            "en-CA",
            { timeZone: "Asia/Manila" }
          );
          return localDate === today;
        }
      );

      if (gameCategoryId && gameCategoryId > 0) {
        res = res.filter((item: any) => item.GameCategoryId === gameCategoryId);
      }

      if (Array.isArray(res)) {
        const aggregatedData: Record<number, Record<string, number>> = {};

        res.forEach((item: any) => {
          if (!aggregatedData[item.DrawOrder]) {
            aggregatedData[item.DrawOrder] = {};
            series.forEach(({ dataKey }) => {
              aggregatedData[item.DrawOrder][dataKey.toLowerCase()] = 0;
            });
          }

          series.forEach(({ dataKey }) => {
            const key = dataKey.toLowerCase();
            aggregatedData[item.DrawOrder][key] += item[dataKey] || 0;
          });
        });

        const formattedData = [1, 2, 3].map((drawNum) => {
          const entry: { draw: string; [key: string]: number | string } = {
            draw:
              drawNum === 1
                ? "First Draw"
                : drawNum === 2
                ? "Second Draw"
                : "Third Draw",
          };

          series.forEach(({ dataKey }) => {
            const key = dataKey.toLowerCase();
            entry[key] = (aggregatedData[drawNum]?.[key] || 0) / 100000;
          });

          return entry;
        });

        setData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching bet summary data:", error);
    } finally {
      setLoading(false);
    }
  }, [gameCategoryId, series]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Today's Winnings by Game Type</p>
          <CustomLegend gameCategoryId={gameCategoryId} />
        </div>
        {currentUserType !== 3 && (
          <GenericCSVExportButton
            data={data}
            headers={["Draw", ...series.map((s) => s.dataKey)]}
            title="Summary of Bets By Bet Type"
            getRowData={(item) => [
              item.draw,
              ...series.map(({ dataKey }) =>
                Number(item[dataKey.toLowerCase()] || 0).toFixed(3)
              ),
            ]}
          />
        )}
      </div>

      <div className="h-full w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <FaSpinner className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <BarChart
            height={300}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{
              legend: { hidden: true },
              noDataOverlay: {
                message:
                  "Today's Winnings by Game Type will be displayed once available.",
              },
            }}
            dataset={data}
            yAxis={[
              {
                scaleType: "band",
                data: data.map((item) => item.draw),
              },
            ]}
            xAxis={[
              {
                label: "Total (x 100,000)",
                min: 0,
                max: 750,
                valueFormatter: (value: number) => `${value.toLocaleString()}`,
              },
            ]}
            series={series.map(({ dataKey, color }) => ({
              dataKey: dataKey.toLowerCase(),
              label: dataKey,
              color,
              valueFormatter: (value) => {
                if (value == null) return "₱0";
                const actualValue = value * 100000;
                return actualValue.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                });
              },
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default ChartWinnersBetTypeSummary;
