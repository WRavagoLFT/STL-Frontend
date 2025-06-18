import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
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
      <p className="text-xs md:text-sm">Winners</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-1.5" />
      <p className="text-xs md:text-sm">Winnings</p>
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
  const [data, setData] = useState<
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

    const drawSummary: Record<
      DrawNumber,
      { winners: number; winnings: number }
    > = {
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

    const finaldata = [1, 2, 3].map((draw) => {
      const drawNum = draw as DrawNumber;
      return {
        draw: drawLabelMap[drawNum] || `Draw ${drawNum}`,
        winners: drawSummary[drawNum].winners,
        winnings: drawSummary[drawNum].winnings,
      };
    });

    setData(finaldata);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Summary of Winners
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={data}
              headers={["Draw", "Winners", "Winnings (in 100k)"]}
              title="Summary of Winners per Draw"
              getRowData={(item) => [
                item.draw,
                item.winners,
                item.winnings.toFixed(2),
              ]}
            />
          </div>
        )}
      </div>

      <div className="h-full w-full mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <div className="min-w-[600px]">
            <BarChart
              height={300}
              grid={{ vertical: true }}
              layout="horizontal"
              margin={{ left: 90, right: 20, top: 20, bottom: 45 }}
              slotProps={{
                noDataOverlay: {
                  message:
                    "Summary of Winners data will be displayed once available.",
                },
                legend: { hidden: true },
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
                  data: data.map((item) => item.draw),
                  tickLabelProps: { style: { fontSize: "12px" } },
                } as any,
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

export default SummaryWinnersDrawTimePage;
