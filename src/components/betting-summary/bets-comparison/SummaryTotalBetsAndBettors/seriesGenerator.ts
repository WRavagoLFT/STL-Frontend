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
        data: typedChartData.map(
          (item) =>
            ((isDuration ? item.firstRangeBettors : item.firstDateBettors) ||
              0) / 100000
        ),
        label: `Bettors ${firstLabel}`,
        color: "#E5C7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `${(typedChartData[context.dataIndex]?.[isDuration ? "firstRangeBettors" : "firstDateBettors"] || 0).toLocaleString()}`,
      },
      {
        data: typedChartData.map(
          (item) =>
            ((isDuration ? item.secondRangeBettors : item.secondDateBettors) ||
              0) / 100000
        ),
        label: `Bettors ${secondLabel}`,
        color: "#5050A5",
        valueFormatter: (_value: number | null, context: any) =>
          `${(typedChartData[context.dataIndex]?.[isDuration ? "secondRangeBettors" : "secondDateBettors"] || 0).toLocaleString()}`,
      },
      {
        data: typedChartData.map(
          (item) =>
            ((isDuration
              ? item.secondRangeTotalBetAmount
              : item.firstDateBets) || 0) / 100000
        ),
        label: `Bets ${firstLabel}`,
        color: "#7266C9",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${(typedChartData[context.dataIndex]?.[isDuration ? "secondRangeTotalBetAmount" : "firstDateBets"] || 0).toLocaleString()}`,
      },
      {
        data: typedChartData.map(
          (item) =>
            ((isDuration
              ? item.firstRangeTotalBetAmount
              : item.secondDateBets) || 0) / 100000
        ),
        label: `Bets ${secondLabel}`,
        color: "#3B3B81",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${(typedChartData[context.dataIndex]?.[isDuration ? "firstRangeTotalBetAmount" : "secondDateBets"] || 0).toLocaleString()}`,
      },
    ];
  } else if (urlParam === "2" || urlParam === "5") {
    const typedChartData = chartData as Chart25Data[];
    if (!typedChartData.length || typedChartData.some((item) => !item)) {
      console.warn("Invalid Chart25Data:", typedChartData);
      return [];
    }

    const showPeso = urlParam === "2";
    const formatValue = (value: number) =>
      `${showPeso ? "₱" : ""}${value.toLocaleString()}`;

    const getRawValue = (item: Chart25Data, key: keyof Chart25Data) =>
      (item?.[key] as number | null) || 0;

    const series: any[] = [];

    // Tumbok
    series.push(
      {
        data: typedChartData.map(
          (item) =>
            getRawValue(
              item,
              isDuration ? "firstRangeTumbok" : "firstDateTumbok"
            ) / 100000
        ),
        label: `Tumbok ${firstLabel}`,
        color: "#E5C7FF",
        valueFormatter: (_value: number | null, context: any) => {
          const raw = getRawValue(
            typedChartData[context.dataIndex],
            isDuration ? "firstRangeTumbok" : "firstDateTumbok"
          );
          return formatValue(raw);
        },
      },
      {
        data: typedChartData.map(
          (item) =>
            getRawValue(
              item,
              isDuration ? "secondRangeTumbok" : "secondDateTumbok"
            ) / 100000
        ),
        label: `Tumbok ${secondLabel}`,
        color: "#5050A5",
        valueFormatter: (_value: number | null, context: any) => {
          const raw = getRawValue(
            typedChartData[context.dataIndex],
            isDuration ? "secondRangeTumbok" : "secondDateTumbok"
          );
          return formatValue(raw);
        },
      }
    );

    // Sahod & Casas
    if (gameCategoryId === 1 || gameCategoryId === 2 || gameCategoryId === 0) {
      series.push(
        {
          data: typedChartData.map(
            (item) =>
              getRawValue(
                item,
                isDuration ? "firstRangeSahod" : "firstDateSahod"
              ) / 100000
          ),
          label: `Sahod ${firstLabel}`,
          color: "#7266C9",
          valueFormatter: (_value: number | null, context: any) => {
            const raw = getRawValue(
              typedChartData[context.dataIndex],
              isDuration ? "firstRangeSahod" : "firstDateSahod"
            );
            return formatValue(raw);
          },
        },
        {
          data: typedChartData.map(
            (item) =>
              getRawValue(
                item,
                isDuration ? "secondRangeSahod" : "secondDateSahod"
              ) / 100000
          ),
          label: `Sahod ${secondLabel}`,
          color: "#3B3B81",
          valueFormatter: (_value: number | null, context: any) => {
            const raw = getRawValue(
              typedChartData[context.dataIndex],
              isDuration ? "secondRangeSahod" : "secondDateSahod"
            );
            return formatValue(raw);
          },
        },
        {
          data: typedChartData.map(
            (item) =>
              getRawValue(
                item,
                isDuration ? "firstRangeCasas" : "firstDateCasas"
              ) / 100000
          ),
          label: `Casas ${firstLabel}`,
          color: "#7266C9",
          valueFormatter: (_value: number | null, context: any) => {
            const raw = getRawValue(
              typedChartData[context.dataIndex],
              isDuration ? "firstRangeCasas" : "firstDateCasas"
            );
            return formatValue(raw);
          },
        },
        {
          data: typedChartData.map(
            (item) =>
              getRawValue(
                item,
                isDuration ? "secondRangeCasas" : "secondDateCasas"
              ) / 100000
          ),
          label: `Casas ${secondLabel}`,
          color: "#3B3B81",
          valueFormatter: (_value: number | null, context: any) => {
            const raw = getRawValue(
              typedChartData[context.dataIndex],
              isDuration ? "secondRangeCasas" : "secondDateCasas"
            );
            return formatValue(raw);
          },
        }
      );
    }

    // Ramble
    if (gameCategoryId === 3 || gameCategoryId === 4 || gameCategoryId === 0) {
      series.push(
        {
          data: typedChartData.map(
            (item) =>
              getRawValue(
                item,
                isDuration ? "firstRangeRamble" : "firstDateRamble"
              ) / 100000
          ),
          label: `Ramble ${firstLabel}`,
          color: "#7266C9",
          valueFormatter: (_value: number | null, context: any) => {
            const raw = getRawValue(
              typedChartData[context.dataIndex],
              isDuration ? "firstRangeRamble" : "firstDateRamble"
            );
            return formatValue(raw);
          },
        },
        {
          data: typedChartData.map(
            (item) =>
              getRawValue(
                item,
                isDuration ? "secondRangeRamble" : "secondDateRamble"
              ) / 100000
          ),
          label: `Ramble ${secondLabel}`,
          color: "#3B3B81",
          valueFormatter: (_value: number | null, context: any) => {
            const raw = getRawValue(
              typedChartData[context.dataIndex],
              isDuration ? "secondRangeRamble" : "secondDateRamble"
            );
            return formatValue(raw);
          },
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

    const showPeso = urlParam === "3";

    const formatValue = (value: number) =>
      `${showPeso ? "₱" : ""}${value.toLocaleString()}`;

    const getRawValue = (item: Chart36Data, key: keyof Chart36Data): number =>
      (item?.[key] as number | null) || 0;

    return GAME_CATEGORIES.flatMap((category) => {
      const keyPrefix = isDuration ? "firstRange" : "firstDate";
      const secondKeyPrefix = isDuration ? "secondRange" : "secondDate";
      const categoryKey = category.replace(/\s+/g, "");
      const fullKey1 = `${keyPrefix}${categoryKey}` as keyof Chart36Data;
      const fullKey2 = `${secondKeyPrefix}${categoryKey}` as keyof Chart36Data;

      return [
        {
          data: typedChartData.map(
            (item) => getRawValue(item, fullKey1) / 100000
          ),
          label: `${category.replace("STL", "STL ")} ${firstLabel}`,
          color: getCategoryColor(categoryKey, true),
          valueFormatter: (_value: number | null, context: any) =>
            formatValue(
              getRawValue(typedChartData[context.dataIndex], fullKey1)
            ),
        },
        {
          data: typedChartData.map(
            (item) => getRawValue(item, fullKey2) / 100000
          ),
          label: `${category.replace("STL", "STL ")} ${secondLabel}`,
          color: getCategoryColor(categoryKey, false),
          valueFormatter: (_value: number | null, context: any) =>
            formatValue(
              getRawValue(typedChartData[context.dataIndex], fullKey2)
            ),
        },
      ];
    });
  }

  console.warn("Unknown urlParam:", urlParam);
  return [];
};
