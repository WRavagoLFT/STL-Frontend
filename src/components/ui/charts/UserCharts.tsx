import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartCardProps } from "@/types/interfaces";
import GenericCSVExportButton from "../buttons/CSVExportButtonDashboard";

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
  <div className="flex flex-row space-x-5 justify-start mt-1 mr-4">
    {getLegendItems(pageType).map((item) => (
      <div key={item.label} className="flex items-center">
        <div
          className="w-3.5 h-3.5 rounded-full mr-2"
          style={{ backgroundColor: item.color }}
        />
        <p className="text-xs md:text-sm">{item.label}</p>
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
  loading,
}: Omit<ChartCardProps<T>, "label">) => {
  const pluralRole = (() => {
    const map: Record<string, string> = {
      manager: "Managers",
      executive: "Executives",
      operator: "Operators",
    };
    return map[pageType ?? ""] || "Users";
  })();
  return (
    <div className="bg-transparent px-4 py-7 my-8 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            {title}
          </p>
          <CustomLegend pageType={pageType ?? ""} />
        </div>

        <div className="mt-2 md:mt-0">
          <GenericCSVExportButton
            data={statsPerRegion}
            headers={[
              "Region",
              "Total",
              "Active",
              "Inactive",
              "Deleted",
              "New",
            ]}
            title={`${pluralRole} Dashboard Summary`}
            getRowData={(item) => [
              item.regionName ?? "",
              item.total ?? 0,
              item.active ?? 0,
              item.inactive ?? 0,
              item.deleted ?? 0,
              item.new ?? 0,
            ]}
            loading={loading}
          />
        </div>
      </div>

      <div className="h-full w-full mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <div className="min-w-[850px] md:min-w-[600px]">
            <BarChart
              height={300}
              grid={{ vertical: true }}
              margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
              slotProps={{
                legend: { hidden: true },
                noDataOverlay: {
                  message: `User summary data will be displayed once available.`,
                },
                bar: {
                  style: {
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                    transition: "fill 0.3s ease-in-out",
                    cursor: "pointer",
                  },
                },
              }}
              xAxis={[
                {
                  scaleType: "band",
                  data: regions,
                  label: "Regions",
                  tickLabelProps: { style: { fontSize: "12px" } },
                } as any,
              ]}
              yAxis={[
                {
                  label: "Number of Users",
                  scaleType: "linear",
                  tickLabelProps: { style: { fontSize: "12px" } },
                } as any,
              ]}
              series={chartData.map(({ label, color, data }) => ({
                data,
                label,
                color,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
