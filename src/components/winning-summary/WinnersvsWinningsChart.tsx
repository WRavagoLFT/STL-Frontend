import { CircularProgress, Button } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { buttonStyles } from "~/styles/theme";
import { useEffect, useState } from "react";
import { fetchWinners } from "~/utils/api/winners";
import dayjs from "dayjs";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";

interface Winner {
  GameCategoryId: number;
  DrawOrder: number;
  PayoutAmount?: number;
}

type DrawNumber = 1 | 2 | 3;

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

const drawLabelMap: Record<number, string> = {
  1: "First Draw",
  2: "Second Draw",
  3: "Third Draw",
};

const ChartWinnersvsWinningsSummary = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { draw: string; winners: number; winnings: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const from = "2000-05-01";
      const to = "2099-05-30";
      //const today = new Date().toISOString().split("T")[0];
      //console.log("Fetching winners with params:", { gameCategoryId, from: today, to: today });

      const result = await fetchWinners({
        from,
        to,
        gameCategoryId,
      });

      if (!result.success || !Array.isArray(result.data)) {
        setLoading(false);
        return;
      }

      const filteredData: Winner[] = gameCategoryId
        ? (result.data as Winner[]).filter((item) => item.GameCategoryId === gameCategoryId)
        : (result.data as Winner[]);

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

      const finalChartData = [1, 2, 3].map((draw) => {
        const drawNum = draw as DrawNumber;
        return {
          draw: drawLabelMap[drawNum] || `Draw ${drawNum}`,
          winners: drawSummary[drawNum].winners,
          // winnings: drawSummary[drawNum].winnings,
          winnings: drawSummary[drawNum].winnings / 100000, // scalling data
          GameCategoryId: gameCategoryId ?? null,
        };
      });

      //console.log("Final chart data:", finalChartData);
      setChartData(finalChartData);

      setLoading(false);
    };

    fetchData();
  }, [gameCategoryId]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">
            Today&apos;s Winners and Winnings
          </p>
          <CustomLegend />
        </div>
          <GenericCSVExportButton
            data={chartData}
            headers={["Draw", "Winners", "Winnings"]}
            title="Summary of Winners and Winnings per Draw"
            getRowData={(item) => [
              item.draw,
              item.winners.toString(),
              item.winnings.toFixed(2),
            ]}
          />
      </div>

      <div className="h-full w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <BarChart
            height={300}
            grid={{ vertical: true }}
            layout="horizontal"
            slotProps={{ legend: { hidden: true } }}
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
                label: "Amount (in 100,000 units)",
                min: 0,
                max: 100000,
                valueFormatter: (value: number) => `${value.toLocaleString()}`,
              },
            ]}
            series={[
              { dataKey: "winners", color: "#E5C7FF", label: "Winners" },
              { dataKey: "winnings", color: "#5050A5", label: "Winnings" },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ChartWinnersvsWinningsSummary;
