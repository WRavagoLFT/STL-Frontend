"use client";

import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchHistoricalSummary } from "@/lib/api/transactions";
import { FaSpinner } from "react-icons/fa";

const getBetTypeSeries = (gameCategoryId?: number) => {
  switch (gameCategoryId) {
    case 1:
    case 2:
      return [
        { dataKey: "Tumbok", color: "#E5C7FF" },
        { dataKey: "Sahod", color: "#5050A5" },
        { dataKey: "Casas", color: "#7266C9" },
      ];
    case 3:
    case 4:
      return [
        { dataKey: "Tumbok", color: "#E5C7FF" },
        { dataKey: "Ramble", color: "#5050A5" },
      ];
    default:
      return [];
  }
};

const CustomLegend = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const series = getBetTypeSeries(gameCategoryId);
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

const ChartBettorsBetTypeSummary = (params: { gameCategoryId?: number }) => {
  const [data, setData] = useState<
    { draw: string; [key: string]: number | string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        });
        const response = await fetchHistoricalSummary();

        //console.log("HISTORICAL REGION:", response.data);

        let res = response.data.filter(
          (item: { TransactionDate?: string; GameCategoryId: number }) =>
            item.TransactionDate?.startsWith(today)
        );

        if (params.gameCategoryId && params.gameCategoryId > 0) {
          res = res.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
          );
        }

        //console.log("Filtered items for today (" + today + "):", res);

        if (response.success && Array.isArray(res)) {
          const aggregatedData: Record<number, { [key: string]: number }> = {};

          res.forEach((item: any) => {
            const draw = item.DrawOrder;
            if (!aggregatedData[draw]) {
              aggregatedData[draw] = {
                totalTumbok: 0,
                totalSahod: 0,
                totalCasas: 0,
                totalRamble: 0,
              };
            }

            aggregatedData[draw].totalTumbok += item.TotalTumbok || 0;
            aggregatedData[draw].totalSahod += item.TotalSahod || 0;
            aggregatedData[draw].totalCasas += item.TotalCasas || 0;
            aggregatedData[draw].totalRamble += item.TotalRamble || 0;
          });

          const formattedData = [1, 2, 3].map((drawNum) => {
            const drawLabel =
              drawNum === 1
                ? "First Draw"
                : drawNum === 2
                  ? "Second Draw"
                  : "Third Draw";

            const values = aggregatedData[drawNum] || {
              totalTumbok: 0,
              totalSahod: 0,
              totalCasas: 0,
              totalRamble: 0,
            };

            return {
              draw: drawLabel,
              tumbok: values.totalTumbok / 100000,
              sahod: values.totalSahod / 100000,
              casas: values.totalCasas / 100000,
              ramble: values.totalRamble / 100000,
            };
          });

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error loading BettorsvsBetsPlacedSummary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.gameCategoryId]);

  const series = getBetTypeSeries(params.gameCategoryId);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today's Summary of Bets By Bet Type
          </p>
          <CustomLegend gameCategoryId={params.gameCategoryId} />
        </div>
        {currentUserType !== 3 && (
          <GenericCSVExportButton
            data={data}
            headers={["Draw", ...series.map((s) => s.dataKey)]}
            title="Summary of Bets By Bet Type"
            getRowData={(item) => [
              item.draw,
              ...series.map(({ dataKey }) =>
                Number(item[dataKey.toLowerCase()] || 0).toFixed(2)
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
            slotProps={{
              noDataOverlay: {
                message:
                  "Summary of Bets data will be displayed once available.",
              },
              legend: { hidden: true },
            }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
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

export default ChartBettorsBetTypeSummary;
