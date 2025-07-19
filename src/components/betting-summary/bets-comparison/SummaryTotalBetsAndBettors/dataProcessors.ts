import {
  chartOne_Specific,
  chartThreeSix_Range,
  ChartData,
} from "../types";
import { datesMatch } from "../utils";
import { GAME_CATEGORIES } from "../constant";

const sumCasas = (item: any): number =>
  (item.TotalTresCasas || 0) +
  (item.TotalSaisCasas || 0) +
  (item.TotalDyisCasas || 0);

export const processChart1Data = (payload: any, firstDate: string, secondDate: string): ChartData[] => {
  const drawOrders = [1, 2, 3];
  const drawOrderData = Array.isArray(payload?.DrawOrder) ? payload.DrawOrder : payload?.DrawOrder ? [payload.DrawOrder] : [];

  return drawOrders.map((drawOrder) => {
    const items = drawOrderData.filter((item: chartOne_Specific) => item.DrawOrder === drawOrder);
    const first = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, firstDate));
    const second = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, secondDate));

    return {
      drawOrder,
      firstDateBettors: first.reduce((sum: any, item: { TotalBettors: any; }) => sum + item.TotalBettors, 0),
      secondDateBettors: second.reduce((sum: any, item: { TotalBettors: any; }) => sum + item.TotalBettors, 0),
      firstDateBets: first.reduce((sum: any, item: { TotalBetAmount: any; }) => sum + item.TotalBetAmount, 0),
      secondDateBets: second.reduce((sum: any, item: { TotalBetAmount: any; }) => sum + item.TotalBetAmount, 0),
    };
  });
};

export const processChart2Data = (payload: any, firstDate: string, secondDate: string): ChartData[] => {
  const drawOrders = [1, 2, 3];

  return drawOrders.map((drawOrder) => {
    const items = payload.DrawOrder.filter((item: any) => item.DrawOrder === drawOrder);
    const first = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, firstDate));
    const second = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, secondDate));

    return {
      drawOrder,
      firstDateTumbok: first.reduce((sum: any, item: { BetTypes: { Tumbok: any; }; }) => sum + (item.BetTypes?.Tumbok || 0), 0),
      secondDateTumbok: second.reduce((sum: any, item: { BetTypes: { Tumbok: any; }; }) => sum + (item.BetTypes?.Tumbok || 0), 0),
      firstDateSahod: first.reduce((sum: any, item: { BetTypes: { Sahod: any; }; }) => sum + (item.BetTypes?.Sahod || 0), 0),
      secondDateSahod: second.reduce((sum: any, item: { BetTypes: { Sahod: any; }; }) => sum + (item.BetTypes?.Sahod || 0), 0),
      firstDateRamble: first.reduce((sum: any, item: { BetTypes: { Ramble: any; }; }) => sum + (item.BetTypes?.Ramble || 0), 0),
      secondDateRamble: second.reduce((sum: any, item: { BetTypes: { Ramble: any; }; }) => sum + (item.BetTypes?.Ramble || 0), 0),
      firstDateCasas: first.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
      secondDateCasas: second.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
    };
  });
};

export const processChart5Data = (payload: any, firstDate: string, secondDate: string): ChartData[] => {
  const drawOrders = [1, 2, 3];

  return drawOrders.map((drawOrder) => {
    const items = payload.DrawOrder.filter((item: any) => item.DrawOrder === drawOrder);
    const first = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, firstDate));
    const second = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, secondDate));

    return {
      drawOrder,
      firstDateTumbok: first.reduce((sum: any, item: { TotalBettors: { Tumbok: any; }; }) => sum + (item.TotalBettors || 0), 0),
      secondDateTumbok: second.reduce((sum: any, item: { TotalBettors: { Tumbok: any; }; }) => sum + (item.TotalBettors || 0), 0),
      firstDateSahod: first.reduce((sum: any, item: { TotalBettors: { Sahod: any; }; }) => sum + (item.TotalBettors || 0), 0),
      secondDateSahod: second.reduce((sum: any, item: { TotalBettors: { Sahod: any; }; }) => sum + (item.TotalBettors || 0), 0),
      firstDateRamble: first.reduce((sum: any, item: { TotalBettors: { Ramble: any; }; }) => sum + (item.TotalBettors || 0), 0),
      secondDateRamble: second.reduce((sum: any, item: { TotalBettors: { Ramble: any; }; }) => sum + (item.TotalBettors || 0), 0),
      firstDateCasas: first.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
      secondDateCasas: second.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
    };
  });
};

const processGameCategoryChartData = (
  payload: any,
  firstDate: string,
  secondDate: string,
  valueKey: "TotalBetAmount" | "TotalBettors"
): ChartData[] => {
  const drawOrders = [1, 2, 3];
  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

    GAME_CATEGORIES.forEach((category) => {
      const items = payload.DrawOrder.filter((item: any) => item.DrawOrder === drawOrder && item.GameCategory === category);
      const first = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, firstDate));
      const second = items.filter((item: { TransactionDate: string; }) => datesMatch(item.TransactionDate, secondDate));

      const key = category.replace(/\s+/g, "");
      result[`firstDate${key}`] = first.reduce((sum: any, item: { [x: string]: any; }) => sum + item[valueKey], 0);
      result[`secondDate${key}`] = second.reduce((sum: any, item: { [x: string]: any; }) => sum + item[valueKey], 0);
    });

    return result;
  });
};

