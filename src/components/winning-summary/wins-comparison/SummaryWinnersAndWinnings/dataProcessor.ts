import { SpecificDatePayload, chartOne_Range, chartTwoFive_Range, chartThreeSix_Range } from '../types';
import { drawOrders } from '../constant';
import { datesMatch } from '../utils';

export const processChart1Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  //_datesMatch: (dateString1: string, dateString2: string) => boolean // not used
) => {
  const drawItems = Array.isArray(payload.DrawOrder[0])
    ? payload.DrawOrder.flat()
    : payload.DrawOrder;

  return drawOrders.map((drawOrder) => {
    const drawOrderItems = drawItems.filter(
      (item: any) => item.DrawOrder === drawOrder
    );

    const [firstItem, secondItem] = drawOrderItems;

    const firstDateWinners = firstItem?.TotalWinners || 0;
    const secondDateWinners = secondItem?.TotalWinners || 0;
    const firstDateWinnings = firstItem?.TotalPayoutAmount || 0;
    const secondDateWinnings = secondItem?.TotalPayoutAmount || 0;

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
  console.log("RAW PAYLOAD:", payload);
  console.log("FIRST DATE:", firstDate);
  console.log("SECOND DATE:", secondDate);

  return drawOrders.map((drawOrder) => {
    const allDrawItems = payload.DrawOrder.filter(
      (item: any) => item.DrawOrder === drawOrder
    );

    console.log(`\n--- DRAW ORDER: ${drawOrder} ---`);
    console.log("ALL DRAW ITEMS:", allDrawItems);

    const firstDateItems = allDrawItems.filter((item: any) =>
      datesMatch(item.DateOfWinningCombination, firstDate)
    );
    const secondDateItems = allDrawItems.filter((item: any) =>
      datesMatch(item.DateOfWinningCombination, secondDate)
    );

    console.log("FIRST DATE ITEMS:", firstDateItems);
    console.log("SECOND DATE ITEMS:", secondDateItems);

    const firstDateTumbok = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.BetTypes?.Tumbok || 0),
      0
    );
    const secondDateTumbok = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.BetTypes?.Tumbok || 0),
      0
    );

    const firstDateSahod = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.BetTypes?.Sahod || 0),
      0
    );
    const secondDateSahod = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.BetTypes?.Sahod || 0),
      0
    );

    const firstDateRamble = firstDateItems.reduce(
      (sum: number, item: any) => sum + (item.BetTypes?.Ramble || 0),
      0
    );
    const secondDateRamble = secondDateItems.reduce(
      (sum: number, item: any) => sum + (item.BetTypes?.Ramble || 0),
      0
    );

    const firstDateCasas = firstDateItems.reduce(
      (sum: number, item: any) =>
        sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
      0
    );
    const secondDateCasas = secondDateItems.reduce(
      (sum: number, item: any) =>
        sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
      0
    );

    console.log("firstDateTumbok:", firstDateTumbok);
    console.log("secondDateTumbok:", secondDateTumbok);
    console.log("firstDateSahod:", firstDateSahod);
    console.log("secondDateSahod:", secondDateSahod);
    console.log("firstDateRamble:", firstDateRamble);
    console.log("secondDateRamble:", secondDateRamble);
    console.log("firstDateCasas:", firstDateCasas);
    console.log("secondDateCasas:", secondDateCasas);

    return {
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
  });
};

export const processChart3Data = (
  payload: SpecificDatePayload,
  firstDate: string, // still accepted for possible labels
  secondDate: string,
  _datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  console.log("RAW PAYLOAD:", payload);
  console.log("Processing chart data WITHOUT TransactionDate filtering.");

  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

    gameCategories.forEach((category) => {
      const allItems = payload.DrawOrder.filter(
        (item: any) =>
          item.DrawOrder === drawOrder && item.GameCategory === category
      );

      console.log(`\nDrawOrder: ${drawOrder}, Category: ${category}`);
      console.log("All Items:", allItems);

      const firstItem = allItems[0];
      const secondItem = allItems[1];

      const keyPrefix = category.replace(/\s+/g, "");

      const firstValue = (firstItem?.TotalPayoutAmount || 0) / 100000;
      const secondValue = (secondItem?.TotalPayoutAmount || 0) / 100000;

      result[`firstDate${keyPrefix}`] = firstValue;
      result[`secondDate${keyPrefix}`] = secondValue;

      console.log(`firstDate${keyPrefix}:`, firstValue);
      console.log(`secondDate${keyPrefix}:`, secondValue);
    });

    return result;
  });
};

export const processChart5Data = (
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
      firstDateRamble: firstDateItems.reduce(
        (sum: number, item: any) => sum + (item.BetTypes?.Ramble || 0),
        0
      ),
      secondDateRamble: secondDateItems.reduce(
        (sum: number, item: any) => sum + (item.BetTypes?.Ramble || 0),
        0
      ),
      firstDateCasas: firstDateItems.reduce(
        (sum: number, item: any) => sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
        0
      ),
      secondDateCasas: secondDateItems.reduce(
        (sum: number, item: any) => sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
        0
      ),
    };
  });
};

export const processChart6Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return drawOrders.map((drawOrder) => {
    const result: any = { drawOrder };

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

export const processSpecificDatePayload = (
  urlParam: string,
  payload: any,
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  if (!payload || !payload.DrawOrder) {
    console.warn("Invalid payload structure", payload, );
    return [];
  }

  switch (urlParam) {
    case "1":
      return processChart1Data(payload, firstDate, secondDate);
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
      firstRangeRamble: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.BetTypes?.Ramble || 0),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.BetTypes?.Ramble || 0),
        0
      ),
      firstRangeCasas: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
        0
      ),
    };
  });
};

export const processDurationChart3Data = (payload: any) => {
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
      firstRangeRamble: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.BetTypes?.Ramble || 0),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.BetTypes?.Ramble || 0),
        0
      ),
      firstRangeCasas: firstRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum: number, item: chartTwoFive_Range) =>
          sum + (item.TotalSaisCasas || 0) + (item.TotalTresCasas || 0),
        0
      ),
    };
  });
};

export const processDurationChart6Data = (payload: any) => {
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

export const processDurationPayload = (urlParam: string, payload: any) => {
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
      //console.warn("Unknown urlParam:", urlParam);
      return [];
  }
};