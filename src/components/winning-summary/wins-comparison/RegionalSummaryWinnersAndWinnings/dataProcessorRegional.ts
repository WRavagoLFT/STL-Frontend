import { RegionSpecificData, RegionRangeData, RangePayload } from "../types";
import { philippineRegions } from "../constant";

export const processChart1Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  return philippineRegions.map((region) => {
    const allRegionItems = payload.Region.flat().filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    const firstDateItems = allRegionItems.filter((item) =>
      datesMatch(item.DateOfWinningCombination, firstDate)
    );
    const secondDateItems = allRegionItems.filter((item) =>
      datesMatch(item.DateOfWinningCombination, secondDate)
    );

    return {
      region,
      firstDateWinners: firstDateItems.reduce(
        (sum, item) => sum + item.TotalWinners,
        0
      ),
      secondDateWinners: secondDateItems.reduce(
        (sum, item) => sum + item.TotalWinners,
        0
      ),
      firstDateWinnings: firstDateItems.reduce(
        (sum, item) => sum + item.TotalPayoutAmount,
        0
      ),
      secondDateWinnings: secondDateItems.reduce(
        (sum, item) => sum + item.TotalPayoutAmount,
        0
      ),
    };
  });
};

export const processChart2Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  return philippineRegions.map((region) => {
    const allRegionItems = payload.Region.flat().filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    const firstDateItems = allRegionItems.filter((item) =>
      datesMatch(item.DateOfWinningCombination, firstDate)
    );
    const secondDateItems = allRegionItems.filter((item) =>
      datesMatch(item.DateOfWinningCombination, secondDate)
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
    };
  });
};

export const processChart3Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
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
        datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondDateItems = allItems.filter((item) =>
        datesMatch(item.DateOfWinningCombination, secondDate)
      );

      result[`firstDate${category.replace(/\s+/g, "")}`] =
        firstDateItems.reduce((sum, item) => sum + item.TotalTumbokPayouts, 0);
      result[`secondDate${category.replace(/\s+/g, "")}`] =
        secondDateItems.reduce((sum, item) => sum + item.TotalSahodPayouts, 0);
    });

    return result;
  });
};

export const processChart5Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
) => {
  return philippineRegions.map((region) => {
    const allRegionItems = payload.Region.flat().filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    const firstDateItems = allRegionItems.filter((item) =>
      datesMatch(item.DateOfWinningCombination, firstDate)
    );
    const secondDateItems = allRegionItems.filter((item) =>
      datesMatch(item.DateOfWinningCombination, secondDate)
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
    };
  });
};

export const processChart6Data = (
  payload: { Region: Array<RegionSpecificData[]> },
  firstDate: string,
  secondDate: string,
  datesMatch: (dateString1: string, dateString2: string) => boolean
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
        datesMatch(item.DateOfWinningCombination, firstDate)
      );
      const secondDateItems = allItems.filter((item) =>
        datesMatch(item.DateOfWinningCombination, secondDate)
      );

      result[`firstDate${category.replace(/\s+/g, "")}`] =
        firstDateItems.reduce((sum, item) => sum + item.TotalTumbokWinners, 0);
      result[`secondDate${category.replace(/\s+/g, "")}`] =
        secondDateItems.reduce((sum, item) => sum + item.TotalSahodWinners, 0);
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
  if (!payload || !payload.Region) {
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
      console.warn("Unknown urlParam:", urlParam);
      return [];
  }
};

export const processDurationChart1Data = (payload: RangePayload) => {
  return philippineRegions.map((region) => {
    const firstRangeItems = payload.Region.FirstRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );
    const secondRangeItems = payload.Region.SecondRange.filter(
      (item) => item.Region === region || item.Region === `Region ${region}`
    );

    return {
      region,
      firstRangeWinners: firstRangeItems.reduce(
        (sum, item) => sum + item.TotalWinners,
        0
      ),
      secondRangeWinners: secondRangeItems.reduce(
        (sum, item) => sum + item.TotalWinners,
        0
      ),
      firstRangeWinnings: firstRangeItems.reduce(
        (sum, item) => sum + item.TotalPayoutAmount,
        0
      ),
      secondRangeWinnings: secondRangeItems.reduce(
        (sum, item) => sum + item.TotalPayoutAmount,
        0
      ),
    };
  });
};

export const processDurationChart2Data = (payload: RangePayload) => {
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
        (sum, item) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Tumbok || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum, item) => sum + (item.BetTypes?.Sahod || 0),
        0
      ),
    };
  });
};

export const processDurationChart3Data = (payload: RangePayload) => {
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
        firstRangeItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0);
      result[`secondRange${category.replace(/\s+/g, "")}`] =
        secondRangeItems.reduce((sum, item) => sum + item.TotalPayoutAmount, 0);
    });

    return result;
  });
};

export const processDurationChart5Data = (payload: RangePayload) => {
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
        (sum, item) => sum + (item.TotalTumbokWinners || 0),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalTumbokWinners || 0),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalSahodWinners || 0),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalSahodWinners || 0),
        0
      ),
    };
  });
};

export const processDurationChart6Data = (payload: RangePayload) => {
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
        firstRangeItems.reduce((sum, item) => sum + item.TotalWinners, 0);
      result[`secondRange${category.replace(/\s+/g, "")}`] =
        secondRangeItems.reduce((sum, item) => sum + item.TotalWinners, 0);
    });

    return result;
  });
};

export const processDurationPayload = (urlParam: string, payload: any) => {
  if (
    !payload ||
    !payload.Region ||
    !payload.Region.FirstRange ||
    !payload.Region.SecondRange
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
