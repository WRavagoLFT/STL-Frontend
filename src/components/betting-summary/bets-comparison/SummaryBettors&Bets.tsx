import { useState, useEffect, useCallback} from 'react';
import { CircularProgress } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { BettorsandBetsSummaryProps, getLegendItemsMap_Specific, getLegendItemsMap_Duration } from "../../../store/useBettingStore";
import { fetchCompareHistoricalDate, fetchCompareHistoricalRange } from '~/utils/api/transactions';

// interfaces
// Chart Data for Specific Date
interface SpecificDatePayload {
  DrawOrder: Array<{
    TransactionDate: string;
    DrawOrder: number;
    TotalBets: number;
    TotalBettors: number;
    TotalTumbok?: number;
    TotalSahod?: number;
    TotalRamble?: number;
    BetTypes?: {
      Tumbok: number;
      Sahod: number;
      Ramble: number;
    };
    GameCategory?: string;
  }>;
  Region: Array<any>; // Not used in these calculations
}

interface chartOne_Specific {
  TransactionDate: string;
  DrawOrder: number;
  Region: null;
  GameCategory: null;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
}

type Chart1Data = {
  // Specific Date
  firstDateBettors?: number;
  secondDateBettors?: number;
  firstDateBets?: number;
  secondDateBets?: number;
  // Date Duration
  firstRangeBettors?: number;
  secondRangeBettors?: number;
  firstRangeBets?: number;
  secondRangeBets?: number;
};

type Chart25Data = {
  // Specific Date
  drawOrder?: number;
  firstDateTumbok?: number;
  secondDateTumbok?: number;
  firstDateSahod?: number;
  secondDateSahod?: number;
  // Date Duration
  firstRangeTumbok?: number;
  secondRangeTumbok?: number;
  firstRangeBetsSahod?: number;
  secondRangeBetsSahod?: number;
}

type Chart36Data = {
  drawOrder: number;
  firstDateSTLPares: number;
  secondDateSTLPares: number;
  firstDateSTLSwer2: number;
  secondDateSTLSwer2: number;
  firstDateSTLSwer3: number;
  secondDateSTLSwer3: number;
  firstDateSTLSwer4: number;
  secondDateSTLSwer4: number;
  // Date Duration
  firstRangeSTLPares: number;
  secondRangeSTLPares: number;
  firstRangeSTLSwer2: number;
  secondRangeSTLSwer2: number;
  firstRangeSTLSwer3: number;
  secondRangeSTLSwer3: number;
  firstRangeSTLSwer4: number;
  secondRangeSTLSwer4: number;
}

type ChartData = Chart1Data | Chart25Data | Chart36Data;
// Chart Data for Date Duration
interface chartOne_Range{
  DrawOrder: number;
  Region: null;
  GameCategory: null;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  DateRange: {
    start: string;
    end: string;
  }
}
interface chartTwoFive_Range{
  DrawOrder: number;
  Region: null;
  GameCategory: null;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  DateRange: {
    start: string;
    end: string;
  }
  BetTypes: {
    Tumbok: number;
    Sahod: number;
    Ramble: number;
  }
}
interface chartThreeSix_Range{
  DrawOrder: number;
  Region: null;
  GameCategory: string;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  DateRange: {
    start: string;
    end: string;
  }
}

// Date Formatter
const formatDate = (date: string | null): string => {
  if (!date) return '';
  const d = new Date(date); // 
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// custom legend
const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
  // Determine which legend items map to use based on the dateFilter
  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific
        )
      : getLegendItemsMap_Duration(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific,
          firstDateDuration,
          secondDateDuration
        );

  // Group legend items into rows of 4 for a 4x2 grid layout
  const chunkedLegendItems = legendItems.reduce(
    (result, item, index) => {
      const chunkIndex = Math.floor(index / 4); // Group into rows of 4
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
              <span className="text-[12px] font-normal leading-[14px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ChartBettorsAndBetsSummary: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  activeGameType,
}) => {
  
  // gameCategory
  //console.log('Active Game Category:', activeGameType)
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Determine chart number based on categoryFilter
  const chartMap: Record<string, string> = {
    "Total Bets and Bettors": "1",
    "Total Bets by Bet Type": "2",
    "Total Bets by Game Type": "3",
    "Total Bettors by Bet Type": "5",
    "Total Bettors by Game Type": "6",
    "Top Betting Region by Total Bets": "4",
    "Top Betting Region by Total Bettors": "4",
  };
  const urlParam = chartMap[categoryFilter];

  // Determine gameCategory number based on activeGameType
  const gameCategoryMap: Record<string, number> = {
    Dashboard: 0,
    "STL Pares": 1,
    "STL Swer2": 2,
    "STL Swer3": 3,
    "STL Swer4": 4,
  };
  const gameCategoryParam = gameCategoryMap[activeGameType];
  console.log('Game Category Param:', gameCategoryParam)

  // Add gameType parameter if activeGameType is valid (1-4)
  const getGameCategoryParam = () => {
    if (gameCategoryParam && gameCategoryParam >= 1 && gameCategoryParam <= 4) {
      return { gameCategory: gameCategoryParam };
    }
    return {};
  };

  // Helper function to check if dates match (ignoring time)
  const datesMatch = (dateString1: string, dateString2: string): boolean => {
    return formatDate(dateString1) === formatDate(dateString2);
  };

  // For Specific Date
  // Process Chart 1 Data - Bet and Bettors
  const processChart1Data = (
    payload: any,
    firstDate: string,
    secondDate: string
  ) => {
    const drawOrders = [1, 2, 3];

    // Normalize DrawOrder to always be an array
    const drawOrderData = Array.isArray(payload?.DrawOrder)
      ? payload.DrawOrder
      : payload?.DrawOrder
      ? [payload.DrawOrder]
      : [];

    return drawOrders.map((drawOrder) => {
      const allDrawItems = drawOrderData.filter(
        (item: chartOne_Specific) => item.DrawOrder === drawOrder
      );

      const firstDateItems = allDrawItems.filter((item: chartOne_Specific) =>
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allDrawItems.filter((item: chartOne_Specific) =>
        datesMatch(item.TransactionDate, secondDate)
      );

      return {
        drawOrder,
        firstDateBettors: firstDateItems.reduce(
          (sum: number, item: chartOne_Specific) => sum + item.TotalBettors,
          0
        ),
        secondDateBettors: secondDateItems.reduce(
          (sum: number, item: chartOne_Specific) => sum + item.TotalBettors,
          0
        ),
        firstDateBets: firstDateItems.reduce(
          (sum: number, item: chartOne_Specific) => sum + item.TotalBets,
          0
        ),
        secondDateBets: secondDateItems.reduce(
          (sum: number, item: chartOne_Specific) => sum + item.TotalBets,
          0
        ),
      };
    });
  };

  // Process Chart 2 Data
  const processChart2Data = (
    payload: any,
    firstDate: string,
    secondDate: string
  ) => {
    const drawOrders = [1, 2, 3];

    return drawOrders.map((drawOrder) => {
      const allDrawItems = payload.DrawOrder.filter(
        (item: any) => item.DrawOrder === drawOrder
      );

      const firstDateItems = allDrawItems.filter((item: any) =>
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allDrawItems.filter((item: any) =>
        datesMatch(item.TransactionDate, secondDate)
      );

      return {
        drawOrder,
        firstDateTumbok: firstDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        secondDateTumbok: secondDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        firstDateSahod: firstDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Sahod || 0),
          0
        ),
        secondDateSahod: secondDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Sahod || 0),
          0
        ),
      };
    });
  };

  // Process Chart 3 Data
  const processChart3Data = (
    payload: any,
    firstDate: string,
    secondDate: string
  ) => {
    const drawOrders = [1, 2, 3];
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return drawOrders.map((drawOrder) => {
      const result: any = { drawOrder };

      gameCategories.forEach((category) => {
        const allItems = payload.DrawOrder.filter(
          (item: any) =>
            item.DrawOrder === drawOrder && item.GameCategory === category
        );

        const firstDateItems = allItems.filter((item: any) =>
          datesMatch(item.TransactionDate, firstDate)
        );
        const secondDateItems = allItems.filter((item: any) =>
          datesMatch(item.TransactionDate, secondDate)
        );

        result[`firstDate${category.replace(/\s+/g, "")}`] =
          firstDateItems.reduce(
            (sum: number, item: any) => sum + item.TotalBets,
            0
          );
        result[`secondDate${category.replace(/\s+/g, "")}`] =
          secondDateItems.reduce(
            (sum: number, item: any) => sum + item.TotalBets,
            0
          );
      });

      return result;
    });
  };

  // Chart 5: Total Bettors by Bet Type
  const processChart5Data = (
    payload: any,
    firstDate: string,
    secondDate: string
  ) => {
    const drawOrders = [1, 2, 3];

    return drawOrders.map((drawOrder) => {
      const allDrawItems = payload.DrawOrder.filter(
        (item: any) => item.DrawOrder === drawOrder
      );

      const firstDateItems = allDrawItems.filter((item: any) =>
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allDrawItems.filter((item: any) =>
        datesMatch(item.TransactionDate, secondDate)
      );

      return {
        drawOrder,
        firstDateTumbok: firstDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        secondDateTumbok: secondDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        firstDateSahod: firstDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Sahod || 0),
          0
        ),
        secondDateSahod: secondDateItems.reduce(
          (sum: number, item: any) => sum + (item.BetTypes?.Sahod || 0),
          0
        ),
      };
    });
  };

  // Chart 6: Total Bettors by Game Type
  const processChart6Data = (
    payload: any,
    firstDate: string,
    secondDate: string
  ) => {
    const drawOrders = [1, 2, 3];
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return drawOrders.map((drawOrder) => {
      const result: any = { drawOrder };

      gameCategories.forEach((category) => {
        const allItems = payload.DrawOrder.filter(
          (item: any) =>
            item.DrawOrder === drawOrder && item.GameCategory === category
        );

        const firstDateItems = allItems.filter((item: any) =>
          datesMatch(item.TransactionDate, firstDate)
        );
        const secondDateItems = allItems.filter((item: any) =>
          datesMatch(item.TransactionDate, secondDate)
        );

        result[`firstDate${category.replace(/\s+/g, "")}`] =
          firstDateItems.reduce(
            (sum: number, item: any) => sum + item.TotalBettors,
            0
          );
        result[`secondDate${category.replace(/\s+/g, "")}`] =
          secondDateItems.reduce(
            (sum: number, item: any) => sum + item.TotalBettors,
            0
          );
      });

      return result;
    });
  };

  // Main processor function
  const processSpecificDatePayload = (
    urlParam: string,
    payload: any,
    firstDate: string,
    secondDate: string
  ) => {
    if (!payload || !payload.DrawOrder) {
      console.warn("Invalid payload structure", payload);
      return [];
    }

    switch (urlParam) {
      case "1":
        return processChart1Data(payload, firstDate, secondDate);
      case "2":
        return processChart2Data(payload, firstDate, secondDate);
      case "3":
        return processChart3Data(payload, firstDate, secondDate);
      case "5":
        return processChart5Data(payload, firstDate, secondDate);
      case "6":
        return processChart6Data(payload, firstDate, secondDate);
      default:
        console.warn("Unknown urlParam:", urlParam);
        return [];
    }
  };

  // For Date Duration
  // Helper functions for Date Duration payload processing
  const processDurationChart1Data = (payload: any) => {
    const drawOrders = [1, 2, 3];

    return drawOrders.map((drawOrder) => {
      const firstRangeItems = payload.DrawOrder.FirstRange.filter(
        (item: chartOne_Range) => item.DrawOrder === drawOrder
      );
      const secondRangeItems = payload.DrawOrder.SecondRange.filter(
        (item: chartOne_Range) => item.DrawOrder === drawOrder
      );

      return {
        drawOrder,
        firstRangeBettors: firstRangeItems.reduce(
          (sum: number, item: chartOne_Range) => sum + item.TotalBettors,
          0
        ),
        secondRangeBettors: secondRangeItems.reduce(
          (sum: number, item: chartOne_Range) => sum + item.TotalBettors,
          0
        ),
        firstRangeBets: firstRangeItems.reduce(
          (sum: number, item: chartOne_Range) => sum + item.TotalBets,
          0
        ),
        secondRangeBets: secondRangeItems.reduce(
          (sum: number, item: chartOne_Range) => sum + item.TotalBets,
          0
        ),
      };
    });
  };

  const processDurationChart2Data = (payload: any) => {
    const drawOrders = [1, 2, 3];

    return drawOrders.map((drawOrder) => {
      const firstRangeItems = payload.DrawOrder.FirstRange.filter(
        (item: chartTwoFive_Range) => item.DrawOrder === drawOrder
      );
      const secondRangeItems = payload.DrawOrder.SecondRange.filter(
        (item: chartTwoFive_Range) => item.DrawOrder === drawOrder
      );

      return {
        drawOrder,
        firstRangeTumbok: firstRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        secondRangeTumbok: secondRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        firstRangeSahod: firstRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Sahod || 0),
          0
        ),
        secondRangeSahod: secondRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Sahod || 0),
          0
        ),
      };
    });
  };

  const processDurationChart3Data = (payload: any) => {
    const drawOrders = [1, 2, 3];
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return drawOrders.map((drawOrder) => {
      const result: any = { drawOrder };

      gameCategories.forEach((category) => {
        const firstRangeItems = payload.DrawOrder.FirstRange.filter(
          (item: chartThreeSix_Range) =>
            item.DrawOrder === drawOrder && item.GameCategory === category
        );
        const secondRangeItems = payload.DrawOrder.SecondRange.filter(
          (item: chartThreeSix_Range) =>
            item.DrawOrder === drawOrder && item.GameCategory === category
        );

        result[`firstRange${category.replace(/\s+/g, "")}`] =
          firstRangeItems.reduce(
            (sum: number, item: chartThreeSix_Range) => sum + item.TotalBets,
            0
          );
        result[`secondRange${category.replace(/\s+/g, "")}`] =
          secondRangeItems.reduce(
            (sum: number, item: chartThreeSix_Range) => sum + item.TotalBets,
            0
          );
      });

      return result;
    });
  };

  const processDurationChart5Data = (payload: any) => {
    const drawOrders = [1, 2, 3];

    return drawOrders.map((drawOrder) => {
      const firstRangeItems = payload.DrawOrder.FirstRange.filter(
        (item: chartTwoFive_Range) => item.DrawOrder === drawOrder
      );
      const secondRangeItems = payload.DrawOrder.SecondRange.filter(
        (item: chartTwoFive_Range) => item.DrawOrder === drawOrder
      );

      return {
        drawOrder,
        firstRangeTumbok: firstRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        secondRangeTumbok: secondRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Tumbok || 0),
          0
        ),
        firstRangeSahod: firstRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Sahod || 0),
          0
        ),
        secondRangeSahod: secondRangeItems.reduce(
          (sum: number, item: chartTwoFive_Range) =>
            sum + (item.BetTypes?.Sahod || 0),
          0
        ),
      };
    });
  };

  const processDurationChart6Data = (payload: any) => {
    const drawOrders = [1, 2, 3];
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return drawOrders.map((drawOrder) => {
      const result: any = { drawOrder };

      gameCategories.forEach((category) => {
        const firstRangeItems = payload.DrawOrder.FirstRange.filter(
          (item: chartThreeSix_Range) =>
            item.DrawOrder === drawOrder && item.GameCategory === category
        );
        const secondRangeItems = payload.DrawOrder.SecondRange.filter(
          (item: chartThreeSix_Range) =>
            item.DrawOrder === drawOrder && item.GameCategory === category
        );

        result[`firstRange${category.replace(/\s+/g, "")}`] =
          firstRangeItems.reduce(
            (sum: number, item: chartThreeSix_Range) => sum + item.TotalBettors,
            0
          );
        result[`secondRange${category.replace(/\s+/g, "")}`] =
          secondRangeItems.reduce(
            (sum: number, item: chartThreeSix_Range) => sum + item.TotalBettors,
            0
          );
      });

      return result;
    });
  };

  // Main processor for Date Duration
  const processDurationPayload = (urlParam: string, payload: any) => {
    if (
      !payload ||
      !payload.DrawOrder ||
      !payload.DrawOrder.FirstRange ||
      !payload.DrawOrder.SecondRange
    ) {
      console.warn("Invalid duration payload structure", payload);
      return [];
    }

    switch (urlParam) {
      case "1":
        return processDurationChart1Data(payload);
      case "2":
        return processDurationChart2Data(payload);
      case "3":
        return processDurationChart3Data(payload);
      case "5":
        return processDurationChart5Data(payload);
      case "6":
        return processDurationChart6Data(payload);
      default:
        console.warn("Unknown urlParam:", urlParam);
        return [];
    }
  };

  // Date Payload Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();

      if (dateFilter === "Specific Date" && firstDateSpecific && secondDateSpecific) {
        console.log(
          "Fetching for Specific Date:",
          formatDate(firstDateSpecific),
          formatDate(secondDateSpecific)
        );

        const resp = await fetchCompareHistoricalDate(
          "/transactions/compareHistoricalDate/chartType/",
          urlParam,
          {
            first: formatDate(firstDateSpecific),
            second: formatDate(secondDateSpecific),
            ...gameCategoryParam,
          }
        );
        //console.log('GAME CATEG', gameCategoryParam);
        //console.log("Response payload:", resp);

        // Use resp.data to get the actual payload
        if (resp?.data?.DrawOrder) {
          const processedData = processSpecificDatePayload(
            urlParam,
            resp.data,
            firstDateSpecific,
            secondDateSpecific
          );
          //console.log("Processed Data:", processedData);
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload for Specific Date:", resp);
          setChartData([]);  // clear data on bad response
        }
      } else if (
        dateFilter === "Date Duration" &&
        firstDateSpecific &&
        secondDateSpecific &&
        firstDateDuration &&
        secondDateDuration
      ) {
        const resp = await fetchCompareHistoricalRange(
          "/transactions/compareHistoricalRange/chartType/",
          urlParam,
          {
            firstStart: formatDate(firstDateSpecific),
            firstEnd: formatDate(secondDateSpecific),
            secondStart: formatDate(firstDateDuration),
            secondEnd: formatDate(secondDateDuration),
            ...gameCategoryParam,
          }
        );
        //console.log("Response payload:", resp);

        if (resp?.data?.DrawOrder) {
          const processedData = processSpecificDatePayload(
            urlParam,
            resp.data,
            firstDateSpecific,
            secondDateSpecific
          );
          //console.log("Processed Data:", processedData);
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload for Date Duration:", resp);
          setChartData([]);
        }
      } else {
        console.log("No matching condition for fetching data.");
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setChartData([]);
    } finally {
      setLoading(false);
      console.log("fetchData finished, loading set to false");
    }
  }, [
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    urlParam,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateSeries = (chartData: ChartData[], urlParam: string) => {
    const isDuration = dateFilter === "Date Duration";

    // Labels for the legend
    const firstLabel = isDuration
      ? `${formatDate(firstDateSpecific)} - ${formatDate(secondDateSpecific)}`
      : formatDate(firstDateSpecific);

    const secondLabel = isDuration
      ? `${formatDate(firstDateDuration)} - ${formatDate(secondDateDuration)}`
      : formatDate(secondDateSpecific);

    if (urlParam === "1") {
      return [
        {
          data: chartData.map((item: any) =>
            isDuration ? item.firstRangeBettors : item.firstDateBettors
          ),
          label: `Bettors ${firstLabel}`,
          color: "#E5C7FF",
        },
        {
          data: chartData.map((item: any) =>
            isDuration ? item.secondRangeBettors : item.secondDateBettors
          ),
          label: `Bettors ${secondLabel}`,
          color: "#5050A5",
        },
        {
          data: chartData.map((item: any) =>
            isDuration ? item.firstRangeBets : item.firstDateBets
          ),
          label: `Bets ${firstLabel}`,
          color: "#7266C9",
        },
        {
          data: chartData.map((item: any) =>
            isDuration ? item.secondRangeBets : item.secondDateBets
          ),
          label: `Bets ${secondLabel}`,
          color: "#3B3B81",
        },
      ];
    } else if (urlParam === "2" || urlParam === "5") {
      return [
        {
          data: chartData.map((item: any) =>
            isDuration ? item.firstRangeTumbok : item.firstDateTumbok
          ),
          label: `Tumbok ${firstLabel}`,
          color: "#E5C7FF",
        },
        {
          data: chartData.map((item: any) =>
            isDuration ? item.secondRangeTumbok : item.secondDateTumbok
          ),
          label: `Tumbok ${secondLabel}`,
          color: "#5050A5",
        },
        {
          data: chartData.map((item: any) =>
            isDuration ? item.firstRangeSahod : item.firstDateSahod
          ),
          label: `Sahod ${firstLabel}`,
          color: "#7266C9",
        },
        {
          data: chartData.map((item: any) =>
            isDuration ? item.secondRangeSahod : item.secondDateSahod
          ),
          label: `Sahod ${secondLabel}`,
          color: "#3B3B81",
        },
      ];
    } else if (urlParam === "3" || urlParam === "6") {
      const gameCategories = ["STLPares", "STLSwer2", "STLSwer3", "STLSwer4"];
      return gameCategories.flatMap((category) => [
        {
          data: chartData.map((item: any) =>
            isDuration
              ? item[`firstRange${category}`]
              : item[`firstDate${category}`]
          ),
          label: `${category.replace("STL", "STL ")} ${firstLabel}`,
          color: getCategoryColor(category, true),
        },
        {
          data: chartData.map((item: any) =>
            isDuration
              ? item[`secondRange${category}`]
              : item[`secondDate${category}`]
          ),
          label: `${category.replace("STL", "STL ")} ${secondLabel}`,
          color: getCategoryColor(category, false),
        },
      ]);
    }
    return [];
  };

  // Helper function for category colors
  const getCategoryColor = (category: string, isFirstDate: boolean) => {
    const colorMap: Record<string, string> = {
      STLPares: isFirstDate ? "#E5C7FF" : "#5050A5",
      STLSwer2: isFirstDate ? "#7266C9" : "#3B3B81",
      STLSwer3: isFirstDate ? "#875AC4" : "#6F58C9",
      STLSwer4: isFirstDate ? "#563D99" : "#3E2466",
    };
    return colorMap[category] || "#CCCCCC";
  };

  return (
    <div className="bg-transparent p-4 rounded-lg pb-8 w-full h-[511px] border border-[#7266C9]">
      <p className="text-[16px] font-normal leading-[18px] mb-[10px]">
        {`Summary ${categoryFilter}`}
      </p>
      <CustomLegend
        activeGameType={activeGameType}
        categoryFilter={categoryFilter}
        dateFilter={dateFilter}
        firstDateSpecific={firstDateSpecific}
        secondDateSpecific={secondDateSpecific}
        firstDateDuration={firstDateDuration}
        secondDateDuration={secondDateDuration}
      />

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="h-full flex flex-col flex-grow">
          <BarChart
            height={350}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            series={generateSeries(chartData, urlParam)}
            yAxis={[
              { scaleType: "band", 
                data: ["First Draw", "Second Draw", "Third Draw"],
              },
            ]}
            xAxis={[
              { label: "Amount (in 100,000 units)",
                min: 0,
                //max: 10,
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
          />
        </div>
      )}
    </div>
  );
}

export default ChartBettorsAndBetsSummary;