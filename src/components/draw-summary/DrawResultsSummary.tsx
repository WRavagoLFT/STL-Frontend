import React from "react";

const DrawResultsSummaryPage = (data: {
  firstDraw: string[];
  secondDraw: string[];
  thirdDraw: string[];
}) => {

  console.log(data);

  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row gap-6 flex-wrap md:space-x-6 md:items-stretch md:[&>div]:flex-1">
        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">First Draw</p>
          <div className="grid grid-cols-2 gap-2">
            {data.firstDraw.map((number, index) => (
              <div
                key={index}
                className="bg-transparent border border-[#0038A8] rounded-sm p-5 md:px-9 md:py-7 flex items-center justify-center"
              >
                <p className="font-bold text-3xl lg:text-5xl">{number}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">Second Draw</p>
          <div className="grid grid-cols-2 gap-2">
            {data.secondDraw.map((number, index) => (
              <div
                key={index}
                className="bg-transparent border border-[#0038A8] rounded-sm p-5 md:px-9 md:py-7 flex items-center justify-center"
              >
                <p className="font-bold text-3xl lg:text-5xl">{number}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">Third Draw</p>
          <div className="grid grid-cols-2 gap-2">
            {data.thirdDraw.map((number, index) => (
              <div
                key={index}
                className="bg-transparent border border-[#0038A8] rounded-sm p-5 md:px-9 md:py-7 flex items-center justify-center"
              >
                <p className="font-bold text-3xl lg:text-5xl">{number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="">
        <div className="w-full flex justify-end mt-5">
          {/* supposed to be modal */}
          <button className="bg-[#0038A8] hover:bg-blue-700 text-sm text-white py-3 px-6 rounded-md">
            Input Draw Combination
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DrawResultsSummaryPage;
