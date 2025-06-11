import React, { useState, useEffect } from "react";
import { CircularProgress, Button, } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchTransactions } from "~/utils/api/transactions";
import { buttonStyles } from "~/styles/theme";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";

// Returns the bet types series for a gameCategoryId
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

// Dynamic legend component based on gameCategoryId
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetchTransactions({ from: today, to: today });

        let res = response.data.filter(
          (item: { DateOfTransaction: string; GameCategoryId: number }) =>
            item.DateOfTransaction.startsWith(today)
        );

        if (params.gameCategoryId && params.gameCategoryId > 0) {
          res = res.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
          );
        }

        if (response.success && Array.isArray(res)) {
          // Get series keys dynamically
          const series = getBetTypeSeries(params.gameCategoryId);

          // Aggregate data by DrawOrder and bet types dynamically
          const aggregatedData: Record<
            number,
            Record<string, number>
          > = {};

          res.forEach((item: any) => {
            if (!aggregatedData[item.DrawOrder]) {
              aggregatedData[item.DrawOrder] = {};
              // Initialize keys to 0 for all series dataKeys
              series.forEach(({ dataKey }) => {
                aggregatedData[item.DrawOrder][dataKey.toLowerCase()] = 0;
              });
            }

            series.forEach(({ dataKey }) => {
              const keyLower = dataKey.toLowerCase();
              aggregatedData[item.DrawOrder][keyLower] += item[dataKey] || 0;
            });
          });

          // Prepare formatted data for 3 draws
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
              const keyLower = dataKey.toLowerCase();
              entry[keyLower] = (aggregatedData[drawNum]?.[keyLower] || 0) / 100000;
            });

            return entry;
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

  // Get series for rendering BarChart series
  const series = getBetTypeSeries(params.gameCategoryId);

  const safeMax = Math.max(
    1000,
    ...data.map((item) =>
      series.reduce((sum, { dataKey }) => {
        const key = dataKey.toLowerCase();
        return sum + (typeof item[key] === "number" ? (item[key] as number) : 0);
      }, 0)
    )
  );

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today's Summary of Bets By Bet Type
          </p>
          <CustomLegend gameCategoryId={params.gameCategoryId} />
        </div>
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
                label: "Amount (in 100,000 units)",
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

export default ChartBettorsBetTypeSummary;
