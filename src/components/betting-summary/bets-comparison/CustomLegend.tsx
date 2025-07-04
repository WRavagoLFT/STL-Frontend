import React from "react";
import { BettorsandBetsSummaryProps, getLegendItemsMap_Specific, getLegendItemsMap_Duration } from "./types";

const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  secondDurationFrom,
  secondDurationTo,
}) => {
  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(categoryFilter, firstDateSpecific, secondDateSpecific)
      : getLegendItemsMap_Duration(
          categoryFilter,
          firstDateDuration,
          secondDateDuration,
          secondDurationFrom,
          secondDurationTo
        );

  const chunkedLegendItems = legendItems.reduce(
    (result, item, index) => {
      const chunkIndex = Math.floor(index / 4);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    },
    [] as { label: string; color: string }[][]
  );

  return (
    <div>
      {chunkedLegendItems.map((chunk, rowIndex) => (
        <div key={rowIndex} className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4">
          {chunk.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3.5 h-3.5 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;