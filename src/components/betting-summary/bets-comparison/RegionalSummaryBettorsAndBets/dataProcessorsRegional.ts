import {
  RegionSpecificData,
  RegionRangeData,
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
      firstDateBettors: firstDateItems.reduce(
        (sum, item) => sum + item.TotalBettors,
        0
      ),
      secondDateBettors: secondDateItems.reduce(
        (sum, item) => sum + item.TotalBettors,
        0
      ),
      firstDateBets: firstDateItems.reduce(
        (sum, item) => sum + item.TotalBetAmount,
        0
      ),
      secondDateBets: secondDateItems.reduce(
        (sum, item) => sum + item.TotalBetAmount,
        0
      ),
    };
  });
};

const processChart2Data = (
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
      firstDateTumbok: firstDateItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      secondDateTumbok: secondDateItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      firstDateSahod: firstDateItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
      secondDateSahod: secondDateItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
      firstDateCasas: firstDateItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Casas || 0),
        0
      ),
      secondDateCasas: secondDateItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Casas || 0),
        0
      )
    };
  });
};

const processChart3Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string
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

      const firstDateItems = allItems.filter((item) =>
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allItems.filter((item) =>
        datesMatch(item.TransactionDate, secondDate)
      );

      result[`firstDate${category.replace(/\s+/g, "")}`] =
        firstDateItems.reduce((sum, item) => sum + item.TotalBetAmount, 0);
      result[`secondDate${category.replace(/\s+/g, "")}`] =
        secondDateItems.reduce((sum, item) => sum + item.TotalBetAmount, 0);
    });

    return result;
  });
};

const processChart5Data = (
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
      firstDateTumbok: firstDateItems.reduce(
        (sum, item) => sum + (item.TotalTumbok || 0),
        0
      ),
      secondDateTumbok: secondDateItems.reduce(
        (sum, item) => sum + (item.TotalTumbok || 0),
        0
      ),
      firstDateSahod: firstDateItems.reduce(
        (sum, item) => sum + (item.TotalSahod || 0),
        0
      ),
      secondDateSahod: secondDateItems.reduce(
        (sum, item) => sum + (item.TotalSahod || 0),
        0
      ),
    };
  });
};

const processChart6Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string
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

      const firstDateItems = allItems.filter((item) =>
        datesMatch(item.TransactionDate, firstDate)
      );
      const secondDateItems = allItems.filter((item) =>
        datesMatch(item.TransactionDate, secondDate)
      );

      result[`firstDate${category.replace(/\s+/g, "")}`] =
        firstDateItems.reduce((sum, item) => sum + item.TotalBettors, 0);
      result[`secondDate${category.replace(/\s+/g, "")}`] =
        secondDateItems.reduce((sum, item) => sum + item.TotalBettors, 0);
    });

    return result;
  });
};

// Main processor function
export const processSpecificDatePayload = (
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

//  For Date Duration Date.
const processDurationChart1Data = (payload: RangePayload) => {
  return philippineRegions.map((region) => {
    const firstRangeItems = payload.Region.FirstRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );
    const secondRangeItems = payload.Region.SecondRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    return {
      region,
      firstRangeBettors: firstRangeItems.reduce(
        (sum, item) => sum + item.TotalBettors,
        0
      ),
      secondRangeBettors: secondRangeItems.reduce(
        (sum, item) => sum + item.TotalBettors,
        0
      ),
      firstRangeBets: firstRangeItems.reduce(
        (sum, item) => sum + item.TotalBetAmount,
        0
      ),
      secondRangeBets: secondRangeItems.reduce(
        (sum, item) => sum + item.TotalBetAmount,
        0
      ),
    };
  });
};

const processDurationChart2Data = (payload: RangePayload) => {
  return philippineRegions.map((region) => {
    const firstRangeItems = payload.Region.FirstRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    const secondRangeItems = payload.Region.SecondRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    return {
      region,

      // Tumbok
      firstRangeTumbok: firstRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),

      // Sahod
      firstRangeSahod: firstRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),

      // Casas
      firstRangeCasas: firstRangeItems.reduce(
        (sum, item) =>
          sum +
          (item.TotalTresCasas || 0) +
          (item.TotalSaisCasas || 0) +
          (item.TotalSaisCasas || 0),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum, item) =>
          sum +
          (item.TotalTresCasas || 0) +
          (item.TotalSaisCasas || 0) +
          (item.TotalSaisCasas || 0),
        0
      ),
    };
  });
};

const processDurationChart3Data = (payload: RangePayload) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return philippineRegions.map((region) => {
    const result: any = { region };

    gameCategories.forEach((category) => {
      const firstRangeItems = payload.Region.FirstRange.filter(
        (item) =>
          (item.Region === region || item.Region === `Region ${region}`) &&
          item.GameCategory === category
      );
      const secondRangeItems = payload.Region.SecondRange.filter(
        (item) =>
          (item.Region === region || item.Region === `Region ${region}`) &&
          item.GameCategory === category
      );

      result[`firstRange${category.replace(/\s+/g, "")}`] =
        firstRangeItems.reduce((sum, item) => sum + item.TotalBetAmount, 0);
      result[`secondRange${category.replace(/\s+/g, "")}`] =
        secondRangeItems.reduce((sum, item) => sum + item.TotalBetAmount, 0);
    });

    return result;
  });
};

const processDurationChart5Data = (payload: RangePayload) => {
  return philippineRegions.map((region) => {
    const firstRangeItems = payload.Region.FirstRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );
    const secondRangeItems = payload.Region.SecondRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    return {
      region,
      firstRangeTumbok: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalTumbok || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalTumbok || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalSahod || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalSahod || 0),
        0
      ),
    };
  });
};

const processDurationChart6Data = (payload: RangePayload) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return philippineRegions.map((region) => {
    const result: any = { region };

    gameCategories.forEach((category) => {
      const firstRangeItems = payload.Region.FirstRange.filter(
        (item) =>
          (item.Region === region || item.Region === `Region ${region}`) &&
          item.GameCategory === category
      );
      const secondRangeItems = payload.Region.SecondRange.filter(
        (item) =>
          (item.Region === region || item.Region === `Region ${region}`) &&
          item.GameCategory === category
      );

      result[`firstRange${category.replace(/\s+/g, "")}`] =
        firstRangeItems.reduce((sum, item) => sum + item.TotalBettors, 0);
      result[`secondRange${category.replace(/\s+/g, "")}`] =
        secondRangeItems.reduce((sum, item) => sum + item.TotalBettors, 0);
    });

    return result;
  });
};

// Main processor for Date Duration
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
      console.warn("Unknown urlParam:", urlParam);
      return [];
  }
};
