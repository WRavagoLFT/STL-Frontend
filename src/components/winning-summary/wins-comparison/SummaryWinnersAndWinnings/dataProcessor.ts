import { SpecificDatePayload, chartOne_Range, chartTwoFive_Range, chartThreeSix_Range } from '../types';
import { drawOrders } from '../constant';

export const processChart1Data = (
  payload: SpecificDatePayload,
  firstDate: string,
  secondDate: string,
  _datesMatch: (dateString1: string, dateString2: string) => boolean // not used
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

export const processChart3Data = (
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
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allItems.filter((item: any) =>
        datesMatch(item.TransactionDate, secondDate)
      );

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
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allItems.filter((item: any) =>
        datesMatch(item.TransactionDate, secondDate)
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
    console.warn("Invalid payload structure", payload);
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
  return drawOrders.map((drawOrder) => {
    const firstRangeItems = payload.DrawOrder.FirstRange.filter(
      (item: chartOne_Range) => item.DrawOrder === drawOrder
    );
    const secondRangeItems = payload.DrawOrder.SecondRange.filter(
      (item: chartOne_Range) => item.DrawOrder === drawOrder
    );

    return {
      drawOrder,
      firstRangeWinners: firstRangeItems.reduce(
        (sum: number, item: chartOne_Range) => sum + item.TotalBettors,
        0
      ),
      secondRangeWinners: secondRangeItems.reduce(
        (sum: number, item: chartOne_Range) => sum + item.TotalBettors,
        0
      ),
      firstRangeWinnings: firstRangeItems.reduce(
        (sum: number, item: chartOne_Range) => sum + item.TotalBetAmount,
        0
      ),
      secondRangeWinnings: secondRangeItems.reduce(
        (sum: number, item: chartOne_Range) => sum + item.TotalBetAmount,
        0
      ),
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