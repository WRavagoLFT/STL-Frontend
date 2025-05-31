import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { buttonStyles } from "~/styles/theme";
import { fetchWinners } from "~/utils/api/winners";

interface WinnerItem {
  DrawOrder: number;
  GameCategory: string;
  PayoutAmount: number;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const from = "2025-05-01";
        const to = "2025-05-30";
        //console.log(`Date range: from ${from} to ${to}`);

        const result = await fetchWinners({ from, to });

        console.log("Raw result from fetchWinners:", result);

        if (!result.success || !Array.isArray(result.data)) {
          console.warn("Result unsuccessful or data is not an array.");
          setLoading(false);
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

        console.log("Aggregated data by draw and category:", aggregatedData);

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

        console.log("Formatted data before scaling:", formattedData);

        // const scaledData = formattedData.map((item) => ({
        //   ...item,
        //   pares: item.pares / 100000,
        //   swer2: item.swer2 / 100000,
        //   swer3: item.swer3 / 100000,
        //   swer4: item.swer4 / 100000,
        // }));

        console.log("Final scaled data:", formattedData);

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching winners summary:", error);
      } finally {
        setLoading(false);
        console.log("Finished fetching and processing data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Today's Winnings by Game Type</p>
          <CustomLegend />
        </div>
        <Button sx={buttonStyles} variant="contained">
          Export as CSV
        </Button>
      </div>

      <div className="h-full w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <BarChart
            height={300}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            grid={{ vertical: true }}
            series={[
              { data: data.map((d) => d.pares), color: "#E5C7FF" },
              { data: data.map((d) => d.swer2), color: "#D2A7FF" },
              { data: data.map((d) => d.swer3), color: "#BB86FC" },
              { data: data.map((d) => d.swer4), color: "#A06FE6" },
            ]}
            yAxis={[
              {
                scaleType: "band",
                data: ["First Draw", "Second Draw", "Third Draw"],
              },
            ]}
            xAxis={[
              {
                label: "Amount (in 100,000 units)",
                min: 0,
                max: 100,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ChartWinnersSummary;
