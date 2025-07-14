import {
  RegionSpecificData,
  RangePayload,
} from "../types";
import { datesMatch } from "../utils";

const philippineRegions = [
  "NCR",
  "CAR",
  "I",
  "II",
  "III",
  "IV-A",
  "IV-B",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "BARMM",
];

const sumCasas = (item: any): number =>
  (item.TotalTresCasas || 0) +
  (item.TotalSaisCasas || 0) +
  (item.TotalDyisCasas || 0);

const processChart1Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string
) => {
  return philippineRegions.map((region) => {
    const allRegionItems = payload.Region.flat().filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    const firstDateItems = allRegionItems.filter((item) =>
      datesMatch(item.TransactionDate, firstDate)
    );
    const secondDateItems = allRegionItems.filter((item) =>
      datesMatch(item.TransactionDate, secondDate)
    );

    return {
      region,
      firstDateBettors: firstDateItems.reduce((sum, item) => sum + item.TotalBettors, 0),
      secondDateBettors: secondDateItems.reduce((sum, item) => sum + item.TotalBettors, 0),
      firstDateBets: firstDateItems.reduce((sum, item) => sum + item.TotalBetAmount, 0),
      secondDateBets: secondDateItems.reduce((sum, item) => sum + item.TotalBetAmount, 0),
    };
  });
};

const processRegionalTumbokSahodCasasData = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  useNestedBetTypes: boolean
) => {
  return philippineRegions.map((region) => {
    const allRegionItems = payload.Region.flat().filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    const firstDateItems = allRegionItems.filter((item) =>
      datesMatch(item.TransactionDate, firstDate)
    );
    const secondDateItems = allRegionItems.filter((item) =>
      datesMatch(item.TransactionDate, secondDate)
    );

    const getTumbok = (item: any) =>
      useNestedBetTypes ? item.BetTypes?.Tumbok || 0 : item.TotalTumbok || 0;
    const getSahod = (item: any) =>
      useNestedBetTypes ? item.BetTypes?.Sahod || 0 : item.TotalSahod || 0;

    return {
      region,
      firstDateTumbok: firstDateItems.reduce((sum, item) => sum + getTumbok(item), 0),
      secondDateTumbok: secondDateItems.reduce((sum, item) => sum + getTumbok(item), 0),
      firstDateSahod: firstDateItems.reduce((sum, item) => sum + getSahod(item), 0),
      secondDateSahod: secondDateItems.reduce((sum, item) => sum + getSahod(item), 0),
      firstDateCasas: firstDateItems.reduce((sum, item) => sum + sumCasas(item), 0),
      secondDateCasas: secondDateItems.reduce((sum, item) => sum + sumCasas(item), 0),
    };
  });
};

const processChart2Data = (payload: { Region: Array<RegionSpecificData[]> }, firstDate: string, secondDate: string
  ) => processRegionalTumbokSahodCasasData(payload, firstDate, secondDate, true);

const processChart5Data = (payload: { Region: Array<RegionSpecificData[]> }, firstDate: string, secondDate: string
  ) => processRegionalTumbokSahodCasasData(payload, firstDate, secondDate, false);

const processRegionalGameCategoryChartData = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  valueKey: "TotalBetAmount" | "TotalBettors"
) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return philippineRegions.map((region) => {
    const result: any = { region };

    gameCategories.forEach((category) => {
      const allItems = payload.Region.flat().filter(
        (item) =>
          (item.Region === region || item.Region === `Region ${region}`) &&
          item.GameCategory === category
      );

      const firstDateItems = allItems.filter((item) => datesMatch(item.TransactionDate, firstDate));
      const secondDateItems = allItems.filter((item) => datesMatch(item.TransactionDate, secondDate));

      const key = category.replace(/\s+/g, "");
      result[`firstDate${key}`] = firstDateItems.reduce(
        (sum, item) => sum + item[valueKey],
        0
      );
      result[`secondDate${key}`] = secondDateItems.reduce(
        (sum, item) => sum + item[valueKey],
        0
      );
    });

    return result;
  });
};

const processChart3Data = (payload: { Region: Array<RegionSpecificData[]> }, firstDate: string, secondDate: string
  ) => processRegionalGameCategoryChartData(payload, firstDate, secondDate, "TotalBetAmount");

const processChart6Data = (payload: { Region: Array<RegionSpecificData[]> }, firstDate: string, secondDate: string
  ) => processRegionalGameCategoryChartData(payload, firstDate, secondDate, "TotalBettors");

