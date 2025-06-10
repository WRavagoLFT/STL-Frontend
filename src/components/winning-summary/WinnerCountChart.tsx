import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";

interface WinnerItem {
  DrawOrder: number;
  GameCategoryId: number;
  TotalBets: number;
  TransactionDate: string;
}

interface ChartData {
  draw: string;
  pares: number;
  swer2: number;
  swer3: number;
  swer4: number;
}

const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-0.5 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E57CFF] mr-2" />
      <p className="text-sm">STL Pares</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#D2A7FF] mr-2" />
      <p className="text-sm">STL Swer2</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-2" />
      <p className="text-sm">STL Swer3</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#A06FE6] mr-2" />
      <p className="text-sm">STL Swer4</p>
    </div>
  </div>
);

const ChartWinnersSummary = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetchWinners({ from: today, to: today });

      if (response.success && Array.isArray(response.data)) {
        const filteredData = response.data.filter(
          (item: WinnerItem) => item.TransactionDate.startsWith(today)
        );

        const aggregated: Record<number, Omit<ChartData, 'draw'>> = {};

        filteredData.forEach((item: WinnerItem) => {
          const draw = item.DrawOrder;
          if (!aggregated[draw]) {
            aggregated[draw] = { pares: 0, swer2: 0, swer3: 0, swer4: 0 };
          }

          switch (item.GameCategoryId) {
            case 1:
              aggregated[draw].pares += item.TotalBets;
              break;
            case 2:
              aggregated[draw].swer2 += item.TotalBets;
              break;
            case 3:
              aggregated[draw].swer3 += item.TotalBets;
              break;
            case 4:
              aggregated[draw].swer4 += item.TotalBets;
              break;
            default:
              break;
          }
        });

        const formatted: ChartData[] = ["First Draw", "Second Draw", "Third Draw"].map(
          (label, index) => {
            const draw = index + 1;
            const current = aggregated[draw] || {
              pares: 0,
              swer2: 0,
              swer3: 0,
              swer4: 0,
            };
            return {
              draw: label,
              pares: current.pares / 100000,
              swer2: current.swer2 / 100000,
              swer3: current.swer3 / 100000,
              swer4: current.swer4 / 100000,
            };
          }
        );

        setData(formatted);
      }
    } catch (error) {
      console.error("Error loading Bettors Summary:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Safely calculate max for scaling
  const maxValue = Math.max(
    ...data.flatMap((item) => [item.pares, item.swer2, item.swer3, item.swer4])
  );
  const safeMax = maxValue < 1 ? 1 : maxValue;

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Today's Winnings by Game Type</p>
          <CustomLegend />
        </div>
        <GenericCSVExportButton
          data={data}
          headers={["Draw", "STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"]}
          title="Today's Winnings by Game Type"
          getRowData={(item) => [
            item.draw,
            item.pares,
            item.swer2,
            item.swer3,
            item.swer4,
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
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            grid={{ vertical: true }}
            slotProps={{
              legend: { hidden: true },
              noDataOverlay: {
                message: "Today's Winners and Winnings will be displayed once available.",
              },
            }}
            series={[
              { data: data.map((d) => d.pares), color: "#E5C7FF", label: "STL Pares" },
              { data: data.map((d) => d.swer2), color: "#D2A7FF", label: "STL Swer2" },
              { data: data.map((d) => d.swer3), color: "#BB86FC", label: "STL Swer3" },
              { data: data.map((d) => d.swer4), color: "#A06FE6", label: "STL Swer4" },
            ]}
            yAxis={[
              {
                scaleType: "band",
                data: data.map((d) => d.draw),
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
          />
        {/* )} */}
      </div>
    </div>
  );
};

export default ChartWinnersSummary;
