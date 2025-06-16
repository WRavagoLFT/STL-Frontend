import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { TransactionData } from "~/types/types";
import { useAuthStore } from "~/store/useAuthStore";

const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-2" />
      <p className="text-xs md:text-sm">Bettors</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-xs md:text-sm">Bets</p>
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
  const currentUserType = useAuthStore((state) => state.userTypeId);

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
          bets: item.bets,
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
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Left section: text and legend */}
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Summary of Bettors and Bets Placed Today
          </p>
          <CustomLegend />
        </div>

        {/* Right section: CSV export button (conditional) */}
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={data}
              headers={["Game Name", "Bettors", "Bets Placed Today"]}
              title="Bettors and Bets Summary"
              getRowData={(item) => [item.gameName, item.bettors, item.bets]}
            />
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-[600px]">
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
              data: data.map((item) => item.bettors / 100000),
              color: "#BB86FC",
              label: "Bettors",
              valueFormatter: (value, context) =>
                `${data[context.dataIndex].bettors.toLocaleString()}`,
            },
            {
              data: data.map((item) => item.bets / 100000),
              color: "#5050A5",
              label: "Bets Placed Today",
              valueFormatter: (value, context) =>
                `${data[context.dataIndex].bets.toLocaleString()}`,
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
              label: "Total (x 100,000)",
              scaleType: "linear",
              min: 0,
              max: 750,
              tickInterval: 50,
              valueFormatter: (value: number) => value.toString(),
              tickSize: 2,
              barCategoryGap: 0.2,
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
        />
        </div>
      </div>
    </div>
  );
};

export default SummaryBettorsBetsPlacedPage;
