import React, { useState } from "react";
import { ShareBreakdownPageProps } from "~/types/interfaces";

const GrossPSCOSharePage: React.FC<ShareBreakdownPageProps> = ({
  totalPercentage,
  totalShareAmount,
  breakdown,
  defaultBreakdown = [],
  title = "Gross PCSO Share",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const breakdownToShow =
    breakdown && breakdown.length > 0 ? breakdown : defaultBreakdown;

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 lg:grid-cols-2 items-center gap-2 text-left"
          aria-expanded={isOpen}
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">{title}</span>
              <span className="text-sm font-medium md:hidden">
                {totalPercentage.toFixed(3)}%
              </span>
            </div>
            <span className="text-sm font-medium hidden md:block">
              {totalPercentage.toFixed(3)}%
            </span>
            <span className="text-lg font-bold md:hidden mt-1">
              ₱{" "}
              {totalShareAmount.toLocaleString(undefined, {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </span>
          </div>
          <div className="hidden md:flex  lg:justify-end text-base font-semibold">
            ₱{" "}
            {totalShareAmount.toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
          </div>
        </button>

        {!isOpen && (
          <div
            className="bg-transparent border border-[#0038A8] p-2 rounded-md mt-3"
          >
            <span className="text-sm font-bold">{title} Details</span>

            {breakdownToShow.length > 0 ? (
              breakdownToShow.map((item, index) => (
                <div
                  key={index}
                  className="mt-2 grid grid-cols-1 lg:grid-cols-2 items-center md:gap-2"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center md:hidden">
                      <span className="text-sm font-bold">
                        {item.ShareTitle ?? "N/A"}
                      </span>
                      <span className="text-sm font-medium">
                        {(item.Percentage ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 3,
                          maximumFractionDigits: 3,
                        })}
                        %
                      </span>
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="text-sm font-bold">
                        {item.ShareTitle ?? "N/A"}
                      </span>
                      <span className="text-sm font-medium">
                        {(item.Percentage ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 3,
                          maximumFractionDigits: 3,
                        })}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start lg:justify-end text-lg font-bold">
                    ₱{" "}
                    {(item.ShareAmount ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
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

export default GrossPSCOSharePage;