export const processChart3Data = (payload: any, firstDate: string, secondDate: string): ChartData[] =>
  processGameCategoryChartData(payload, firstDate, secondDate, "TotalBetAmount");

export const processChart6Data = (payload: any, firstDate: string, secondDate: string): ChartData[] =>
  processGameCategoryChartData(payload, firstDate, secondDate, "TotalBettors");


export const processSpecificDatePayload = (
  urlParam: string,
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
  if (!payload || !payload.DrawOrder) return [];

  switch (urlParam) {
    case "1": return processChart1Data(payload, firstDate, secondDate);
    case "2": return processChart2Data(payload, firstDate, secondDate);
    case "3": return processChart3Data(payload, firstDate, secondDate);
    case "5": return processChart5Data(payload, firstDate, secondDate);
    case "6": return processChart6Data(payload, firstDate, secondDate);
    default: return [];
  }
};

const filterRangeItems = (payload: any, drawOrder: number, key: string) =>
  payload.DrawOrder[key].filter((item: any) => item.DrawOrder === drawOrder);

export const processDurationChart1Data = (payload: any): ChartData[] =>
  [1, 2, 3].map((drawOrder) => {
    const first = filterRangeItems(payload, drawOrder, "FirstRange");
    const second = filterRangeItems(payload, drawOrder, "SecondRange");

    return {
      drawOrder,
      firstRangeBettors: first.reduce((sum: any, item: { TotalBettors: any; }) => sum + item.TotalBettors, 0),
      secondRangeBettors: second.reduce((sum: any, item: { TotalBettors: any; }) => sum + item.TotalBettors, 0),
      firstRangeTotalBetAmount: first.reduce((sum: any, item: { TotalBetAmount: any; }) => sum + item.TotalBetAmount, 0),
      secondRangeTotalBetAmount: second.reduce((sum: any, item: { TotalBetAmount: any; }) => sum + item.TotalBetAmount, 0),
    };
  });

export const processDurationChart2Data = (payload: any): ChartData[] => {
  return [1, 2, 3].map((drawOrder) => {
    const first = filterRangeItems(payload, drawOrder, "FirstRange");
    const second = filterRangeItems(payload, drawOrder, "SecondRange");

    return {
      drawOrder,
      firstRangeTumbok: first.reduce((sum: any, item: any) => sum + (item.BetTypes?.Tumbok || 0), 0),
      secondRangeTumbok: second.reduce((sum: any, item: any) => sum + (item.BetTypes?.Tumbok || 0), 0),
      firstRangeSahod: first.reduce((sum: any, item: any) => sum + (item.BetTypes?.Sahod || 0), 0),
      secondRangeSahod: second.reduce((sum: any, item: any) => sum + (item.BetTypes?.Sahod || 0), 0),
      firstRangeCasas: first.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
      secondRangeCasas: second.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
    };
  });
};

export const processDurationChart5Data = (payload: any): ChartData[] => {
  return [1, 2, 3].map((drawOrder) => {
    const first = filterRangeItems(payload, drawOrder, "FirstRange");
    const second = filterRangeItems(payload, drawOrder, "SecondRange");

    return {
      drawOrder,
      firstRangeTumbok: first.reduce((sum: any, item: any) => sum + (item.TotalBettors || 0), 0),
      secondRangeTumbok: second.reduce((sum: any, item: any) => sum + (item.TotalBettors || 0), 0),
      firstRangeSahod: first.reduce((sum: any, item: any) => sum + (item.TotalBettors || 0), 0),
      secondRangeSahod: second.reduce((sum: any, item: any) => sum + (item.TotalBettors || 0), 0),
      firstRangeCasas: first.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
      secondRangeCasas: second.reduce((sum: number, item: any) => sum + sumCasas(item), 0),
    };
  });
};

// export const processDurationChart5Data = processDurationChart2Data;

const processDurationGameCategoryChartData = (
  payload: any,
  valueKey: "TotalBetAmount" | "TotalBettors"
): ChartData[] => {
  const drawOrders = [1, 2, 3];

  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

    GAME_CATEGORIES.forEach((category) => {
      const firstRangeItems = payload.DrawOrder.FirstRange.filter(
        (item: chartThreeSix_Range) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );
      const secondRangeItems = payload.DrawOrder.SecondRange.filter(
        (item: chartThreeSix_Range) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );

      const key = category.replace(/\s+/g, "");

      result[`firstRange${key}`] = firstRangeItems.reduce(
        (sum: number, item: any) => sum + (item[valueKey] || 0),
        0
      );
      result[`secondRange${key}`] = secondRangeItems.reduce(
        (sum: number, item: any) => sum + (item[valueKey] || 0),
        0
      );
    });

    return result;
  });
};

export const processDurationChart3Data = (payload: any): ChartData[] => processDurationGameCategoryChartData(payload, "TotalBetAmount");
export const processDurationChart6Data = (payload: any): ChartData[] => processDurationGameCategoryChartData(payload, "TotalBettors");

export const processDurationPayload = (urlParam: string, payload: any): ChartData[] => {
  if (!payload?.DrawOrder?.FirstRange || !payload?.DrawOrder?.SecondRange) return [];

  switch (urlParam) {
    case "1": return processDurationChart1Data(payload);
    case "2": return processDurationChart2Data(payload);
    case "3": return processDurationChart3Data(payload);
    case "5": return processDurationChart5Data(payload);
    case "6": return processDurationChart6Data(payload);
    default: return [];
  }
};