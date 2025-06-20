import React from "react";
import { NetIncomePageProps } from "~/types/types";

const NetAACIncomePage: React.FC<NetIncomePageProps> = ({
  netAmount,
  netPercentage,
}) => {
  return (
    <div className="flex flex-col mb-2">
      <div className="w-full bg-[#E97451] text-white p-2 rounded-md mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
        {/* Left Side: Label + Percentage + Amount (on mobile) */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">Net AAC Income</span>
            <span className="text-sm md:hidden">
              {netPercentage.toFixed(3)}%
            </span>
          </div>

          {/* Desktop: show percentage below title */}
          <span className="text-sm font-medium hidden md:block">
            {netPercentage.toFixed(3)}%
          </span>

          {/* Mobile: show amount below */}
          <span className="text-lg font-bold md:hidden mt-1">
            ₱{" "}
            {netAmount.toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
          </span>
        </div>

        {/* Right Side: Desktop only amount */}
        <div className="hidden md:flex justify-center md:justify-end text-base font-semibold">
          ₱{" "}
          {netAmount.toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })}
        </div>
      </div>
    </div>
  );
};

export default NetAACIncomePage;
