import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";
import { TransactionData } from "~/types/types";

const CustomLegend = () => (
  <div className="flex flex-row space-x-5 justify-start mt-0.5 mr-4">
    {Object.entries({
      "STL Pares": "#E5C7FF",
      "STL Swer2": "#D2A7FF",
      "STL Swer3": "#BB86FC",
      "STL Swer4": "#A06FE6",
    }).map(([label, color]) => (
      <div className="flex items-center" key={label}>
        <div
          className="w-3.5 h-3.5 rounded-full mr-2"
          style={{ backgroundColor: color }}
        />
        <p className="text-xs md:text-sm">{label}</p>
      </div>
    ))}
  </div>
);

const ChartWinnersSummary = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    {
      draw: string;
      pares: number;
      swer2: number;
      swer3: number;
      swer4: number;
    }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const fetchWinnersData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });

      const response = await fetchWinners({
        from: today,
        to: today,
      });

      console.log('WINNER COUNT CHART', response);

      if (!response.success || !Array.isArray(response.data)) {
        console.warn("[DEBUG] fetchWinners failed or data is invalid.");
        setLoading(false);
        return;
      }

      const filtered = response.data.filter(
        (item: TransactionData) =>
          typeof item.DateOfTransaction === "string" &&
          item.DateOfTransaction.startsWith(today)
      );

      //console.log("[DEBUG] Filtered today's transactions:", filtered);

      const aggregatedData: Record<
        number,
        { pares: number; swer2: number; swer3: number; swer4: number }
      > = {};

      for (const item of filtered) {
        if (!aggregatedData[item.DrawOrder]) {
          aggregatedData[item.DrawOrder] = {
            pares: 0,
            swer2: 0,
            swer3: 0,
            swer4: 0,
          };
        }

        const bucket = aggregatedData[item.DrawOrder];
        switch (item.GameCategoryId) {
          case 1:
            bucket.pares += item.TotalBettors || 0;
            break;
          case 2:
            bucket.swer2 += item.TotalBettors || 0;
            break;
          case 3:
            bucket.swer3 += item.TotalBettors || 0;
            break;
          case 4:
            bucket.swer4 += item.TotalBettors || 0;
            break;
        }
      }

      const formattedData = [1, 2, 3].map((draw) => ({
        draw:
          draw === 1
            ? "First Draw"
            : draw === 2
            ? "Second Draw"
            : "Third Draw",
        pares: aggregatedData[draw]?.pares || 0,
        swer2: aggregatedData[draw]?.swer2 || 0,
        swer3: aggregatedData[draw]?.swer3 || 0,
        swer4: aggregatedData[draw]?.swer4 || 0,
      }));

      //console.log("[DEBUG] Final formatted bettor data:", formattedData);
      setData(formattedData);
    } catch (error) {
      console.error("Error loading Bettors Count:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWinnersData();
  }, [fetchWinnersData]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Today's Winners by Game Type
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={data}
              headers={[
                "Draw",
                "STL Pares",
                "STL Swer2",
                "STL Swer3",
                "STL Swer4",
              ]}
              title="Today's Winners by Game Type"
              getRowData={(item) => [
                item.draw,
                item.pares.toString(),
                item.swer2.toString(),
                item.swer3.toString(),
                item.swer4.toString(),
              ]}
            />
          </div>
        )}
      </div>

      <div className="w-full pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <div className="min-w-[850px] md:min-w-[600px]">
            <BarChart
              height={300}
              grid={{ vertical: true }}
              layout="horizontal"
              margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
              slotProps={{
                legend: { hidden: true },
                noDataOverlay: {
                  message:
                    "Today's Winners by Game Type will be displayed once available.",
                },
              }}
              series={[
                {
                  data: data.map((item) => item.pares),
                  color: "#E5C7FF",
                  label: "STL Pares",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].pares.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer2),
                  color: "#D2A7FF",
                  label: "STL Swer2",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer2.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer3),
                  color: "#BB86FC",
                  label: "STL Swer3",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer3.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer4),
                  color: "#A06FE6",
                  label: "STL Swer4",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer4.toLocaleString()}`,
                },
              ]}
              yAxis={[
                {
                  scaleType: "band",
                  data: data.map((d) => d.draw),
                },
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
        )}
      </div>
    </div>
  );
};

export default ChartWinnersSummary;
