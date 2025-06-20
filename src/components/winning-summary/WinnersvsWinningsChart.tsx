import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";
import { TransactionData } from "~/types/types";

interface Winner {
  GameCategoryId: number;
  DrawOrder: number;
  PayoutAmount?: number;
}

type DrawNumber = 1 | 2 | 3;

const drawLabelMap: Record<number, string> = {
  1: "First Draw",
  2: "Second Draw",
  3: "Third Draw",
};

const CustomLegend = () => (
  <div className="flex flex-row space-x-5 justify-start mt-0.5 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-xs md:text-sm">Winners</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-xs md:text-sm">Winnings</p>
    </div>
  </div>
);

const ChartWinnersvsWinningsSummary = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    { draw: string; winners: number; winnings: number }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });

      const result = await fetchWinners({
        from: today,
        to: today,
        gameCategoryId,
      });

      if (!result.success || !Array.isArray(result.data)) {
        console.warn("[DEBUG] Invalid result from fetchWinners:", result);
        setLoading(false);
        return;
      }

      console.log("RESULT DATA:", result.data);

      // FIXED: use result.data instead of response.data
      let filtered = result.data.filter(
        (item: TransactionData) =>
          typeof item.DateOfTransaction === "string" &&
          item.DateOfTransaction.startsWith(today)
      );
      console.log("[DEBUG] Filtered by DateOfTransaction:", filtered);

      // Optional: further filter by GameCategoryId (defensive)
      if (gameCategoryId) {
        filtered = filtered.filter(
          (item: TransactionData) => item.GameCategoryId === gameCategoryId
        );
      }

      const drawSummary: Record<
        DrawNumber,
        { winners: number; winnings: number }
      > = {
        1: { winners: 0, winnings: 0 },
        2: { winners: 0, winnings: 0 },
        3: { winners: 0, winnings: 0 },
      };

      for (const item of filtered) {
        const draw = item.DrawOrder as DrawNumber;
        if (drawSummary[draw]) {
          drawSummary[draw].winners += 1;
          drawSummary[draw].winnings += item.PayoutAmount || 0;
        }
      }

      const finalChartData = ([1, 2, 3] as DrawNumber[]).map((drawNum) => ({
        draw: drawLabelMap[drawNum],
        winners: drawSummary[drawNum].winners,
        winnings: drawSummary[drawNum].winnings,
        GameCategoryId: gameCategoryId ?? null,
      }));

      console.log("[DEBUG] Final chart data:", finalChartData);
      setData(finalChartData);
    } catch (error) {
      console.error("Error in fetchChartData:", error);
    } finally {
      setLoading(false);
    }
  }, [gameCategoryId]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Today&apos;s Winners and Winnings
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={data}
              headers={["Draw", "Winners", "Winnings"]}
              title="Summary of Winners and Winnings per Draw"
              getRowData={(item) => [
                item.draw,
                item.winners.toString(),
                item.winnings,
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
                    "Today's Winners and Winnings will be displayed once available.",
                },
              }}
              series={[
                {
                  data: data.map((item) => item.winners / 100000),
                  color: "#BB86FC",
                  label: "Winners",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].winners.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.winnings / 100000),
                  color: "#5050A5",
                  label: "Winnings",
                  valueFormatter: (value, context) =>
                    `₱${data[context.dataIndex].winnings.toLocaleString()}`,
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

export default ChartWinnersvsWinningsSummary;
