import { formatDate } from "./utils";
import { GAME_CATEGORIES } from "./constant";

export interface chartOne_Specific {
  TransactionDate: string;
  DrawOrder: number;
  Region: null;
  GameCategory: null;
  TotalBets: number;
  TotalBetAmount: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
}

export interface chartOne_Range {
  DrawOrder: number;
  Region: null;
  GameCategory: null;
  TotalBets: number;
  TotalBetAmount: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  DateRange: { start: string; end: string };
}

export interface chartTwoFive_Range {
  DrawOrder: number;
  Region: null;
  GameCategory: null;
  TotalBets: number;
  TotalBetAmount: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  DateRange: { start: string; end: string };
  BetTypes: { Tumbok: number; Sahod: number; Ramble: number };
}

export interface chartThreeSix_Range {
  DrawOrder: number;
  Region: null;
  GameCategory: string;
  TotalBets: number;
  TotalBetAmount: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  DateRange: { start: string; end: string };
}

export interface Chart1Data {
  // Specific Date
  firstDateBettors?: number;
  secondDateBettors?: number;
  firstDateBets?: number;
  secondDateBets?: number;
  // Date Duration
  firstRangeBettors?: number;
  secondRangeBettors?: number;
  firstRangeBetAmount?: number;
  secondRangeBetAmount?: number;
  firstRangeBets?: number;
  secondRangeBets?: number;
}

export interface Chart25Data {
  // Specific Date
  firstDateTumbok?: number;
  secondDateTumbok?: number;
  firstDateSahod?: number;
  secondDateSahod?: number;
  // Date Duration
  firstRangeTumbok?: number;
  secondRangeTumbok?: number;
  firstRangeSahod?: number;
  secondRangeSahod?: number;
}

export interface Chart36Data {
  // Specific Date
  firstDateSTLPares?: number;
  secondDateSTLPares?: number;
  firstDateSTLSwer2?: number;
  secondDateSTLSwer2?: number;
  firstDateSTLSwer3?: number;
  secondDateSTLSwer3?: number;
  firstDateSTLSwer4?: number;
  secondDateSTLSwer4?: number;
  // Date Duration
  firstRangeSTLPares?: number;
  secondRangeSTLPares?: number;
  firstRangeSTLSwer2?: number;
  secondRangeSTLSwer2?: number;
  firstRangeSTLSwer3?: number;
  secondRangeSTLSwer3?: number;
  firstRangeSTLSwer4?: number;
  secondRangeSTLSwer4?: number;
}

export type ChartData = Chart1Data | Chart25Data | Chart36Data;

export interface RegionSpecificData {
  TransactionDate: string;
  DrawOrder?: null;
  Region: string;
  GameCategory?: string | null;
  TotalBets: number;
  TotalBetAmount: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  BetTypes?: {
    Tumbok: number;
    Sahod: number;
    Ramble: number;
  };
}

export interface RegionRangeData {
  Region: string;
  TotalBets: number;
  TotalBetAmount: number;
  TotalBettors: number;
  TotalTumbok?: number;
  TotalSahod?: number;
  TotalRamble?: number;
  BetTypes?: {
    Tumbok: number;
    Sahod: number;
    Ramble: number;
  };
  GameCategory?: string | null;
  DateOfWinningCombination: string;
}

export interface RangePayload {
  Region: {
    FirstRange: RegionRangeData[];
    SecondRange: RegionRangeData[];
  };
}

export interface BettorsandBetsSummaryProps {
  gameCategoryId?: number;
  categoryFilter: string;
  dateFilter: string;
  firstDateSpecific: string | null;
  secondDateSpecific: string | null;
  firstDateDuration: string | null;
  secondDateDuration: string | null;
  secondDurationFrom: string | null; 
  secondDurationTo: string | null;   
}

export const getLegendItemsMap_Specific = (
  categoryFilter: string,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null
): { label: string; color: string }[] => {
  const firstLabel = formatDate(firstDateSpecific);
  const secondLabel = formatDate(secondDateSpecific);

  switch (categoryFilter) {
    case "Total Bettors and Bets":
      return [
        { label: `Bettors ${firstLabel}`, color: "#E5C7FF" },
        { label: `Bettors ${secondLabel}`, color: "#5050A5" },
        { label: `Bets ${firstLabel}`, color: "#7266C9" },
        { label: `Bets ${secondLabel}`, color: "#3B3B81" },
      ];
    case "Total Bets by Bet Type":
    case "Total Bettors by Bet Type":
      return [
        { label: `Tumbok ${firstLabel}`, color: "#E5C7FF" },
        { label: `Tumbok ${secondLabel}`, color: "#5050A5" },
        { label: `Sahod ${firstLabel}`, color: "#7266C9" },
        { label: `Sahod ${secondLabel}`, color: "#3B3B81" },
      ];
    case "Total Bets by Game Type":
    case "Total Bettors by Game Type":
      return GAME_CATEGORIES.flatMap((category) => [
        {
          label: `${category.replace("STL", "STL ")} ${firstLabel}`,
          color: getCategoryColor(category.replace(/\s+/g, ""), true),
        },
        {
          label: `${category.replace("STL", "STL ")} ${secondLabel}`,
          color: getCategoryColor(category.replace(/\s+/g, ""), false),
        },
      ]);
    default:
      return [];
  }
};

export const getLegendItemsMap_Duration = (
  categoryFilter: string,
  firstDateDuration: string | null,
  secondDateDuration: string | null,
  secondDurationFrom: string | null,
  secondDurationTo: string | null
): { label: string; color: string }[] => {
  const firstLabel = `${formatDate(firstDateDuration)} - ${formatDate(secondDateDuration)}`;
  const secondLabel = `${formatDate(secondDurationFrom)} - ${formatDate(secondDurationTo)}`;

  switch (categoryFilter) {
    case "Total Bettors and Bets":
      return [
        { label: `Bettors ${firstLabel}`, color: "#E5C7FF" },
        { label: `Bettors ${secondLabel}`, color: "#5050A5" },
        { label: `Bets ${firstLabel}`, color: "#7266C9" },
        { label: `Bets ${secondLabel}`, color: "#3B3B81" },
      ];
    case "Total Bets by Bet Type":
    case "Total Bettors by Bet Type":
      return [
        { label: `Tumbok ${firstLabel}`, color: "#E5C7FF" },
        { label: `Tumbok ${secondLabel}`, color: "#5050A5" },
        { label: `Sahod ${firstLabel}`, color: "#7266C9" },
        { label: `Sahod ${secondLabel}`, color: "#3B3B81" },
      ];
    case "Total Bets by Game Type":
    case "Total Bettors by Game Type":
      return GAME_CATEGORIES.flatMap((category) => [
        {
          label: `${category.replace("STL", "STL ")} ${firstLabel}`,
          color: getCategoryColor(category.replace(/\s+/g, ""), true),
        },
        {
          label: `${category.replace("STL", "STL ")} ${secondLabel}`,
          color: getCategoryColor(category.replace(/\s+/g, ""), false),
        },
      ]);
    default:
      return [];
  }
};

// Helper function to get category colors
export const getCategoryColor = (
  category: string,
  isFirstDate: boolean
): string => {
  const colorMap: Record<string, string> = {
    STLPares: isFirstDate ? "#E5C7FF" : "#5050A5",
    STLSwer2: isFirstDate ? "#7266C9" : "#3B3B81",
    STLSwer3: isFirstDate ? "#875AC4" : "#6F58C9",
    STLSwer4: isFirstDate ? "#563D99" : "#3E2466",
  };
  return colorMap[category] || "#CCCCCC";
};