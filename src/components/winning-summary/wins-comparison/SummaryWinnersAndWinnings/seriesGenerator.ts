import { formatDate } from "../utils";

export const getCategoryColor = (category: string, isFirstDate: boolean) => {
  const colorMap: Record<string, string> = {
    STLPares: isFirstDate ? "#E5C7FF" : "#D2A7FF",
    STLSwer2: isFirstDate ? "#BB86FC" : "#A06FE6",
    STLSwer3: isFirstDate ? "#875AC4" : "#6F58C9",
    STLSwer4: isFirstDate ? "#563D99" : "#3E2466",
  };
  return colorMap[category] || "#CCCCCC";
};

export const generateSeries = (
  chartData: any[],
  urlParam: string,
  dateFilter: string,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null,
  firstDateDuration: string | null,
  secondDateDuration: string | null,
  secondDurationFrom?: string | null,
  secondDurationTo?: string | null,
  p0?: number | null
) => {
  const isDuration = dateFilter === "Date Duration";

  const firstLabel = formatDate(firstDateSpecific);
  const secondLabel = formatDate(secondDateSpecific);

  if (urlParam === "1") {
    return [
      {
        data: chartData.map((item) => (item.firstDateWinners || 0) / 100000),
        label: `Winners ${firstLabel}`,
        color: "#E5C7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `${(
            chartData[context.dataIndex]?.firstDateWinners || 0
          ).toLocaleString()}`,
      },
      {
        data: chartData.map((item) => (item.secondDateWinners || 0) / 100000),
        label: `Winners ${secondLabel}`,
        color: "#D2A7FF",
        valueFormatter: (_value: number | null, context: any) =>
          `${(
            chartData[context.dataIndex]?.secondDateWinners || 0
          ).toLocaleString()}`,
      },
      {
        data: chartData.map((item) => (item.firstDateWinnings || 0) / 100000),
        label: `Winnings ${firstLabel}`,
        color: "#BB86FC",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${(
            chartData[context.dataIndex]?.firstDateWinnings || 0
          ).toLocaleString()}`,
      },
      {
        data: chartData.map((item) => (item.secondDateWinnings || 0) / 100000),
        label: `Winnings ${secondLabel}`,
        color: "#A06FE6",
        valueFormatter: (_value: number | null, context: any) =>
          `₱${(
            chartData[context.dataIndex]?.secondDateWinnings || 0
          ).toLocaleString()}`,
      },
    ];
  } else if (urlParam === "2" || urlParam === "6") {
    const withPeso = urlParam === "2";

    const formatValue = (rawValue: number | null | undefined) =>
      `${withPeso ? "₱" : ""}${(rawValue || 0).toLocaleString()}`;

    return [
      {
        data: chartData.map(
          (item: any) =>
            ((isDuration ? item.firstRangeTumbok : item.firstDateTumbok) || 0) /
            100000
        ),
        label: `Tumbok ${firstLabel}`,
        color: "#E5C7FF",
        valueFormatter: (_value: number | null, context: any) =>
          formatValue(
            chartData[context.dataIndex]?.[
              isDuration ? "firstRangeTumbok" : "firstDateTumbok"
            ]
          ),
      },
      {
        data: chartData.map(
          (item: any) =>
            ((isDuration ? item.secondRangeTumbok : item.secondDateTumbok) ||
              0) / 100000
        ),
        label: `Tumbok ${secondLabel}`,
        color: "#D2A7FF",
        valueFormatter: (_value: number | null, context: any) =>
          formatValue(
            chartData[context.dataIndex]?.[
              isDuration ? "secondRangeTumbok" : "secondDateTumbok"
            ]
          ),
      },
      {
        data: chartData.map(
          (item: any) =>
            ((isDuration ? item.firstRangeSahod : item.firstDateSahod) || 0) /
            100000
        ),
        label: `Sahod ${firstLabel}`,
        color: "#BB86FC",
        valueFormatter: (_value: number | null, context: any) =>
          formatValue(
            chartData[context.dataIndex]?.[
              isDuration ? "firstRangeSahod" : "firstDateSahod"
            ]
          ),
      },
      {
        data: chartData.map(
          (item: any) =>
            ((isDuration ? item.secondRangeSahod : item.secondDateSahod) || 0) /
            100000
        ),
        label: `Sahod ${secondLabel}`,
        color: "#A06FE6",
        valueFormatter: (_value: number | null, context: any) =>
          formatValue(
            chartData[context.dataIndex]?.[
              isDuration ? "secondRangeSahod" : "secondDateSahod"
            ]
          ),
      },
      {
        data: chartData.map(
          (item: any) =>
            ((isDuration ? item.firstRangeCasas : item.firstDateCasas) || 0) /
            100000
        ),
        label: `Casas ${firstLabel}`,
        color: "#F6C3FF",
        valueFormatter: (_value: number | null, context: any) =>
          formatValue(
            chartData[context.dataIndex]?.[
              isDuration ? "firstRangeCasas" : "firstDateCasas"
            ]
          ),
      },
      {
        data: chartData.map(
          (item: any) =>
            ((isDuration ? item.secondRangeCasas : item.secondDateCasas) || 0) /
            100000
        ),
        label: `Casas ${secondLabel}`,
        color: "#EAA9FA",
        valueFormatter: (_value: number | null, context: any) =>
          formatValue(
            chartData[context.dataIndex]?.[
              isDuration ? "secondRangeCasas" : "secondDateCasas"
            ]
          ),
      },
    ];
  } else if (urlParam === "3" || urlParam === "7") {
    const gameCategories = ["STLPares", "STLSwer2", "STLSwer3", "STLSwer4"];
    const showPeso = urlParam === "3";

    const formatWithPeso = (value: number) =>
      `${showPeso ? "₱" : ""}${value.toLocaleString()}`;

    const getValue = (item: any, key: string) => (item?.[key] || 0) / 100000;

    const getRawValue = (item: any, key: string) => item?.[key] || 0;

    return gameCategories.flatMap((category) => [
      {
        data: chartData.map((item) =>
          getValue(
            item,
            isDuration ? `firstRange${category}` : `firstDate${category}`
          )
        ),
        label: `${category.replace("STL", "STL ")} ${firstLabel}`,
        color: getCategoryColor(category, true),
        valueFormatter: (_value: number | null, context: any) =>
          formatWithPeso(
            getRawValue(
              chartData[context.dataIndex],
              isDuration ? `firstRange${category}` : `firstDate${category}`
            )
          ),
      },
      {
        data: chartData.map((item) =>
          getValue(
            item,
            isDuration ? `secondRange${category}` : `secondDate${category}`
          )
        ),
        label: `${category.replace("STL", "STL ")} ${secondLabel}`,
        color: getCategoryColor(category, false),
        valueFormatter: (_value: number | null, context: any) =>
          formatWithPeso(
            getRawValue(
              chartData[context.dataIndex],
              isDuration ? `secondRange${category}` : `secondDate${category}`
            )
          ),
      },
    ]);
  }

  return [];
};
