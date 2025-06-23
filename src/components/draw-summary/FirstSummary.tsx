import React from "react";

const FirstSummaryPage = (data: { drawOrder: number; values: string[][] }) => {
  return (
    <div className="bg-[#0038A8] py-5 px-3 rounded-xl text-white w-full max-w-2xl mx-auto text-center">
      <h2 className="text-xs md:text-base font-semibold text-center">
        {data.drawOrder === 1
          ? "FIRST"
          : data.drawOrder === 2
          ? "SECOND"
          : "THIRD"}
      </h2>
      <div className="w-full h-[2px] bg-gray-400 opacity-100 my-1" />
      <div className="mt-4 space-y-2 text-center">
        {data.values.map((item, index) => (
          <div key={index}>
            <div className="flex justify-center text-center gap-x-6 lg:gap-x-2 xl:gap-x-4 text-sm lg:text-lg text-gray-300">
              {item.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
            </div>
            <div className="w-full h-[2px] bg-gray-400 opacity-100 my-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstSummaryPage;
