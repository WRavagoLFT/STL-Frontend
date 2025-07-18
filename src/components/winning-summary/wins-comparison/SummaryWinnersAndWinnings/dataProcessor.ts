import { SpecificDatePayload, chartOne_Range, chartTwoFive_Range, chartThreeSix_Range } from '../types';
import { drawOrders } from '../constant';
import { datesMatch } from '../utils';

export const processChart1Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  _datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  const drawItems = Array.isArray(payload.DrawOrder[0])
    ? payload.DrawOrder.flat()
    : payload.DrawOrder;
    
  return drawOrders.map((drawOrder) => {
    const drawOrderItems = drawItems.filter(
      (item: any) => item.DrawOrder === drawOrder
    );

    const firstItem = drawOrderItems.find((item) =>
      _datesMatch(item.DateOfWinningCombination, firstDate)
    );

    const secondItem = drawOrderItems.find((item) =>
      _datesMatch(item.DateOfWinningCombination, secondDate)
    );

    const firstDateWinners = firstItem?.TotalWinners ?? 0;
    const secondDateWinners = secondItem?.TotalPayoutAmount ?? 0;
    const firstDateWinnings = firstItem?.TotalWinners ?? 0;
    const secondDateWinnings = secondItem?.TotalPayoutAmount ?? 0;

    return {
      drawOrder,
      firstDateWinners,
      secondDateWinners,
      firstDateWinnings,
      secondDateWinnings,
    };
  });
};

export const processChart2Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  return drawOrders.map((drawOrder) => {
    const allDrawItems = payload.DrawOrder.filter(
      (item: any) => item.DrawOrder === drawOrder
    );

    const firstDateItems = allDrawItems.filter((item: any) =>
      datesMatch(item.DateOfWinningCombination, firstDate)
    );
    const secondDateItems = allDrawItems.filter((item: any) =>
      datesMatch(item.DateOfWinningCombination, secondDate)
    );

    const firstDateTumbok = firstDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalTumbokPayouts || 0) / 10000),
      0
    );
    const secondDateTumbok = secondDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalTumbokPayouts || 0) / 10000),
      0
    );

    const firstDateSahod = firstDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalSahodPayouts || 0) / 10000),
      0
    );
    const secondDateSahod = secondDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalSahodPayouts || 0) / 10000),
      0
    );

    const firstDateRamble = firstDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalRamblePayouts || 0) / 10000),
      0
    );
    const secondDateRamble = secondDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalRamblePayouts || 0) / 10000),
      0
    );

    const firstDateCasas = firstDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalCasasPayouts || 0) / 10000),
      0
    );
    const secondDateCasas = secondDateItems.reduce(
      (sum: number, item: any) => sum + ((item.TotalCasasPayouts || 0) / 10000),
      0
    );

    const result = {
      drawOrder,
      firstDateTumbok,
      secondDateTumbok,
      firstDateSahod,
      secondDateSahod,
      firstDateRamble,
      secondDateRamble,
      firstDateCasas,
      secondDateCasas,
    };

    return result;
  });
};

export const processChart3Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  _datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

    gameCategories.forEach((category) => {
      const allItems = payload.DrawOrder.filter(
        (item: any) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );

      const firstItem = allItems.find((item) =>
        _datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondItem = allItems.find((item) =>
        _datesMatch(item.DateOfWinningCombination, secondDate)
      );

      const keyPrefix = category.replace(/\s+/g, "");

      const firstValue = firstItem?.TotalPayoutAmount ?? 0;
      const secondValue = secondItem?.TotalPayoutAmount ?? 0;

      result[`firstDate${keyPrefix}`] = firstValue;
      result[`secondDate${keyPrefix}`] = secondValue;
    });

    return result;
  });
};

export const processChart6Data = (
payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  return drawOrders.map((drawOrder) => {
    const allDrawItems = payload.DrawOrder.filter(
      (item: any) => item.DrawOrder === drawOrder
    );

    const firstDateItems = allDrawItems.filter((item: any) =>
      datesMatch(item.DateOfWinningCombination, firstDate)
    );
    const secondDateItems = allDrawItems.filter((item: any) =>
      datesMatch(item.DateOfWinningCombination, secondDate)
    );

    const firstDateTumbok = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalTumbokWinners || 0),
      0
    );
    const secondDateTumbok = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalTumbokWinners || 0),
      0
    );

    const firstDateSahod = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalSahodWinners || 0),
      0
    );
    const secondDateSahod = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalSahodWinners || 0),
      0
    );

    const firstDateRamble = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalRambleWinners || 0),
      0
    );
    const secondDateRamble = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalRambleWinners || 0),
      0
    );

    const firstDateCasas = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalCasasWinners || 0),
      0
    );
    const secondDateCasas = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.TotalCasasWinners || 0),
      0
    );

    const result = {
      drawOrder,
      firstDateTumbok,
      secondDateTumbok,
      firstDateSahod,
      secondDateSahod,
      firstDateRamble,
      secondDateRamble,
      firstDateCasas,
      secondDateCasas,
    };

    return result;
  });
};

