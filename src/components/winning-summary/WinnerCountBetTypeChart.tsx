import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { fetchWinners } from "~/utils/api/winners";
import { useAuthStore } from "~/store/useAuthStore";

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
  const series = useMemo(() => getBetTypeSeries(gameCategoryId), [gameCategoryId]);

  return (
    <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
      {series.map(({ dataKey, color }) => (
        <div key={dataKey} className="flex items-center">
          <div className="w-3.5 h-3.5 rounded-full mr-2" style={{ backgroundColor: color }} />
          <p className="text-sm">{dataKey}</p>
        </div>
      ))}
    </div>
  );
};

const ChartWinnersBetTypeSummary = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const [data, setData] = useState<Array<{ draw: string; [key: string]: number | string }>>([]);
  const [loading, setLoading] = useState(false);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const series = useMemo(() => getBetTypeSeries(gameCategoryId), [gameCategoryId]);

  const maxValue = Math.max(
    ...data.flatMap((item) =>
      series.map(({ dataKey }) => Number(item[dataKey.toLowerCase()] || 0))
    )
  );
  const safeMax = maxValue < 1000 ? 1000 : maxValue;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetchWinners({ from: today, to: today });

      let res = response.data.filter(
        (item: { DateOfTransaction: string; GameCategoryId: number }) =>
          item.DateOfTransaction.startsWith(today)
      );

      if (gameCategoryId && gameCategoryId > 0) {
        res = res.filter((item : any) => item.GameCategoryId === gameCategoryId);
      }

      if (response.success && Array.isArray(res)) {
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
              drawNum === 1 ? "First Draw" : drawNum === 2 ? "Second Draw" : "Third Draw",
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
        {/* {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : ( */}
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
              max: safeMax,
              valueFormatter: (value: number) => `${value.toLocaleString()}`,
            },
          ]}
          series={series.map(({ dataKey, color }) => ({
            dataKey: dataKey.toLowerCase(),
            label: dataKey,
            color,
          }))}
        />
        {/* )} */}
      </div>
    </div>
  );
};

export default ChartWinnersBetTypeSummary;
