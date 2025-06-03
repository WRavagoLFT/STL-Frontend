// reusable ui charts

import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import { ChartCardProps } from "~/types/interfaces";
import CSVExportButtonDashboard from "../buttons/CSVExportButtonDashboard";

const getLegendItems = (pageType: string) => {
  const labelMap: Record<string, string> = {
    manager: "Managers",
    executive: "Executives",
    operator: "Operators",
  };
  return [
    {
      color: "#BB86FC",
      label: `Total ${labelMap[pageType] || "Users"}`,
    },
    {
      color: "#5050A5",
      label: `Active ${labelMap[pageType] || "Users"}`,
    },
    {
      color: "#7266C9",
      label: `Inactive ${labelMap[pageType] || "Users"}`,
    },
    {
      color: "#3B3B81",
      label: `Deleted ${labelMap[pageType] || "Users"}`,
    },
    {
      color: "#282A68",
      label: `New ${labelMap[pageType] || "Users"}`,
    },
  ];
};

const CustomLegend: React.FC<{ pageType: string }> = ({ pageType }) => (
  <div className="flex space-x-2 justify-start mr-2">
    {getLegendItems(pageType).map((item) => (
      <div key={item.label} className="flex items-center">
        <div
          className="w-4 h-4 rounded-full mr-1.5"
          style={{ backgroundColor: item.color }}
        />
        <p className="text-sm">{item.label}</p>
      </div>
    ))}
  </div>
);

export const ChartCard = <T,>({
  chartData,
  regions,
  pageType,
  title,
  statsPerRegion,
}: Omit<ChartCardProps<T>, "label">) => {
  return (
    <div className="mt-3 mb-5">
      <div className="p-4 bg-[transparent] rounded-lg border border-[#0038A8]">
        <div className="pt-1 flex justify-between items-center flex-wrap">
          <div>
            <p className="text-lg">{title}</p>
            <CustomLegend pageType={pageType ?? ""} />
          </div>
          <div className="flex items-center">
            <CSVExportButtonDashboard statsPerRegion={statsPerRegion} pageType={pageType} />
          </div>
        </div>
        <div className="h-[270px] w-full min-w-0">
          <BarChart
            xAxis={[{ scaleType: "band", data: regions }]}
            yAxis={[{ label: "Number of Users" }]}
            series={chartData.map(({ label, color, data }) => ({
              data,
              label,
              color,
            }))}
            slotProps={{
              legend: { hidden: true },
              bar: {
                style: {
                  borderTopLeftRadius: "0.375rem",
                  borderTopRightRadius: "0.375rem",
                  transition: "fill 0.3s ease-in-out",
                  cursor: "pointer",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
