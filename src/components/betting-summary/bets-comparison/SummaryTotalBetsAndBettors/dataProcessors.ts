import { chartOne_Specific, chartOne_Range, chartTwoFive_Range, chartThreeSix_Range, ChartData } from '../types';
import { datesMatch } from '../utils';
import { GAME_CATEGORIES } from '../constant';

export const processChart1Data = (
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
  const drawOrders = [1, 2, 3];
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
        (sum: number, item: chartOne_Specific) => sum + item.TotalBetAmount,
        0
      ),
      secondDateBets: secondDateItems.reduce(
        (sum: number, item: chartOne_Specific) => sum + item.TotalBetAmount,
        0
      ),
    };
  });
};

export const processChart2Data = (
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
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

export const processChart3Data = (
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
  const drawOrders = [1, 2, 3];
  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };
    GAME_CATEGORIES.forEach((category) => {
      const allItems = payload.DrawOrder.filter(
        (item: any) => item.DrawOrder === drawOrder && item.GameCategory === category
      );

      const firstDateItems = allItems.filter((item: any) => datesMatch(item.TransactionDate, firstDate));
      const secondDateItems = allItems.filter((item: any) => datesMatch(item.TransactionDate, secondDate));

      result[`firstDate${category.replace(/\s+/g, "")}`] = firstDateItems.reduce(
        (sum: number, item: any) => sum + item.TotalBetAmount,
        0
      );
      result[`secondDate${category.replace(/\s+/g, "")}`] = secondDateItems.reduce(
        (sum: number, item: any) => sum + item.TotalBetAmount,
        0
      );
    });
    return result;
  });
};

export const processChart5Data = (
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
  const drawOrders = [1, 2, 3];
  return drawOrders.map((drawOrder) => {
    const allDrawItems = payload.DrawOrder.filter(
      (item: any) => item.DrawOrder === drawOrder
    );

    const firstDateItems = allDrawItems.filter((item: any) => datesMatch(item.TransactionDate, firstDate));
    const secondDateItems = allDrawItems.filter((item: any) => datesMatch(item.TransactionDate, secondDate));

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

export const processChart6Data = (
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
  const drawOrders = [1, 2, 3];
  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };
    GAME_CATEGORIES.forEach((category) => {
      const allItems = payload.DrawOrder.filter(
        (item: any) => item.DrawOrder === drawOrder && item.GameCategory === category
      );

      const firstDateItems = allItems.filter((item: any) => datesMatch(item.TransactionDate, firstDate));
      const secondDateItems = allItems.filter((item: any) => datesMatch(item.TransactionDate, secondDate));

      result[`firstDate${category.replace(/\s+/g, "")}`] = firstDateItems.reduce(
        (sum: number, item: any) => sum + item.TotalBettors,
        0
      );
      result[`secondDate${category.replace(/\s+/g, "")}`] = secondDateItems.reduce(
        (sum: number, item: any) => sum + item.TotalBettors,
        0
      );
    });
    return result;
  });
};

export const processDurationChart1Data = (payload: any): ChartData[] => {
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
      firstRangeBetAmount: firstRangeItems.reduce(
        (sum: number, item: chartOne_Range) => sum + item.TotalBetAmount,
        0
      ),
      secondRangeBetAmount: secondRangeItems.reduce(
        (sum: number, item: chartOne_Range) => sum + item.TotalBetAmount,
        0
      ),
    };
  });
};

export const processDurationChart2Data = (payload: any): ChartData[] => {
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
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
    };
  });
};

export const processDurationChart3Data = (payload: any): ChartData[] => {
  const drawOrders = [1, 2, 3];
  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };
    GAME_CATEGORIES.forEach((category) => {
      const firstRangeItems = payload.DrawOrder.FirstRange.filter(
        (item: chartThreeSix_Range) => item.DrawOrder === drawOrder && item.GameCategory === category
      );
      const secondRangeItems = payload.DrawOrder.SecondRange.filter(
        (item: chartThreeSix_Range) => item.DrawOrder === drawOrder && item.GameCategory === category
      );

      result[`firstRange${category.replace(/\s+/g, "")}`] = firstRangeItems.reduce(
        (sum: number, item: chartThreeSix_Range) => sum + item.TotalBetAmount,
        0
      );
      result[`secondRange${category.replace(/\s+/g, "")}`] = secondRangeItems.reduce(
        (sum: number, item: chartThreeSix_Range) => sum + item.TotalBetAmount,
        0
      );
    });
    return result;
  });
};

export const processDurationChart5Data = (payload: any): ChartData[] => {
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
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
    };
  });
};

export const processDurationChart6Data = (payload: any): ChartData[] => {
  const drawOrders = [1, 2, 3];
  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };
    GAME_CATEGORIES.forEach((category) => {
      const firstRangeItems = payload.DrawOrder.FirstRange.filter(
        (item: chartThreeSix_Range) => item.DrawOrder === drawOrder && item.GameCategory === category
      );
      const secondRangeItems = payload.DrawOrder.SecondRange.filter(
        (item: chartThreeSix_Range) => item.DrawOrder === drawOrder && item.GameCategory === category
      );

      result[`firstRange${category.replace(/\s+/g, "")}`] = firstRangeItems.reduce(
        (sum: number, item: chartThreeSix_Range) => sum + item.TotalBettors,
        0
      );
      result[`secondRange${category.replace(/\s+/g, "")}`] = secondRangeItems.reduce(
        (sum: number, item: chartThreeSix_Range) => sum + item.TotalBettors,
        0
      );
    });
    return result;
  });
};

export const processSpecificDatePayload = (
  urlParam: string,
  payload: any,
  firstDate: string,
  secondDate: string
): ChartData[] => {
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

export const processDurationPayload = (urlParam: string, payload: any): ChartData[] => {
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