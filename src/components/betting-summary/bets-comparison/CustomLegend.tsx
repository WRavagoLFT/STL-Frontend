import React from "react";
import {
  BettorsandBetsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
} from "./types";

const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  secondDurationFrom,
  secondDurationTo,
  gameCategoryId,
}) => {
  // Get full legend item list
  const rawLegendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific
        )
      : getLegendItemsMap_Duration(
          categoryFilter,
          firstDateDuration,
          secondDateDuration,
          secondDurationFrom,
          secondDurationTo
        );

  // Filter based on rules
  const legendItems = rawLegendItems.filter((item) => {
    const isBetsOrBettors =
      categoryFilter === "Total Bets by Bet Type" ||
      categoryFilter === "Total Bettors by Bet Type";

    const label = item.label;

    if (isBetsOrBettors && (gameCategoryId === 1 || gameCategoryId === 2)) {
      return !label.startsWith("Ramble");
    }

    if (isBetsOrBettors && (gameCategoryId === 3 || gameCategoryId === 4)) {
      return !label.startsWith("Sahod") && !label.startsWith("Casas");
    }

    return true;
  });

  // Chunk into rows of 4
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
        <div
          key={rowIndex}
          className="flex flex-row text-sm space-x-5 justify-start mt-1 mr-4"
        >
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
