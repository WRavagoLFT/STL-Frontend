import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";

interface WinnerItem {
  DrawOrder: number;
  GameCategory: string;
  PayoutAmount: number;
}

const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-5 justify-start mt-0.5 mr-4">
    {[
      { label: "STL Pares", color: "#E57CFF" },
      { label: "STL Swer2", color: "#D2A7FF" },
      { label: "STL Swer3", color: "#BB86FC" },
      { label: "STL Swer4", color: "#A06FE6" },
    ].map(({ label, color }) => (
      <div className="flex items-center" key={label}>
        <div className="w-3.5 h-3.5 rounded-full mr-2" style={{ backgroundColor: color }} />
        <p className="text-sm">{label}</p>
      </div>
    ))}
  </div>
);

const ChartWinnersSummary = () => {
  const [data, setData] = useState<
    {
      draw: string;
      pares: number;
      swer2: number;
      swer3: number;
      swer4: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const currentUserType = useAuthStore((state) => state.userTypeId);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const from = today
      const to = today;
      const result = await fetchWinners({ from, to });

      if (!result.success || !Array.isArray(result.data)) {
        console.warn("Result unsuccessful or data is not an array.");
        return;
      }

      const aggregatedData: Record<
        number,
        { pares: number; swer2: number; swer3: number; swer4: number }
      > = {};

      result.data.forEach((item: WinnerItem) => {
        const draw = item.DrawOrder;
        const category = item.GameCategory;

        if (!aggregatedData[draw]) {
          aggregatedData[draw] = {
            pares: 0,
            swer2: 0,
            swer3: 0,
            swer4: 0,
          };
        }

        switch (category) {
          case "STL Pares":
            aggregatedData[draw].pares += item.PayoutAmount || 0;
            break;
          case "STL Swer2":
            aggregatedData[draw].swer2 += item.PayoutAmount || 0;
            break;
          case "STL Swer3":
            aggregatedData[draw].swer3 += item.PayoutAmount || 0;
            break;
          case "STL Swer4":
            aggregatedData[draw].swer4 += item.PayoutAmount || 0;
            break;
          default:
            console.warn(`Unhandled GameCategory: ${category}`, item);
        }
      });

      const formattedData = [
        {
          draw: "First Draw",
          pares: aggregatedData[1]?.pares || 0,
          swer2: aggregatedData[1]?.swer2 || 0,
          swer3: aggregatedData[1]?.swer3 || 0,
          swer4: aggregatedData[1]?.swer4 || 0,
        },
        {
          draw: "Second Draw",
          pares: aggregatedData[2]?.pares || 0,
          swer2: aggregatedData[2]?.swer2 || 0,
          swer3: aggregatedData[2]?.swer3 || 0,
          swer4: aggregatedData[2]?.swer4 || 0,
        },
        {
          draw: "Third Draw",
          pares: aggregatedData[3]?.pares || 0,
          swer2: aggregatedData[3]?.swer2 || 0,
          swer3: aggregatedData[3]?.swer3 || 0,
          swer4: aggregatedData[3]?.swer4 || 0,
        },
      ];

      // Scale values and compute safeMax
      const scaledData = formattedData.map((item) => ({
        ...item,
        pares: item.pares / 100000,
        swer2: item.swer2 / 100000,
        swer3: item.swer3 / 100000,
        swer4: item.swer4 / 100000,
      }));

      setData(scaledData);
    } catch (error) {
      console.error("Error fetching winners summary:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute safeMax from scaled values
  const allValues = data.flatMap((item) => [item.pares, item.swer2, item.swer3, item.swer4]);
  const safeMax = Math.max(1000, ...allValues);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Today's Winnings by Game Type</p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <GenericCSVExportButton
            data={data}
            headers={["Draw", "STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"]}
            title="Today's Winnings by Game Type"
            getRowData={(item) => [
              item.draw,
              item.pares.toFixed(3),
              item.swer2.toFixed(3),
              item.swer3.toFixed(3),
              item.swer4.toFixed(3),
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
            dataset={data}
            height={300}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{
              legend: { hidden: true },
              noDataOverlay: {
                message: "Today's Winnings by Game Type will be displayed once available.",
              },
            }}
            grid={{ vertical: true }}
            series={[
              { dataKey: "pares", label: "STL Pares", color: "#E5C7FF" },
              { dataKey: "swer2", label: "STL Swer2", color: "#D2A7FF" },
              { dataKey: "swer3", label: "STL Swer3", color: "#BB86FC" },
              { dataKey: "swer4", label: "STL Swer4", color: "#A06FE6" },
            ]}
            yAxis={[
              {
                scaleType: "band",
                dataKey: "draw",
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
