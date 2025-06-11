import React, { useState } from "react";
import { ShareBreakdownPageProps } from "~/types/interfaces";

const GrossAACSharePage: React.FC<ShareBreakdownPageProps> = ({
  totalPercentage,
  totalShareAmount,
  breakdown,
  defaultBreakdown = [],
  title = "Gross AAC Share",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const breakdownToShow =
    breakdown && breakdown.length > 0
      ? breakdown
      : defaultBreakdown && defaultBreakdown.length > 0
        ? defaultBreakdown
        : [];

  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left"
          aria-expanded={isOpen}
          aria-controls="share-breakdown-content"
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold">{title}</span>
            <span className="text-sm font-medium">
              {totalPercentage.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-center md:justify-end text-base font-semibold">
            ₱{" "}
            {totalShareAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </button>

        {/* Accordion Content */}
        {!isOpen && (
          <div
            id="share-breakdown-content"
            className="bg-transparent border border-[#0038A8] p-2 rounded-md mt-3"
          >
            <span className="text-sm font-bold">{title} Details</span>

            {breakdownToShow.length > 0 ? (
              breakdownToShow.map((item, index) => (
                <div
                  key={index}
                  className="mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {item.ShareTitle ?? "N/A"}
                    </span>
                    <span className="text-sm font-medium">
                      {item.Percentage ?? 0}%
                    </span>
                  </div>
                  <div className="flex justify-center md:justify-end text-base font-semibold">
                    ₱{" "}
                    {(item.ShareAmount ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-2 text-sm italic text-gray-500">
                No share breakdown available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrossAACSharePage;
