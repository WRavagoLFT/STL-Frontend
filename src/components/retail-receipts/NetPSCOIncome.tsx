import React from "react";
import { NetIncomePageProps } from "@/types/types";

const NetPSCOIncomePage: React.FC<NetIncomePageProps> = ({
  netAmount,
  netPercentage,
  loading,
}) => {
  return (
    <div className="flex flex-col mb-2">
      {loading ? (
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="w-full space-y-4">
            <div className="bg-[#E97451] px-4 py-6 rounded-lg shadow-sm animate-pulse space-y-2">
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full bg-[#E97451] text-white p-2 rounded-md mt-2 grid grid-cols-1 lg:grid-cols-2 items-center gap-2 text-left">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Net PCSO Income</span>
                <span className="text-sm md:hidden">
                  {netPercentage.toFixed(3)}%
                </span>
              </div>
              <span className="text-sm font-medium hidden md:block">
                {netPercentage.toFixed(3)}%
              </span>
              <span className="text-lg font-bold md:hidden mt-1">
                ₱{" "}
                {netAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </span>
            </div>
            <div className="hidden md:flex justify-start lg:justify-end text-base font-semibold">
              ₱{" "}
              {netAmount.toLocaleString(undefined, {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NetPSCOIncomePage;
