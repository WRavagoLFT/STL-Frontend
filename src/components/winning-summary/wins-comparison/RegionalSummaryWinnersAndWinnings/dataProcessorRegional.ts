import { RegionSpecificData, RangePayload } from "../types";
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
        (sum, item) => sum + (item.TotalTumbokPayouts || 0),
        0
      ),
      secondDateTumbok: secondDateItems.reduce(
        (sum, item) => sum + (item.TotalTumbokPayouts || 0),
        0
      ),
      firstDateSahod: firstDateItems.reduce(
        (sum, item) => sum + (item.TotalSahodPayouts || 0),
        0
      ),
      secondDateSahod: secondDateItems.reduce(
        (sum, item) => sum + (item.TotalSahodPayouts || 0),
        0
      ),

      // CASAS
      firstDateCasas: firstDateItems.reduce(
        (sum, item) => sum + (item.TotalSahodPayouts || 0),
        0
      ),
      secondDateCasas: secondDateItems.reduce(
        (sum, item) => sum + (item.TotalSahodPayouts || 0),
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
    //console.warn("Invalid payload structure", payload);
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

interface RegionRangeData {
  RegionName: string;
  FirstRange: { TotalWinners?: number; TotalPayoutAmount?: number }[];
  SecondRange: { TotalWinners?: number; TotalPayoutAmount?: number }[];
}
export const processDurationChart1Data = (payload: { Region: RegionRangeData[] }) => {
  return payload.Region.map((regionData) => {
    const region = regionData.RegionName || "Unknown Region";

    const firstRangeItems = regionData.FirstRange || [];
    const secondRangeItems = regionData.SecondRange || [];

    return {
      region,
      firstRangeWinners: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalWinners || 0),
        0
      ),
      secondRangeWinners: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalWinners || 0),
        0
      ),
      firstRangeWinnings: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalPayoutAmount || 0),
        0
      ),
      secondRangeWinnings: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalPayoutAmount || 0),
        0
      ),
    };
  });
};

export const processDurationChart2Data = (payload: RangePayload) => {
  return philippineRegions.map((regionName) => {
    const regionBlock = payload.Region.find(
      (r: any) =>
        r.Region === regionName ||
        r.RegionName === regionName ||
        r.Region === `Region ${regionName}` ||
        r.RegionName === `Region ${regionName}`
    ) as { FirstRange?: any[]; SecondRange?: any[] };

    const firstRangeItems = regionBlock?.FirstRange ?? [];
    const secondRangeItems = regionBlock?.SecondRange ?? [];

    return {
      region: regionName,
      firstRangeTumbok: firstRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalTumbokPayouts || 0) / 10000),
        0
      ),
      secondRangeTumbok: secondRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalTumbokPayouts || 0) / 10000),
        0
      ),
      firstRangeSahod: firstRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalSahodPayouts || 0) / 10000),
        0
      ),
      secondRangeSahod: secondRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalSahodPayouts || 0) / 10000),
        0
      ),
      firstRangeRamble: firstRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalRamblePayouts || 0) / 10000),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum: number, item: any) => sum + ((item.TotalRamblePayouts || 0) / 10000),
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

export const processDurationChart3Data = (payload: RangePayload) => {
  const gameCategories = ["STL Pares", "STL Swer2", "STL Swer3", "STL Swer4"];

  return philippineRegions.map((regionName) => {
    const result: any = { region: regionName };

    // Find the region block from the payload
    const regionBlock = payload.Region.find(
      (r: any) =>
        r.Region === regionName ||
        r.RegionName === regionName ||
        r.Region === `Region ${regionName}` ||
        r.RegionName === `Region ${regionName}`
    ) as {
      FirstRange?: any[];
      SecondRange?: any[];
    };

    const firstRange = regionBlock?.FirstRange ?? [];
    const secondRange = regionBlock?.SecondRange ?? [];

    gameCategories.forEach((category) => {
      const firstRangeItems = firstRange.filter(
        (item: any) => item.GameCategory === category
      );
      const secondRangeItems = secondRange.filter(
        (item: any) => item.GameCategory === category
      );

      result[`firstRange${category.replace(/\s+/g, "")}`] = firstRangeItems.reduce(
        (sum: number, item: any) => sum + (item.TotalPayoutAmount || 0),
        0
      );
      result[`secondRange${category.replace(/\s+/g, "")}`] = secondRangeItems.reduce(
        (sum: number, item: any) => sum + (item.TotalPayoutAmount || 0),
        0
      );
    });

    return result;
  });
};

export const processDurationChart5Data = (payload: RangePayload) => {
  return philippineRegions.map((regionName) => {
    const regionData = payload.Region.find((r: any) =>
      r.Region === regionName ||
      r.RegionName === regionName ||
      r.Region === `Region ${regionName}` ||
      r.RegionName === `Region ${regionName}`
    ) as {
      FirstRange?: {
        TotalTumbokWinners?: number;
        TotalSahodWinners?: number;
        TotalRambleWinners?: number;
        TotalCasasWinners?: number;
      }[];
      SecondRange?: {
        TotalTumbokWinners?: number;
        TotalSahodWinners?: number;
        TotalRambleWinners?: number;
        TotalCasasWinners?: number;
      }[];
    } | undefined;

    const firstRangeItems = regionData?.FirstRange ?? [];
    const secondRangeItems = regionData?.SecondRange ?? [];

    return {
      region: regionName,
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
      firstRangeRamble: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalRambleWinners || 0),
        0
      ),
      secondRangeRamble: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalRambleWinners || 0),
        0
      ),
      firstRangeCasas: firstRangeItems.reduce(
        (sum, item) => sum + (item.TotalCasasWinners || 0),
        0
      ),
      secondRangeCasas: secondRangeItems.reduce(
        (sum, item) => sum + (item.TotalCasasWinners || 0),
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
  if (!payload || !payload.Region) {
    console.warn("Missing payload or Region", payload);
    return [];
  }

  if (!Array.isArray(payload.Region)) {
    console.warn("Missing or invalid 'Region' property in payload", payload);
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
      return [];
  }
};

