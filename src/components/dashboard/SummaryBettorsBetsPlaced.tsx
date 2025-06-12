import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { TransactionData } from "~/types/types";

// Custom Legend circle
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-2" />
      <p className="text-sm">Bettors</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-sm">Bets</p>
    </div>
  </div>
);

const summary: Record<
  number,
  { gameName: string; bettors: number; bets: number; winners: number }
> = {
  1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
  2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
  3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
};

const SummaryBettorsBetsPlacedPage = () => {
  const [data, setData] = useState<
    { gameName: string; bettors: number; bets: number; winners: number }[]
  >([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const maxValue = Math.max(...data.map((item) => item.bets));
  const safeMax = maxValue < 1000 ? 1000 : maxValue;

  const fetchData = async () => {
    try {
      const response = await fetchHistoricalSummary();

      if (response.success) {
        const today = new Date().toISOString().split("T")[0];

        // Filter by today's date
        const filteredData = response.data.filter((item: TransactionData) =>
          item.TransactionDate.startsWith(today)
        );

        // Local summary object
        const localSummary: typeof summary = {
          1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
          2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
          3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
        };

        filteredData.forEach((item: TransactionData) => {
          if (localSummary[item.DrawOrder]) {
            localSummary[item.DrawOrder].bettors += item.TotalBettors || 0;
            localSummary[item.DrawOrder].bets += item.TotalBetAmount || 0;
            localSummary[item.DrawOrder].winners += item.TotalWinners || 0;
          }
        });

        const formattedData = Object.values(localSummary);

        const scaledData = formattedData.map((item) => ({
          ...item,
          bets: item.bets / 100000,
          ratio: item.bettors === 0 ? 0 : item.bets / item.bettors,
        }));

        setData(scaledData);

        const transformedChartData = scaledData.map((item) => ({
          draw: item.gameName,
          bettors: item.bettors,
          bets: item.bets,
          ratio: item.ratio,
        }));

        setChartData(transformedChartData);
      } else {
        console.error("API Request Failed:", response.message);
      }
    } catch (error) {
      console.error("Error Fetching Data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Summary of Bettors and Bets Placed Today
          </p>
          <CustomLegend />
        </div>
        <GenericCSVExportButton
          data={data}
          headers={["Game Name", "Bettors", "Bets"]}
          title={`Bettors and Bets Summary`}
          getRowData={(item) => [item.gameName, item.bettors, item.bets]}
        />
      </div>

      <div className="h-full w-full">
        <BarChart
          height={300}
          grid={{ vertical: true }}
          layout="horizontal"
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          slotProps={{
            noDataOverlay: {
              message:
                "Summary of Bettors and Bets Placed data will be displayed once available.",
            },
            legend: { hidden: true },
          }}
          series={[
            {
              data: data.map((item) => item.bettors),
              color: "#BB86FC",
              label: "Bettors",
            },
            {
              data: data.map((item) => item.bets),
              color: "#5050A5",
              label: "Bets",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: data.map((item) => item.gameName),
              tickLabelProps: { style: { fontSize: "14px" } },
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              scaleType: "linear",
              min: 0,
              max: safeMax,
              valueFormatter: (value: number) => `${value.toLocaleString()}`,
              tickSize: 2,
              barCategoryGap: 0.2,
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryBettorsBetsPlacedPage;
