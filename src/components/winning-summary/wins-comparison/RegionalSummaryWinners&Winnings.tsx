import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Typography,
  Stack,
  CircularProgress
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { 
  WinnersandWinningsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
} from "../../../store/useWinningStore";

// Api Endpoints
import getCompareHistoricalWinners from "~/utils/api/winners/get.CompareHistoricalWinners.service";
import getCompareHistoricalWinnersRange from "~/utils/api/winners/get.CompareHistoricalWinnersRange.service";

type Chart1Data = {
  // Specific Date
  firstDateWinners?: number;
  secondDateWinners?: number;
  firstDateWinnings?: number;
  secondDateWinnings?: number;
  // Date Duration
  firstRangeWinners?: number;
  secondRangeWinners?: number;
  firstRangeWinnings?: number;
  secondRangeWinnings?: number;
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
  firstRangeWinningsSahod?: number;
  secondRangeWinningsSahod?: number;
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

interface RegionSpecificData {
  DateOfWinningCombination: string;
  Region: string;
  GameCategory?: string;
  WinType?: string;
  TotalWinners: number;
  TotalPayoutAmount: number;
  TotalTumbokWinners: number;
  TotalSahodWinners: number;
  TotalRambleWinners: number;
  TotalTumbokPayouts: number;
  TotalSahodPayouts: number;
  TotalRamblePayouts: number;
  BetTypes?: {
    Tumbok: number;
    Sahod: number;
    Ramble: number;
  }
}
interface RegionRangeData {
  RegionName: string;
  DateOfWinningCombination: string;
  DrawOrder?: null;
  Region: string;
  GameCategory?: string;
  WinType?: null;
  TotalWinners: number;
  TotalPayoutAmount: number;
  TotalTumbokWinners: number;
  TotalSahodWinners: number;
  TotalRambleWinners: number;
  TotalTumbokPayouts: number;
  TotalSahodPayouts: number;
  TotalRamblePayouts: number;
  BetTypes?: {
    Tumbok: number;
    Sahod: number;
    Ramble: number;
  }
}
interface RangePayload {
    Region: {
    FirstRange: RegionRangeData[];
    SecondRange: RegionRangeData[];
  }
}
const formatDate = (date: string | null): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CustomLegend: React.FC<WinnersandWinningsSummaryProps> = ({
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
      ? getLegendItemsMap_Specific(categoryFilter, firstDateSpecific, secondDateSpecific)
      : getLegendItemsMap_Duration(categoryFilter, firstDateSpecific, secondDateSpecific, firstDateDuration, secondDateDuration);

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
    <Stack direction="column" spacing={1} sx={{ mt: 0.5, mr: 4 }}>
      {chunkedLegendItems.map((chunk, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2} justifyContent="left">
          {chunk.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  mr: 1.5,
                }}
              />
              <Typography
                color="#212121"
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "14px",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

const ChartWinnersandWinningsRegionalSummary: React.FC<WinnersandWinningsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  activeGameType
}) => {
console.log('Active Game Category:', activeGameType);
const [loading, setLoading] = useState(false)
const [chartData, setChartData] = useState<ChartData[]>([])
const philippineRegions = [
  "NCR", "CAR", "I", "II", "III", "IV-A", "IV-B",
  "V", "VI", "VII", "VIII", "IX", "X", "XI",
  "XII", "XIII", "BARMM"
];

// Determine chart number based on categoryFilter
const chartMap: Record<string, string> = {
  "Total Winnings and Winners": "1",
  "Total Winnings by Bet Type": "2",
  "Total Winnings by Game Type": "3",
  "Total Winners by Bet Type": "5",
  "Total Winners by Game Type": "6",
  "Top Winning Region by Total Winning": "4",
  "Top Winning Region by Total Winners": "4",
};
const urlParam = chartMap[categoryFilter];
// Determine gameCategory number based on activeGameType

const gameCategoryMap: Record<string, number> = {
  "Dashboard": 0,
  "STL Pares": 1,
  "STL Swer2": 2,
  "STL Swer3": 3,
  "STL Swer4": 4,
}
const gameTypeParam = gameCategoryMap[activeGameType];
console.log('Game Category Param:', gameTypeParam)

// Add gameType parameter if activeGameType is valid (1-4)
const getGameCategoryParam = () => {
  if(gameTypeParam && gameTypeParam >=1 && gameTypeParam <= 4) {
    return { gameTypeParam: gameTypeParam };
  }
  return {};
}

// Helper function to check if dates match (ignoring time)
const datesMatch = (dateString1: string, dateString2: string): boolean => {
  return formatDate(dateString1) === formatDate(dateString2);
}

  // For Specific Date
  // Process Chart 1 Data
  const processChart1Data = (
    payload: { Region: Array<RegionSpecificData[]> },
    firstDate: string,
    secondDate: string
  ) => {
    return philippineRegions.map(region => {
      const allRegionItems = payload.Region.flat().filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );

      const firstDateItems = allRegionItems.filter(item => 
        datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondDateItems = allRegionItems.filter(item => 
        datesMatch(item.DateOfWinningCombination, secondDate)
      );

      return {
        region,
        firstDateWinners: firstDateItems.reduce((sum, item) => sum + item.TotalWinners, 0), 
        secondDateWinners: secondDateItems.reduce((sum, item) => sum + item.TotalWinners, 0),
        firstDateWinnings: firstDateItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0),
        secondDateWinnings: secondDateItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0)
      };
    });
  };
  const processChart2Data = (
    payload: { Region: Array<RegionSpecificData[]> },
    firstDate: string,
    secondDate: string
  ) => {
    return philippineRegions.map(region => {
      const allRegionItems = payload.Region.flat().filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );

      const firstDateItems = allRegionItems.filter(item => 
        datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondDateItems = allRegionItems.filter(item => 
        datesMatch(item.DateOfWinningCombination, secondDate)
      );

      return {
        region,
        firstDateTumbok: firstDateItems.reduce((sum, item) => sum + (item.BetTypes?.Tumbok || 0), 0),
        secondDateTumbok: secondDateItems.reduce((sum, item) => sum + (item.BetTypes?.Tumbok || 0), 0),
        firstDateSahod: firstDateItems.reduce((sum, item) => sum + (item.BetTypes?.Sahod || 0), 0),
        secondDateSahod: secondDateItems.reduce((sum, item) => sum + (item.BetTypes?.Sahod || 0), 0)
      };
    });
  };
  const processChart3Data = (
    payload: { Region: Array<RegionSpecificData[]> },
    firstDate: string,
    secondDate: string
  ) => {
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return philippineRegions.map(region => {
      const result: any = { region };
      
      gameCategories.forEach(category => {
        const allItems = payload.Region.flat().filter(
          item => (item.Region === region || item.Region === `Region ${region}`) && 
                  item.GameCategory === category
        );
        
        const firstDateItems = allItems.filter(item => 
          datesMatch(item.DateOfWinningCombination, firstDate)
        );
        const secondDateItems = allItems.filter(item => 
          datesMatch(item.DateOfWinningCombination, secondDate)
        );

        result[`firstDate${category.replace(/\s+/g, '')}`] = 
          firstDateItems.reduce((sum, item) => sum + item.TotalTumbokPayouts, 0);
        result[`secondDate${category.replace(/\s+/g, '')}`] = 
          secondDateItems.reduce((sum, item) => sum + item.TotalSahodPayouts, 0);
      });

      return result;
    });
  };
  const processChart5Data = (
    payload: { Region: Array<RegionSpecificData[]> },
    firstDate: string,
    secondDate: string
  ) => {
    return philippineRegions.map(region => {
      const allRegionItems = payload.Region.flat().filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );

      const firstDateItems = allRegionItems.filter(item => 
        datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondDateItems = allRegionItems.filter(item => 
        datesMatch(item.DateOfWinningCombination, secondDate)
      );

      return {
        region,
        firstDateTumbok:   firstDateItems.reduce((sum, item) => sum + (item.BetTypes?.Tumbok || 0), 0),
        secondDateTumbok: secondDateItems.reduce((sum, item) => sum + (item.BetTypes?.Tumbok || 0), 0),
        firstDateSahod: firstDateItems.reduce((sum, item) => sum + (item.BetTypes?.Sahod || 0), 0),
        secondDateSahod: secondDateItems.reduce((sum, item) => sum + (item.BetTypes?.Sahod || 0), 0)
      };
    });
  };
  const processChart6Data = (
    payload: { Region: Array<RegionSpecificData[]> },
    firstDate: string,
    secondDate: string
  ) => {
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return philippineRegions.map(region => {
      const result: any = { region };
      
      gameCategories.forEach(category => {
        const allItems = payload.Region.flat().filter(
          item => (item.Region === region || item.Region === `Region ${region}`) && 
                  item.GameCategory === category
        );
        
        const firstDateItems = allItems.filter(item => 
          datesMatch(item.DateOfWinningCombination, firstDate)
        );
        const secondDateItems = allItems.filter(item => 
          datesMatch(item.DateOfWinningCombination, secondDate)
        );

        result[`firstDate${category.replace(/\s+/g, '')}`] = 
          firstDateItems.reduce((sum, item) => sum + item.TotalTumbokWinners, 0);
        result[`secondDate${category.replace(/\s+/g, '')}`] = 
          secondDateItems.reduce((sum, item) => sum + item.TotalSahodWinners, 0);
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
    if (!payload || !payload.Region) {
      console.warn("Invalid payload structure", payload);
      return [];
    }

    switch (urlParam) {
      case "1": return processChart1Data(payload, firstDate, secondDate);
      case "2": return processChart2Data(payload, firstDate, secondDate);
      case "3": return processChart3Data(payload, firstDate, secondDate);
      case "5": return processChart5Data(payload, firstDate, secondDate);
      case "6": return processChart6Data(payload, firstDate, secondDate);
      default:
        console.warn("Unknown urlParam:", urlParam);
        return [];
    }
  };


  // For Date Duration Date.
    //  For Date Duration Date.
  const processDurationChart1Data = (
    payload: RangePayload
  ) => {
    return philippineRegions.map(region => {
      const firstRangeItems = payload.Region.FirstRange.filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );
      const secondRangeItems = payload.Region.SecondRange.filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );

      return {
        region,
        firstRangeWinners: firstRangeItems.reduce((sum, item) => sum + item.TotalWinners, 0),
        secondRangeWinners: secondRangeItems.reduce((sum, item) => sum + item.TotalWinners, 0),
        firstRangeWinnings: firstRangeItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0),
        secondRangeWinnings: secondRangeItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0)
      };
    });
  };
  const processDurationChart2Data = (
    payload: RangePayload
  ) => {
    return philippineRegions.map(region => {
      const firstRangeItems = payload.Region.FirstRange.filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );
      const secondRangeItems = payload.Region.SecondRange.filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );

      return {
        region,
        firstRangeTumbok: firstRangeItems.reduce((sum, item) => sum + (item.BetTypes?.Tumbok || 0), 0),
        secondRangeTumbok: secondRangeItems.reduce((sum, item) => sum + (item.BetTypes?.Tumbok || 0), 0),
        firstRangeSahod: firstRangeItems.reduce((sum, item) => sum + (item.BetTypes?.Sahod || 0), 0),
        secondRangeSahod: secondRangeItems.reduce((sum, item) => sum + (item.BetTypes?.Sahod || 0), 0)
      };
    });
  };
  const processDurationChart3Data = (
    payload: RangePayload
  ) => {
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return philippineRegions.map(region => {
      const result: any = { region };
      
      gameCategories.forEach(category => {
        const firstRangeItems = payload.Region.FirstRange.filter(
          item => (item.Region === region || item.Region === `Region ${region}`) && 
                  item.GameCategory === category
        );
        const secondRangeItems = payload.Region.SecondRange.filter(
          item => (item.Region === region || item.Region === `Region ${region}`) && 
                  item.GameCategory === category
        );

        result[`firstRange${category.replace(/\s+/g, '')}`] = 
          firstRangeItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0);
        result[`secondRange${category.replace(/\s+/g, '')}`] = 
          secondRangeItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0);
      });

      return result;
    });
  };
  const processDurationChart5Data = (
    payload: RangePayload
  ) => {
    return philippineRegions.map(region => {
      const firstRangeItems = payload.Region.FirstRange.filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );
      const secondRangeItems = payload.Region.SecondRange.filter(
        item => item.Region === region || item.Region === `Region ${region}`
      );

      return {
        region,
        firstRangeTumbok: firstRangeItems.reduce((sum, item) => sum + (item.TotalTumbokWinners || 0), 0),
        secondRangeTumbok: secondRangeItems.reduce((sum, item) => sum + (item.TotalTumbokWinners || 0), 0),
        firstRangeSahod: firstRangeItems.reduce((sum, item) => sum + (item.TotalSahodWinners || 0), 0),
        secondRangeSahod: secondRangeItems.reduce((sum, item) => sum + (item.TotalSahodWinners || 0), 0)
      };
    });
  };
  const processDurationChart6Data = (
    payload: RangePayload
  ) => {
    const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

    return philippineRegions.map(region => {
      const result: any = { region };
      
      gameCategories.forEach(category => {
        const firstRangeItems = payload.Region.FirstRange.filter(
          item => (item.Region === region || item.Region === `Region ${region}`) && 
                  item.GameCategory === category
        );
        const secondRangeItems = payload.Region.SecondRange.filter(
          item => (item.Region === region || item.Region === `Region ${region}`) && 
                  item.GameCategory === category
        );

        result[`firstRange${category.replace(/\s+/g, '')}`] = 
          firstRangeItems.reduce((sum, item) => sum + item.TotalWinners, 0);
        result[`secondRange${category.replace(/\s+/g, '')}`] = 
          secondRangeItems.reduce((sum, item) => sum + item.TotalWinners, 0);
      });

      return result;
    });
  };
    // Main processor for Date Duration
  const processDurationPayload = (
    urlParam: string,
    payload: any
  ) => {
    if (!payload || !payload.Region || !payload.Region.FirstRange || !payload.Region.SecondRange) {
      console.warn("Invalid duration payload structure", payload);
      return [];
    }

    switch (urlParam) {
      case "1": return processDurationChart1Data(payload);
      case "2": return processDurationChart2Data(payload);
      case "3": return processDurationChart3Data(payload);
      case "5": return processDurationChart5Data(payload);
      case "6": return processDurationChart6Data(payload);
      default:
        console.warn("Unknown urlParam:", urlParam);
        return [];
    }
  };

    const fetchData = useCallback(async () => {
    setLoading(true);
      try {
          const gameTypeParam = getGameCategoryParam();
          if (
            dateFilter === "Specific Date" && firstDateSpecific && secondDateSpecific
          ) {
              console.log("Fetching Date by Specific Date:", formatDate(firstDateSpecific), formatDate(secondDateSpecific));

              const resp = await getCompareHistoricalWinners(
                "/winners/compareHistoricalWinners/chartType/",
                urlParam,
                { 
                  first: formatDate(firstDateSpecific), 
                  second: formatDate(secondDateSpecific),
                  ...gameTypeParam
                }
              );
              console.log("Payload (Specific Date)", resp)

              if (resp && resp.Region) {
                const processedData = processSpecificDatePayload(
                  urlParam,
                  resp,
                  firstDateSpecific,
                  secondDateSpecific
                );
                console.log("Processed Data:", processedData);
                setChartData(processedData);
              }else {
                console.warn("Unexpexted payload:", resp);
              }
          }
          else if (
            dateFilter === "Date Duration" &&
            firstDateSpecific && secondDateSpecific &&
            firstDateDuration && secondDateDuration
          ){
              console.log("Fetching Date by Date Duration");

              const resp = await getCompareHistoricalWinnersRange(
              "/winners/compareHistoricalWinnersRange/chartType/",
              urlParam,
              {
                firstStart: formatDate(firstDateSpecific),
                firstEnd: formatDate(secondDateSpecific),
                secondStart: formatDate(firstDateDuration),
                secondEnd: formatDate(secondDateDuration),
                ...gameTypeParam
              }
            );
            console.log("Payload (Date Duration)", resp)

            if (resp && resp.Region) {
              const processedData = processDurationPayload(urlParam, resp);
              setChartData(processedData);
              console.log("Processed Data:", processedData);
              setChartData(processedData);
            } else {
              console.warn("Unexpected payload:", resp);
            }
          }
        } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
  }, [
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    urlParam,
    gameTypeParam,
    ]
  )

  useEffect(()=> {
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
            isDuration ? item.firstRangeWinners : item.firstDateWinners
          ),
          label: `Winners ${firstLabel}`,
          color: "#E5C7FF",
        },
        {
          data: chartData.map((item: any) => 
            isDuration ? item.secondRangeWinners : item.secondDateWinners
          ),
          label: `Winners ${secondLabel}`,
          color: "#D2A7FF",
        },
        {
          data: chartData.map((item: any) => 
            isDuration ? item.firstRangeWinners : item.firstDateWinners
          ),
          label: `Winnings ${firstLabel}`,
          color: "#BB86FC",
        },
        {
          data: chartData.map((item: any) => 
            isDuration ? item.secondRangeBets : item.secondDateBets
          ),
          label: `Winnings ${secondLabel}`,
          color: "#A06FE6",
        }
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
          color: "#D2A7FF",
        },
        {
          data: chartData.map((item: any) => 
            isDuration ? item.firstRangeSahod : item.firstDateSahod
          ),
          label: `Sahod ${firstLabel}`,
          color: "#BB86FC",
        },
        {
          data: chartData.map((item: any) => 
            isDuration ? item.secondRangeSahod : item.secondDateSahod
          ),
          label: `Sahod ${secondLabel}`,
          color: "#A06FE6",
        }
      ];
    } else if (urlParam === "3" || urlParam === "6") {
      const gameCategories = ["STLPares", "STLSwer2", "STLSwer3", "STLSwer4"];
      return gameCategories.flatMap(category => [
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
        }
      ]);
    }
    return [];
  };

  // Helper function for category colors
  const getCategoryColor = (category: string, isFirstDate: boolean) => {
    const colorMap: Record<string, string> = {
      STLPares: isFirstDate ? "#E5C7FF" : "#D2A7FF",
      STLSwer2: isFirstDate ? "#BB86FC" : "#A06FE6",
      STLSwer3: isFirstDate ? "#875AC4" : "#6F58C9",
      STLSwer4: isFirstDate ? "#563D99" : "#3E2466"
    };
    return colorMap[category] || "#CCCCCC";
  };

return (
    <Box
    sx={{
        backgroundColor: "#F8F0E3",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        height: "610px",
        border: "1px solid #0038A8",
    }}
    >
        <Typography color="#212121" 
        sx={{ 
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            mb: "10px"
        }}>
            { `Regional Summary of ${categoryFilter}`}
        </Typography>
        <CustomLegend 
          activeGameType={activeGameType}
          categoryFilter={categoryFilter}
          dateFilter={dateFilter}
          firstDateSpecific={firstDateSpecific}
          secondDateSpecific={secondDateSpecific}
          firstDateDuration={firstDateDuration}
          secondDateDuration={secondDateDuration}
        />
        <Box
            sx={{
            height: "100%",
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            backgroundColor: "#F8F0E3"
        }}
        >
        { loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh"
            >
              <CircularProgress />
            </Box>
        ): (
            <BarChart
            height={440} 
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            slotProps={{ legend: { hidden: true } }}
            xAxis={[
              {
                scaleType: "band",
                data: philippineRegions, // Ensure this matches the number of data points
              },
            ]}
            yAxis={[
              {
                label: "Amount (in 100,000 units)",
                min: 0,
                max: 100, // Adjust max to fit your data range
                // tickValues: yAxisTicks, // Ensure all ticks are displayed
                // tickSpacing: 5, // Optional: Adjust spacing between ticks
              },
            ]}
            series={generateSeries(chartData, urlParam)}
            // Optional: Increase width for better x-axis spacing
          />
        )}
        </Box>
        </Box>
  )
}
export default ChartWinnersandWinningsRegionalSummary;