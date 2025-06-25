import React from 'react';
import { BettorsandBetsSummaryProps, getLegendItemsMap_Specific, getLegendItemsMap_Duration } from './types';

const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(categoryFilter, firstDateSpecific, secondDateSpecific)
      : getLegendItemsMap_Duration(categoryFilter, firstDateSpecific, secondDateSpecific, firstDateDuration, secondDateDuration);

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
    <div className="flex flex-col space-y-1 mt-1 mr-4">
      {chunkedLegendItems.map((chunk, rowIndex) => (
        <div key={rowIndex} className="flex flex-row space-x-2 justify-start">
          {chunk.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-[14px] h-[14px] rounded-full mr-1.5"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-[12px] font-normal leading-[14px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;