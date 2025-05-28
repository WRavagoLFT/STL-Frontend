import React, { useState, useEffect } from "react";

// Generate 10 unique random numbers between 0–10
const generateRandomNumbers = (length: number, min = 0, max = 10) => {
  const numbers = new Set<number>();
  while (numbers.size < length) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};

const DrawCounterTablePage = (data: {
  numberArr: Object;
  gameCategory: number;
}) => {
  const [counterDraw, setCounterDraw] = useState<
    { number: number; frequency: number }[]
  >([]);

  useEffect(() => {
    let arr: { number: number; frequency: number }[] = [];
    Object.entries(data.numberArr).forEach(([key, value]) => {
      arr.push({ number: parseInt(key), frequency: value });
    });

    setCounterDraw(arr);

    console.log(data.gameCategory);
  }, [data.numberArr, data.gameCategory]);

  const isRightEdge = (index: number) => (index + 1) % 5 === 0;
  const isBottomEdge = (index: number, total: number, columns = 5) =>
    index < total - columns;

  return (
    <div className="bg-[#0038A8] rounded-xl w-full">
      <div className="grid grid-cols-5 w-full">
        {counterDraw.map((num, index) => (
          <div
            key={index}
            className={`text-white relative py-6 px-4 flex flex-col items-center justify-center text-sm
          ${!isRightEdge(index) ? "border-r" : ""}
          ${isBottomEdge(index, counterDraw.length) ? "border-b" : ""}
          border-[#F6BA12]`}
          >
            <div className="absolute top-1 left-1 text-sm text-[#857e59] font-semibold p-1">
              {num.number}
            </div>
            <div className="text-white font-bold text-3xl">{num.frequency}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawCounterTablePage;
