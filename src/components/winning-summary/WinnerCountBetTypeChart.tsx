import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { buttonStyles } from "~/styles/theme";
import { fetchWinners } from "~/utils/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";

interface WinnerItem {
  GameCategoryId: number;
  DrawOrder: number;
  Tumbok?: number;
  Sahod?: number;
  Ramble?: number;
  TresCasas?: number;
  SaisCasas?: number;
  DyisCasas?: number;
}

interface AggregatedDrawData {
  draw: string;
  Tumbok: number;
  Sahod: number;
  Ramble: number;
  Casas: number;
  [key: string]: string | number;
}

// Returns the bet types series for a gameCategoryId
const getBetTypeSeries = (gameCategoryId?: number) => {
  switch (gameCategoryId) {
    case 1: // STL PARES
    case 2: // STL SWER2
      return [
        { dataKey: "Tumbok", color: "#E5C7FF" },
        { dataKey: "Sahod", color: "#5050A5" },
        { dataKey: "Casas", color: "#7266C9" },
      ];
    case 3: // STL SWER3
    case 4: // STL SWER4
      return [
        { dataKey: "Tumbok", color: "#E5C7FF" },
        { dataKey: "Ramble", color: "#5050A5" },
      ];
    default:
      return [];
  }
};

const getCustomLegend = (gameCategoryId?: number) => {
  const series = getBetTypeSeries(gameCategoryId);
  return (
    <div className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
      {series.map((item) => (
        <div className="flex items-center" key={item.dataKey}>
          <div
            className="w-3.5 h-3.5 rounded-full mr-2"
            style={{ backgroundColor: item.color }}
          />
          <p className="text-sm">{item.dataKey}</p>
        </div>
      ))}
    </div>
  );
};

const ChartWinnersBetTypeSummary = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<AggregatedDrawData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      //console.log("Using gameCategoryId:", gameCategoryId);

      try {
        const from = "2000-01-01";
        const to = "2999-01-01";
        const response = await fetchWinners({ from, to, gameCategoryId });

        //console.log("Response received:", response);

        if (response.success && Array.isArray(response.data)) {
          const data = response.data as WinnerItem[];
          //console.log(`Total items fetched: ${data.length}`);

          const aggregatedByDraw: Record<number, AggregatedDrawData> = {
            1: { draw: "First Draw", Tumbok: 0, Sahod: 0, Ramble: 0, Casas: 0 },
            2: {
              draw: "Second Draw",
              Tumbok: 0,
              Sahod: 0,
              Ramble: 0,
              Casas: 0,
            },
            3: { draw: "Third Draw", Tumbok: 0, Sahod: 0, Ramble: 0, Casas: 0 },
          };

          data.forEach((item, index) => {
            if (item.GameCategoryId !== gameCategoryId) {
              // console.log(
              //   `[${index}] Skipped item due to mismatched GameCategoryId: ${item.GameCategoryId}`
              // );
              return;
            }

            const drawData = aggregatedByDraw[item.DrawOrder];
            if (!drawData) {
              console.warn(`Skipped unknown draw order: ${item.DrawOrder}`);
              return;
            }

            const Tumbok = Number(item.Tumbok) || 0;
            const Sahod = Number(item.Sahod) || 0;
            const Ramble = Number(item.Ramble) || 0;
            const TresCasas = Number(item.TresCasas) || 0;
            const SaisCasas = Number(item.SaisCasas) || 0;
            const DyisCasas = Number(item.DyisCasas) || 0;

            // console.log(
            //   `[${index}] Draw: ${item.DrawOrder}, Tumbok: ${Tumbok}, Sahod: ${Sahod}, Ramble: ${Ramble}, Casas: ${
            //     TresCasas + SaisCasas + DyisCasas
            //   }`
            // );

            if ("Tumbok" in item) {
              drawData.Tumbok += Tumbok;
            }

            if (
              "Sahod" in item &&
              gameCategoryId !== 3 &&
              gameCategoryId !== 4
            ) {
              drawData.Sahod += Sahod;
            }

            if (
              "Ramble" in item &&
              (gameCategoryId === 3 || gameCategoryId === 4)
            ) {
              drawData.Ramble += Ramble;
            }

            drawData.Casas += TresCasas + SaisCasas + DyisCasas;
          });

          // console.log("Aggregated results before scaling:", aggregatedByDraw);

          const formattedData = Object.values(aggregatedByDraw).map((draw) => {
            const scaledDraw = { ...draw };
            (["Tumbok", "Sahod", "Ramble", "Casas"] as const).forEach((key) => {
              scaledDraw[key] = scaledDraw[key] / 100000; // divided to 100,000
            });

            return scaledDraw;
          });

          formattedData.forEach((draw, i) => {
            //console.log(`Draw ${i + 1} after scaling:`, draw);
          });

          setChartData(formattedData);
        } else {
          console.warn("Invalid or unsuccessful response format.");
        }
      } catch (error) {
        console.error("Error fetching winners data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameCategoryId]);

  const betTypeSeries = getBetTypeSeries(gameCategoryId);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col leading-none">
          <p className="text-lg leading-none">Today's Winnings by Game Type</p>
          {getCustomLegend(gameCategoryId)}
        </div>
          <GenericCSVExportButton
            data={chartData}
            headers={["Draw", ...betTypeSeries.map((s) => s.dataKey)]}
            title="Today's Winnings by Game Type"
            getRowData={(item) => [
              item.draw,
              ...betTypeSeries.map(({ dataKey }) =>
                Number(item[dataKey] || 0).toFixed(2)
              ),
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
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{ legend: { hidden: true } }}
            dataset={chartData}
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
            series={betTypeSeries}
          />
        )}
      </div>
    </div>
  );
};

export default ChartWinnersBetTypeSummary;
