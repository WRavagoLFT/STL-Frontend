"use client";

import React, { useState, useEffect } from "react";
import { FaDiceSix } from "react-icons/fa";
import router from "next/router";
import { useAuthStore } from "@/store/useAuthStore";

interface BettingRegionData {
  Region: string;
  TotalBetAmount: number;
}

interface BettingRegionProps {
  data: BettingRegionData[];
  loading?: boolean;
}

const TopBettingRegionPage = ({ data, loading }: BettingRegionProps) => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: BettingRegionData; rank: number; trend: number }[]
  >([]);

  const currentUserType = useAuthStore((state) => state.userTypeId);
  const bettingLabel =
    currentUserType === 3
      ? "Top Betting Area Today"
      : "Top Betting Regions Today";

  useEffect(() => {
    if (!data || data.length === 0) return;

    const sorted = [...data].sort((a, b) => b.TotalBetAmount - a.TotalBetAmount);
    setRankedRegions(
      sorted.map((item, index) => ({
        region: item,
        rank: index + 1,
        trend: 0,
      }))
    );
  }, [data]);

  const renderSkeletonItem = (key: number) => (
    <div key={key} className="flex items-center py-2 animate-pulse">
      <div className="w-[15%] h-4 bg-gray-300 rounded" />
      <div className="ml-2 flex-1 h-4 bg-gray-300 rounded" />
      <div className="w-20 h-4 bg-gray-300 rounded" />
    </div>
  );

  return (
    <div className="w-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaDiceSix size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">{bettingLabel}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => router.push("/betting-summary/dashboard")}
            disabled={loading}
            className={`rounded-lg px-7 py-2 text-[0.8rem] text-white transition
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0038A8] hover:bg-blue-700"}`}>
            View Bettors
          </button>
        </div>
      </div>

      <div className="border-b border-[#0038A8]" />

      <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => renderSkeletonItem(i))}
          </>
        ) : rankedRegions.length === 0 ? (
          <div className="p-8 text-sm text-center text-[#888]">
            <p>Top Winning Regions</p>
            <p>Data will be displayed once available.</p>
          </div>
        ) : (
          rankedRegions.slice(0, 5).map((item, index) => (
            <div
              key={item.region.Region}
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
                ₱ {(item.region.TotalBetAmount ?? 0).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopBettingRegionPage;
