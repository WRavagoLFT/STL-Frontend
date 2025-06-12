import React, { useState, useEffect, useCallback } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";

type DrawNumber = 1 | 2 | 3;

const drawLabelMap: Record<number, string> = {
  1: "First Draw",
  2: "Second Draw",
  3: "Third Draw",
};

const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-8 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-1.5" />
      <p>Winners</p>
    </div>
  </div>
);

interface Winner {
  GameCategoryId: number;
  DrawOrder: number;
  PayoutAmount?: number;
}

const SummaryWinnersDrawTimePage = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { draw: string; winners: number; winnings: number }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const fetchAndProcessData = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const result = await fetchWinners({ from: today, to: today });

    if (!result.success || !Array.isArray(result.data)) {
      setLoading(false);
      return;
    }

    const filteredData: Winner[] = result.data;

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
        winnings: drawSummary[drawNum].winnings / 100000,
      };
    });

    setChartData(finalChartData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Summary of Winners</p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <GenericCSVExportButton
            data={chartData}
            headers={["Draw", "Winners", "Winnings (in 100k)"]}
            title="Summary of Winners per Draw"
            getRowData={(item) => [item.draw, item.winners, item.winnings.toFixed(2)]}
          />
        )}
      </div>
      <div className="h-full w-full">
        <BarChart
          height={300}
          grid={{ vertical: true }}
          layout="horizontal"
          margin={{ left: 90, right: 20, top: 20, bottom: 45 }}
          slotProps={{
            noDataOverlay: {
              message: "Summary of Winners data will be displayed once available.",
            },
            legend: { hidden: true },
          }}
          series={[
            {
              data: chartData.map((item) => item.winners),
              color: "#BB86FC",
              label: "Winners",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: chartData.map((item) => item.draw),
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
          xAxis={[
            {
              label: "Total (x 100,000)",
              scaleType: "linear",
              min: 0,
              max: Math.max(...chartData.map((item) => item.winners), 1000),
              valueFormatter: (value: number) => `${value}`,
              tickSize: 8,
              tickLabelProps: { style: { fontSize: "12px" } },
              barCategoryGap: 0.7,
            } as any,
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryWinnersDrawTimePage;
