import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState, useCallback } from "react";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import dayjs from "dayjs";
import { useAuthStore } from "~/store/useAuthStore";

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
  <div className="flex flex-row text-sm space-x-5 justify-start mt-0.5 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-sm">Winners</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-sm">Winnings</p>
    </div>
  </div>
);

const ChartWinnersvsWinningsSummary = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { draw: string; winners: number; winnings: number; GameCategoryId: number | null }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const result = await fetchWinners({
      from: today,
      to: today,
      gameCategoryId,
    });

    if (!result.success || !Array.isArray(result.data)) {
      setLoading(false);
      return;
    }

    const filteredData: Winner[] = gameCategoryId
      ? result.data.filter((item : any) => item.GameCategoryId === gameCategoryId)
      : result.data;

    const drawSummary: Record<DrawNumber, { winners: number; winnings: number }> = {
      1: { winners: 0, winnings: 0 },
      2: { winners: 0, winnings: 0 },
      3: { winners: 0, winnings: 0 },
    };

    for (const item of filteredData) {
      const draw = item.DrawOrder as DrawNumber;
      if (drawSummary[draw]) {
        drawSummary[draw].winners += 1;
        drawSummary[draw].winnings += item.PayoutAmount || 0;
      }
    }

    const finalChartData = ([1, 2, 3] as DrawNumber[]).map((drawNum) => ({
      draw: drawLabelMap[drawNum],
      winners: drawSummary[drawNum].winners,
      winnings: drawSummary[drawNum].winnings / 100000, // scaled
      GameCategoryId: gameCategoryId ?? null,
    }));

    setChartData(finalChartData);
    setLoading(false);
  }, [gameCategoryId]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const maxWinnings = Math.max(...chartData.map((item) => item.winnings));
  const safeMax = maxWinnings < 1000 ? 1000 : maxWinnings;

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Today&apos;s Winners and Winnings</p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <GenericCSVExportButton
            data={chartData}
            headers={["Draw", "Winners", "Winnings"]}
            title="Summary of Winners and Winnings per Draw"
            getRowData={(item) => [
              item.draw,
              item.winners.toString(),
              item.winnings,
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
            height={300}
            grid={{ vertical: true }}
            layout="horizontal"
            slotProps={{
              legend: { hidden: true },
              noDataOverlay: {
                message: "Today's Winners and Winnings will be displayed once available.",
              },
            }}
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            dataset={chartData}
            yAxis={[
              {
                scaleType: "band",
                data: chartData.map((d) => d.draw),
              },
            ]}
            xAxis={[
              {
                label: "Total (x 100,000)",
                min: 0,
                max: safeMax,
                valueFormatter: (value: number) => `${value.toLocaleString()}`,
              },
            ]}
            series={[
              { dataKey: "winners", color: "#E5C7FF", label: "Winners" },
              { dataKey: "winnings", color: "#5050A5", label: "Winnings" },
            ]}
          />
        {/* )} */}
      </div>
    </div>
  );
};

export default ChartWinnersvsWinningsSummary;
