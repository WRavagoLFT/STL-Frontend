import {
  ChartData,
  Chart1Data,
  Chart25Data,
  Chart36Data,
  getCategoryColor,
} from "../types";
import { formatDate } from "../utils";
import { GAME_CATEGORIES } from "../constant";

export const generateSeries = (
  chartData: ChartData[],
  urlParam: string,
  dateFilter: string,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null,
  firstDateDuration: string | null,
  secondDateDuration: string | null,
  secondDurationFrom: string | null,
  secondDurationTo: string | null,
  gameCategoryId?: number | null
) => {
  const isDuration = dateFilter === "Date Duration";

  const firstLabel = isDuration
    ? `${formatDate(firstDateDuration)} - ${formatDate(secondDateDuration)}`
    : formatDate(firstDateSpecific);

  const secondLabel = isDuration
    ? `${formatDate(secondDurationFrom)} - ${formatDate(secondDurationTo)}`
    : formatDate(secondDateSpecific);

  if (urlParam === "1") {
    const typedChartData = chartData as Chart1Data[];
    if (!typedChartData.length || typedChartData.some((item) => !item)) {
      console.warn("Invalid Chart1Data:", typedChartData);
      return [];
    }

    return [
      {
        data: typedChartData.map((item) => ((isDuration ? item.firstRangeWinners : item.firstDateWinners) || 0) ),
        label: `Winners ${firstLabel}`,
        color: "#E5C7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `${((typedChartData[context.dataIndex]?.[isDuration ? 'firstRangeWinners' : 'firstDateWinners'] || 0)).toLocaleString()}`,
      },
      {
        data: typedChartData.map((item) => ((isDuration ? item.secondRangeWinners : item.secondDateWinners) || 0) ),
        label: `Winners ${secondLabel}`,
        color: "#D2A7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `${((typedChartData[context.dataIndex]?.[isDuration ? 'secondRangeWinners' : 'secondDateWinners'] || 0)).toLocaleString()}`,
      },
      {
        data: typedChartData.map((item) => ((isDuration ? item.firstRangeWinnings : item.firstDateWinnings) || 0) / 100000),
        label: `Winnings ${firstLabel}`,
        color: "#BB86FC",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'firstRangeWinnings' : 'firstDateWinnings'] || 0)).toLocaleString()}`,
      },
      {
        data: typedChartData.map((item) => ((isDuration ? item.secondRangeWinnings : item.secondDateWinnings) || 0) / 100000),
        label: `Winnings ${secondLabel}`,
        color: "#A06FE6",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'secondRangeWinnings' : 'secondDateWinnings'] || 0)).toLocaleString()}`,
      },
    ];
  } else if (urlParam === "2" || urlParam === "5") {
    const typedChartData = chartData as Chart25Data[];
    if (!typedChartData.length || typedChartData.some((item) => !item)) {
      console.warn("Invalid Chart25Data:", typedChartData);
      return [];
    }

    const series: any[] = [];

    // Always show Tumbok
    series.push(
      {
        data: typedChartData.map((item) => ((isDuration ? item.firstRangeTumbok : item.firstDateTumbok) || 0) / 100000),
        label: `Tumbok ${firstLabel}`,
        color: "#E5C7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'firstRangeTumbok' : 'firstDateTumbok'] || 0)).toLocaleString()}`,
      },
      {
        data: typedChartData.map((item) => ((isDuration ? item.secondRangeTumbok : item.secondDateTumbok) || 0) / 100000),
        label: `Tumbok ${secondLabel}`,
        color: "#D2A7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'secondRangeTumbok' : 'secondDateTumbok'] || 0)).toLocaleString()}`,
      }
    );

    if (gameCategoryId === 1 || gameCategoryId === 2 || gameCategoryId == 0) {
      // Add Sahod and Casas
      series.push(
        {
          data: typedChartData.map((item) => ((isDuration ? item.firstRangeSahod : item.firstDateSahod) || 0) / 100000),
          label: `Sahod ${firstLabel}`,
          color: "#BB86FC",
          valueFormatter: (_value: number | null, context: any) =>
            `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'firstRangeSahod' : 'firstDateSahod'] || 0)).toLocaleString()}`,
        },
        {
          data: typedChartData.map((item) => ((isDuration ? item.secondRangeSahod : item.secondDateSahod) || 0) / 100000),
          label: `Sahod ${secondLabel}`,
          color: "#A06FE6",
          valueFormatter: (_value: number | null, context: any) =>
            `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'secondRangeSahod' : 'secondDateSahod'] || 0)).toLocaleString()}`,
        },
        {
          data: typedChartData.map((item) => ((isDuration ? item.firstRangeCasas : item.firstDateCasas) || 0) / 100000),
          label: `Casas ${firstLabel}`,
          color: "#BB86FC",
          valueFormatter: (_value: number | null, context: any) =>
            `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'firstRangeCasas' : 'firstDateCasas'] || 0)).toLocaleString()}`,
        },
        {
          data: typedChartData.map((item) => ((isDuration ? item.secondRangeCasas : item.secondDateCasas) || 0) / 100000),
          label: `Casas ${secondLabel}`,
          color: "#A06FE6",
          valueFormatter: (_value: number | null, context: any) =>
            `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'secondRangeCasas' : 'secondDateCasas'] || 0)).toLocaleString()}`,
        }
      );
    }

    if (gameCategoryId === 3 || gameCategoryId === 4) {
      // Add Ramble
      series.push(
        {
          data: typedChartData.map((item) => ((isDuration ? item.firstRangeRamble : item.firstDateRamble) || 0) / 100000),
          label: `Ramble ${firstLabel}`,
          color: "#BB86FC",
          valueFormatter: (_value: number | null, context: any) =>
            `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'firstRangeRamble' : 'firstDateRamble'] || 0)).toLocaleString()}`,
        },
        {
          data: typedChartData.map((item) => ((isDuration ? item.secondRangeRamble : item.secondDateRamble) || 0) / 100000),
          label: `Ramble ${secondLabel}`,
          color: "#A06FE6",
          valueFormatter: (_value: number | null, context: any) =>
            `₱${((typedChartData[context.dataIndex]?.[isDuration ? 'secondRangeRamble' : 'secondDateRamble'] || 0)).toLocaleString()}`,
        }
      );
    }

    return series;
  } else if (urlParam === "3" || urlParam === "6") {
    const typedChartData = chartData as Chart36Data[];
    if (!typedChartData.length || typedChartData.some((item) => !item)) {
      console.warn("Invalid Chart36Data:", typedChartData);
      return [];
    }

    return GAME_CATEGORIES.flatMap((category) => {
      const keyPrefix = isDuration ? "firstRange" : "firstDate";
      const secondKeyPrefix = isDuration ? "secondRange" : "secondDate";
      const categoryKey = category.replace(/\s+/g, "");

      return [
        {
          data: typedChartData.map((item) => ((item[`${keyPrefix}${categoryKey}` as keyof Chart36Data] as number) || 0) / 100000),
          label: `${category.replace("STL", "STL ")} ${firstLabel}`,
          color: getCategoryColor(category.replace(/\s+/g, ""), true),
          valueFormatter: (_value: number | null, context: any) =>
            `${((typedChartData[context.dataIndex]?.[`${keyPrefix}${categoryKey}` as keyof Chart36Data] as number) || 0).toLocaleString()}`,
        },
        {
          data: typedChartData.map((item) => ((item[`${secondKeyPrefix}${categoryKey}` as keyof Chart36Data] as number) || 0) / 100000),
          label: `${category.replace("STL", "STL ")} ${secondLabel}`,
          color: getCategoryColor(category.replace(/\s+/g, ""), false),
          valueFormatter: (_value: number | null, context: any) =>
            `${((typedChartData[context.dataIndex]?.[`${secondKeyPrefix}${categoryKey}` as keyof Chart36Data] as number) || 0).toLocaleString()}`,
        },
      ];
    });
  }

  //console.warn("Unknown urlParam:", urlParam);
  return [];
};