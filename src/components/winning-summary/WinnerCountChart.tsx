"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/lib/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";
import { TransactionData } from "~/types/types";

const CustomLegend = () => (
  <div className="flex flex-row w-full space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-xs md:text-sm">STL Pares</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-xs md:text-sm">STL Swer2</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#7266C9] mr-2" />
      <p className="text-xs md:text-sm">STL Swer3</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#3B3B81] mr-2" />
      <p className="text-xs md:text-sm">STL Swer4</p>
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
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const fetchWinnersData = async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });

      const response = await fetchWinners({
        from: today,
        to: today,
      });

      console.log("[DEBUG] Raw response from fetchWinners:", response);

      const res = response.data.filter((item: TransactionData) => {
        if (!item.DateOfTransaction) return false;
        const localDate = new Date(item.DateOfTransaction).toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        });
        return localDate === today;
      });

      console.log("[DEBUG] Filtered transactions (Asia/Manila):", res);

      if (response.success && Array.isArray(res)) {
        const aggregatedData: Record<
          number,
          { pares: number; swer2: number; swer3: number; swer4: number }
        > = {};

        res.forEach((item: TransactionData) => {
          const draw = Number(item.DrawOrder);
          if (!draw || isNaN(draw)) {
            console.warn("[DEBUG] Invalid DrawOrder in item:", item);
            return;
          }

          if (!aggregatedData[draw]) {
            aggregatedData[draw] = {
              pares: 0,
              swer2: 0,
              swer3: 0,
              swer4: 0,
            };
          }

          switch (item.GameCategoryId) {
            case 1:
              aggregatedData[draw].pares += 1;
              break;
            case 2:
              aggregatedData[draw].swer2 += 1;
              break;
            case 3:
              aggregatedData[draw].swer3 += 1;
              break;
            case 4:
              aggregatedData[draw].swer4 += 1;
              break;
          }
        });

        console.log("[DEBUG] Aggregated data by draw:", aggregatedData);

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

        console.log("[DEBUG] Final formatted chart data:", formattedData);
        setData(formattedData);
      }
    } catch (error) {
      console.log("Error loading Winners Count: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnersData();
  }, []);

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
              title="Summary of Winners per Draw"
              getRowData={(item) => [
                item.draw,
                item.pares.toLocaleString(),
                item.swer2.toLocaleString(),
                item.swer3.toLocaleString(),
                item.swer4.toLocaleString(),
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
                noDataOverlay: {
                  message:
                    "Today's Winners by Game Type data will be displayed once available.",
                },
                legend: { hidden: true },
              }}
              series={[
                {
                  data: data.map((item) => item.pares / 100000),
                  label: "STL Pares",
                  color: "#E5C7FF",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].pares.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer2 / 100000),
                  label: "STL Swer2",
                  color: "#5050A5",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer2.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer3 / 100000),
                  label: "STL Swer3",
                  color: "#7266C9",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer3.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer4 / 100000),
                  label: "STL Swer4",
                  color: "#3B3B81",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer4.toLocaleString()}`,
                },
              ]}
              yAxis={[
                {
                  scaleType: "band",
                  data: data.map((item) => item.draw),
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