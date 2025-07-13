"use client";

import React, { useState, useEffect } from "react";
import { FaMoneyBillAlt } from "react-icons/fa";
import router from "next/router";
import { useAuthStore } from "@/store/useAuthStore";

interface RegionData {
  RegionId?: number;
  Region: string;
  RegionFull?: string;
  TotalWinners?: number;
  TotalPayout: number;
  trend?: number;
}

interface WinningRegionData {
  Region: string;
  TotalPayout: number;
}

interface WinningRegionProps {
  data: WinningRegionData[];
}

const TopWinningRegionPage = (data: WinningRegionProps) => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: number }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const winningLabel =
    currentUserType === 3
      ? "Top Winning Area Today"
      : "Top Winning Regions Today";

  useEffect(() => {    
    if (!data || !data.data || data.data.length === 0) {
      console.warn("No data provided for Top Betting Regions.");
      return;
    }
    data.data.sort((a, b) => b.TotalPayout - a.TotalPayout);
    setRankedRegions(data.data.map((item, index) => ({ region: item, rank: index + 1, trend: 0 })));
  }, []);

  return (
    <div className="w-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaMoneyBillAlt size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">{winningLabel}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => router.push("/winning-summary/dashboard")}
            className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
          >
            View Winners
          </button>
        </div>
      </div>
      <div className="h-px bg-[#ACA993] mt-1 mb-2" />

      <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
        {rankedRegions.length === 0 ? (
          <div className="p-8 text-sm text-center text-[#888]">
            <p>Top Winning Regions</p>
            <p>Data will be displayed once available.</p>
          </div>
        ) : (
          rankedRegions.slice(0, 5).map((item, index) => (
            <div
              key={item.region.RegionId ?? item.region.Region}
              className={`flex items-center py-2 ${
                index === rankedRegions.length - 1 ? "border-none" : ""
              }`}
            >
              <div className="flex items-center w-[15%]">
                <span
                  className={`font-bold text-md ${
                    item.trend > 0
                      ? "text-[#046115]"
                      : item.trend < 0
                        ? "text-[#CE1126]"
                        : "text-[#aaa]"
                  }`}
                >
                  {item.trend > 0
                    ? `↑${item.trend}`
                    : item.trend < 0
                      ? `↓${Math.abs(item.trend)}`
                      : "→"}
                </span>
              </div>

              <p className="text-[#0038A8] flex-1 ml-2 text-md whitespace-nowrap overflow-hidden text-ellipsis">
                {item.region.Region}
              </p>

              <p className="text-[#212121] text-right flex-1 text-md">
                {(item.region.TotalPayout ?? 0).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopWinningRegionPage;