export const processSpecificDatePayload = (
  urlParam: string,
  payload: any,
  firstDate: string,
  secondDate: string
) => {
  if (!payload || !payload.DrawOrder) {return [];}

  switch (urlParam) {
    case "1": return processChart1Data(payload, firstDate, secondDate);
    case "2": return processChart2Data(payload, firstDate, secondDate);
    case "3": return processChart3Data(payload, firstDate, secondDate);
    case "5": return processChart5Data(payload, firstDate, secondDate);
    case "6": return processChart6Data(payload, firstDate, secondDate);
    default:
      //console.warn("Unknown urlParam:", urlParam);
      return [];
  }
};

const processDurationChart1Data = (payload: RangePayload) => {
  return philippineRegions.map((region) => {
    const firstRangeItems = payload.Region.FirstRange.filter((item) => item.Region === region || item.Region === `Region ${region}`);
    const secondRangeItems = payload.Region.SecondRange.filter((item) => item.Region === region || item.Region === `Region ${region}`);

    return {
      region,
      firstRangeBettors: firstRangeItems.reduce((sum, item) => sum + item.TotalBettors, 0),
      secondRangeBettors: secondRangeItems.reduce((sum, item) => sum + item.TotalBettors, 0),
      firstRangeBets: firstRangeItems.reduce((sum, item) => sum + item.TotalBetAmount, 0),
      secondRangeBets: secondRangeItems.reduce((sum, item) => sum + item.TotalBetAmount, 0),
    };
  });
};

const processDurationTumbokSahodCasas = (
  payload: RangePayload,
  useNestedBetTypes: boolean
) => {
  return philippineRegions.map((region) => {
    const firstRangeItems = payload.Region.FirstRange.filter((item) => item.Region === region || item.Region === `Region ${region}`);
    const secondRangeItems = payload.Region.SecondRange.filter((item) => item.Region === region || item.Region === `Region ${region}`);

    const getTumbok = (item: any) => useNestedBetTypes ? item.BetTypes?.Tumbok || 0 : item.TotalTumbok || 0;
    const getSahod = (item: any) => useNestedBetTypes ? item.BetTypes?.Sahod || 0 : item.TotalSahod || 0;

    return {
      region,
      firstRangeTumbok: firstRangeItems.reduce((sum, item) => sum + getTumbok(item), 0),
      secondRangeTumbok: secondRangeItems.reduce((sum, item) => sum + getTumbok(item), 0),
      firstRangeSahod: firstRangeItems.reduce((sum, item) => sum + getSahod(item), 0),
      secondRangeSahod: secondRangeItems.reduce((sum, item) => sum + getSahod(item), 0),
      firstRangeCasas: firstRangeItems.reduce((sum, item) => sum + sumCasas(item), 0),
      secondRangeCasas: secondRangeItems.reduce((sum, item) => sum + sumCasas(item), 0),
    };
  });
};

const processDurationChart2Data = (payload: RangePayload) => processDurationTumbokSahodCasas(payload, true);
const processDurationChart5Data = (payload: RangePayload) => processDurationTumbokSahodCasas(payload, false);

const processDurationGameCategoryData = (
  payload: RangePayload,
  valueKey: "TotalBetAmount" | "TotalBettors"
) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return philippineRegions.map((region) => {
    const result: any = { region };

    gameCategories.forEach((category) => {
      const firstRangeItems = payload.Region.FirstRange.filter((item) => (item.Region === region || item.Region === `Region ${region}`) && item.GameCategory === category);
      const secondRangeItems = payload.Region.SecondRange.filter((item) => (item.Region === region || item.Region === `Region ${region}`) && item.GameCategory === category);

      const key = category.replace(/\s+/g, "");
      result[`firstRange${key}`] = firstRangeItems.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
      result[`secondRange${key}`] = secondRangeItems.reduce((sum, item) => sum + (item[valueKey] || 0),0);
    });

    return result;
  });
};

const processDurationChart3Data = (payload: RangePayload) => processDurationGameCategoryData(payload, "TotalBetAmount");
const processDurationChart6Data = (payload: RangePayload) => processDurationGameCategoryData(payload, "TotalBettors");

export const processDurationPayload = (urlParam: string, payload: any) => {
  if (!payload || !payload.DrawOrder || !payload.DrawOrder.FirstRange || !payload.DrawOrder.SecondRange) {
    return [];
  }

  switch (urlParam) {
    case "1": return processDurationChart1Data(payload);
    case "2": return processDurationChart2Data(payload);
    case "3": return processDurationChart3Data(payload);
    case "5": return processDurationChart5Data(payload);
    case "6": return processDurationChart6Data(payload);
    default: return [];
  }
};
