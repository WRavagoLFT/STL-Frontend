import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";

interface Winner {
  DrawOrder: number;
  GameCategory: string;
}

type DrawNumber = 1 | 2 | 3;

const drawLabelMap: Record<number, string> = {
  1: "First Draw",
  2: "Second Draw",
  3: "Third Draw",
};

const gameCategoryMap = {
  "STL Pares": "pares",
  "STL Swer2": "swer2",
  "STL Swer3": "swer3",
  "STL Swer4": "swer4",
} as const;

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

const ChartWinnersSummary = () => {
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

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const result = await fetchWinners({
      from: today,
      to: today,
    });

    if (!result.success || !Array.isArray(result.data)) {
      setLoading(false);
      return;
    }

    const drawSummary: Record<
      DrawNumber,
      { pares: number; swer2: number; swer3: number; swer4: number }
    > = {
      1: { pares: 0, swer2: 0, swer3: 0, swer4: 0 },
      2: { pares: 0, swer2: 0, swer3: 0, swer4: 0 },
      3: { pares: 0, swer2: 0, swer3: 0, swer4: 0 },
    };

    for (const item of result.data) {
      const draw = item.DrawOrder as DrawNumber;
      const categoryKey =
        gameCategoryMap[item.GameCategory as keyof typeof gameCategoryMap];

      if (drawSummary[draw] && categoryKey) {
        drawSummary[draw][categoryKey] += 1;
      }
    }

    const finalChartData = ([1, 2, 3] as DrawNumber[]).map((drawNum) => ({
      draw: drawLabelMap[drawNum],
      pares: drawSummary[drawNum].pares,
      swer2: drawSummary[drawNum].swer2,
      swer3: drawSummary[drawNum].swer3,
      swer4: drawSummary[drawNum].swer4,
    }));

    setData(finalChartData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const allValues = data.flatMap((item) => [
    item.pares,
    item.swer2,
    item.swer3,
    item.swer4,
  ]);
  const safeMax = Math.max(10, ...allValues);

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
                  data: data.map((item) => item.pares / 100000),
                  color: "#E5C7FF",
                  label: "STL Pares",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].pares.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer2 / 100000),
                  color: "#D2A7FF",
                  label: "STL Swer2",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer2.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer3 / 100000),
                  color: "#BB86FC",
                  label: "STL Swer3",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].swer3.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.swer4 / 100000),
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
