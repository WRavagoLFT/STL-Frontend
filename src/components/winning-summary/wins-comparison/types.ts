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
  TotalSaisCasas: number;
  TotalTresCasas: number;
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

export type Chart1Data = {
  firstDateWinners?: number;
  secondDateWinners?: number;
  firstDateWinnings?: number;
  secondDateWinnings?: number;
  firstRangeWinners?: number;
  secondRangeWinners?: number;
  firstRangeWinnings?: number;
  secondRangeWinnings?: number;
};

export type Chart25Data = {
  firstDateTumbok?: number;
  secondDateTumbok?: number;
  firstDateSahod?: number;
  secondDateSahod?: number;
  firstDateRamble?: number;
  secondDateRamble?: number;
  firstDateCasas?: number;
  secondDateCasas?: number;
  firstRangeTumbok?: number;
  secondRangeTumbok?: number;
  firstRangeSahod?: number;
  secondRangeSahod?: number;
  firstRangeRamble?: number;
  secondRangeRamble?: number;
  firstRangeCasas?: number;
  secondRangeCasas?: number;
};

export type Chart36Data = {
  drawOrder: number;
  firstDateSTLPares: number;
  secondDateSTLPares: number;
  firstDateSTLSwer2: number;
  secondDateSTLSwer2: number;
  firstDateSTLSwer3: number;
  secondDateSTLSwer3: number;
  firstDateSTLSwer4: number;
  secondDateSTLSwer4: number;
  firstRangeSTLPares: number;
  secondRangeSTLPares: number;
  firstRangeSTLSwer2: number;
  secondRangeSTLSwer2: number;
  firstRangeSTLSwer3: number;
  secondRangeSTLSwer3: number;
  firstRangeSTLSwer4: number;
  secondRangeSTLSwer4: number;
};

export type ChartData = Chart1Data | Chart25Data | Chart36Data;

export interface RegionSpecificData {
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
    Casas: number;
  };
}

export interface RegionRangeData {
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
  };
}

export interface RangePayload {
  Region: {
    FirstRange: RegionRangeData[];
    SecondRange: RegionRangeData[];
  };
}

export interface SpecificDatePayload {
  DrawOrder: Array<chartOne_Specific | chartTwoFive_Range | chartThreeSix_Range>;
  Region: Array<any>;
}

export interface WinnersandWinningsSummaryProps {
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
    case "Total Winners and Winnings":
      return [
        { label: `Winners ${firstLabel}`, color: "#E5C7FF" },
        { label: `Winners ${secondLabel}`, color: "#5050A5" },
        { label: `Winnings ${firstLabel}`, color: "#7266C9" },
        { label: `Winnings ${secondLabel}`, color: "#3B3B81" },
      ];
    case "Total Winnings by Bet Type":
    case "Total Winners by Bet Type":
      return [
        { label: `Tumbok ${firstLabel}`, color: "#E5C7FF" },
        { label: `Tumbok ${secondLabel}`, color: "#5050A5" },
        { label: `Sahod ${firstLabel}`, color: "#7266C9" },
        { label: `Sahod ${secondLabel}`, color: "#3B3B81" },
        { label: `Ramble ${firstLabel}`, color: "#875AC4" },
        { label: `Ramble ${secondLabel}`, color: "#6F58C9" },
        { label: `Casas ${firstLabel}`, color: "#563D99" },
        { label: `Casas ${secondLabel}`, color: "#3E2466" },
      ];
    case "Total Winnings by Game Type":
    case "Total Winners by Game Type":
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
  firstDateSpecific: string | null,
  secondDateSpecific: string | null,
  firstDateDuration: string | null,
  secondDateDuration: string | null
): { label: string; color: string }[] => {
  const firstLabel = `${formatDate(firstDateSpecific)} - ${formatDate(firstDateDuration)}`;
  const secondLabel = `${formatDate(secondDateSpecific)} - ${formatDate(secondDateDuration)}`;

  switch (categoryFilter) {
    case "Total Winners and Winnings":
      return [
        { label: `Winners ${firstLabel}`, color: "#E5C7FF" },
        { label: `Winners ${secondLabel}`, color: "#5050A5" },
        { label: `Winnings ${firstLabel}`, color: "#7266C9" },
        { label: `Winnings ${secondLabel}`, color: "#3B3B81" },
      ];
    case "Total Winnings by Bet Type":
    case "Total Winners by Bet Type":
      return [
        { label: `Tumbok ${firstLabel}`, color: "#E5C7FF" },
        { label: `Tumbok ${secondLabel}`, color: "#5050A5" },
        { label: `Sahod ${firstLabel}`, color: "#7266C9" },
        { label: `Sahod ${secondLabel}`, color: "#3B3B81" },
        { label: `Ramble ${firstLabel}`, color: "#875AC4" },
        { label: `Ramble ${secondLabel}`, color: "#6F58C9" },
        { label: `Casas ${firstLabel}`, color: "#563D99" },
        { label: `Casas ${secondLabel}`, color: "#3E2466" },
      ];
    case "Total Winnings by Game Type":
    case "Total Winners by Game Type":
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