export const processChart5Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  console.log("Raw DrawOrder payload:", payload.DrawOrder);
  console.log("Comparing dates:", firstDate, "vs", secondDate);

  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

    console.log(`\n Processing DrawOrder: ${drawOrder}`);

    gameCategories.forEach((category) => {
      const allItems = payload.DrawOrder.filter(
        (item: any) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );

      const firstDateItems = allItems.filter((item: any) =>
        datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondDateItems = allItems.filter((item: any) =>
        datesMatch(item.DateOfWinningCombination, secondDate)
      );

      const firstTotal = firstDateItems.reduce(
        (sum: number, item: any) => sum + item.TotalWinnners,
        0
      );
      const secondTotal = secondDateItems.reduce(
        (sum: number, item: any) => sum + item.TotalWinnners,
        0
      );

      result[`firstDate${category.replace(/\s+/g, "")}`] = firstTotal;
      result[`secondDate${category.replace(/\s+/g, "")}`] = secondTotal;

      console.log(`Category: ${category}`);
      console.log(`FirstDate Items (${firstDate}):`, firstDateItems);
      console.log(`Total Bettors (FirstDate):`, firstTotal);
      console.log(`SecondDate Items (${secondDate}):`, secondDateItems);
      console.log(`Total Bettors (SecondDate):`, secondTotal);
    });

    console.log("Final Result for drawOrder:", result);
    return result;
  });

};

export const processSpecificDatePayload = (
  urlParam: string,
  payload: any,
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
  //datesMatch
) => {
  if (!payload || !payload.DrawOrder) {
    console.warn("Invalid payload structure", payload, );
    return [];
  }

  switch (urlParam) {
    case "1":
      return processChart1Data(payload, firstDate, secondDate, datesMatch);
    case "2":
      return processChart2Data(payload, firstDate, secondDate, datesMatch);
    case "3":
      return processChart3Data(payload, firstDate, secondDate, datesMatch);
    case "5":
      return processChart5Data(payload, firstDate, secondDate, datesMatch);
    case "6":
      return processChart6Data(payload, firstDate, secondDate, datesMatch);
    default:
      //console.warn("Unknown urlParam:", urlParam);
      return [];
  }
};

export const processDurationChart1Data = (payload: any) => {
  const firstRange = payload?.DrawOrder?.FirstRange ?? [];
  const secondRange = payload?.DrawOrder?.SecondRange ?? [];

  return drawOrders.map((drawOrder) => {
    const firstItem = firstRange.find((item: any) => item.DrawOrder === drawOrder);
    const secondItem = secondRange.find((item: any) => item.DrawOrder === drawOrder);

    const firstDateWinners = firstItem?.TotalWinners || 0;
    const secondDateWinners = secondItem?.TotalWinners || 0;
    const firstDateWinnings = firstItem?.TotalPayoutAmount || 0;
    const secondDateWinnings = secondItem?.TotalPayoutAmount || 0;

    console.log(`DrawOrder ${drawOrder}:`, {
      firstItem,
      secondItem,
      firstDateWinners,
      secondDateWinners,
      firstDateWinnings,
      secondDateWinnings,
    });

    return {
      drawOrder,
      firstDateWinners,
      secondDateWinners,
      firstDateWinnings,
      secondDateWinnings,
    };
  });
};

export const processDurationChart2Data = (payload: any) => {
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
        (sum: number, item: chartTwoFive_Range) => sum + ((item.TotalTumbokPayouts || 0) / 10000),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + ((item.TotalTumbokPayouts || 0) / 10000),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + ((item.TotalSahodPayouts || 0) / 10000),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + ((item.TotalSahodPayouts || 0) / 10000),
        0
      ),
      firstRangeRamble: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + ((item.TotalRamblePayouts || 0) / 10000),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + ((item.TotalRamblePayouts || 0) / 10000),
        0
      ),
      
      firstRangeCasas: firstRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalCasasPayouts || 0) / 10000),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalCasasPayouts || 0) / 10000),
        0
      ),
    };
  });
};

export const processDurationChart3Data = (payload: any) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  // Use safe fallback arrays to avoid TypeError
  const firstRange = payload?.DrawOrder?.FirstRange ?? [];
  const secondRange = payload?.DrawOrder?.SecondRange ?? [];

  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

    gameCategories.forEach((category) => {
      const firstRangeItems = firstRange.filter(
        (item: chartThreeSix_Range) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );

      const secondRangeItems = secondRange.filter(
        (item: chartThreeSix_Range) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );

      result[`firstRange${category.replace(/\s+/g, "")}`] = firstRangeItems.reduce(
        (sum: number, item: chartThreeSix_Range) => sum + (item.TotalPayoutAmount ?? 0),
        0
      );

      result[`secondRange${category.replace(/\s+/g, "")}`] = secondRangeItems.reduce(
        (sum: number, item: chartThreeSix_Range) => sum + (item.TotalPayoutAmount ?? 0),
        0
      );
    });

    return result;
  });
};

export const processDurationChart5Data = (payload: any) => {
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
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalTumbokWinners || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalTumbokWinners || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalSahodWinners || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalSahodWinners || 0),
        0
      ),
      firstRangeRamble: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalRambleWinners || 0),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalRambleWinners || 0),
        0
      ),
      
      firstRangeCasas: firstRangeItems.reduce(
        (sum: number, item: any) => sum + (item.TotalCasasWinners || 0),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum: number, item: any) => sum + (item.TotalCasasWinners || 0),
        0
      ),
    };
  });
};

// WINNERS BY BET TYPE = 6
export const processDurationChart6Data = (payload: any) => {
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
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalTumbokWinners || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalTumbokWinners || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalSahodWinners || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalSahodWinners || 0),
        0
      ),
      firstRangeRamble: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalRambleWinners || 0),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) => sum + (item.TotalRambleWinners || 0),
        0
      ),
      
      firstRangeCasas: firstRangeItems.reduce(
        (sum: number, item: any) => sum + (item.TotalCasasWinners || 0),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum: number, item: any) => sum + (item.TotalCasasWinners || 0),
        0
      ),
    };
  });
};

export const processDurationPayload = (urlParam: string, payload: any) => {
  if (!payload || !payload.DrawOrder) {
    console.warn("Invalid payload structure", payload, );
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