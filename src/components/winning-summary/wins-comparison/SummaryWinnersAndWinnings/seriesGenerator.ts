import { formatDate } from '../utils';

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
  secondDateDuration: string | null
) => {
  const isDuration = dateFilter === "Date Duration";

  const firstLabel = isDuration
    ? `${formatDate(firstDateSpecific)} - ${formatDate(secondDateSpecific)}`
    : formatDate(firstDateSpecific);

  const secondLabel = isDuration
    ? `${formatDate(firstDateDuration)} - ${formatDate(secondDateDuration)}`
    : formatDate(secondDateSpecific);

  if (urlParam === "1") {
    return [
      {
        data: chartData.map((item: any) =>
          isDuration ? item.firstRangeWinners : item.firstDateWinners
        ),
        label: `Winners ${firstLabel}`,
        color: "#E5C7FF",
      },
      {
        data: chartData.map((item: any) =>
          isDuration ? item.secondRangeWinners : item.secondDateWinners
        ),
        label: `Winners ${secondLabel}`,
        color: "#D2A7FF",
      },
      {
        data: chartData.map((item: any) =>
          isDuration ? item.firstRangeWinnings : item.firstDateWinnings
        ),
        label: `Winnings ${firstLabel}`,
        color: "#BB86FC",
      },
      {
        data: chartData.map((item: any) =>
          isDuration ? item.secondRangeWinnings : item.secondDateWinnings
        ),
        label: `Winnings ${secondLabel}`,
        color: "#A06FE6",
      },
    ];
  } else if (urlParam === "2" || urlParam === "5") {
    return [
      {
        data: chartData.map((item: any) =>
          isDuration ? item.firstRangeTumbok : item.firstDateTumbok
        ),
        label: `Tumbok ${firstLabel}`,
        color: "#E5C7FF",
      },
      {
        data: chartData.map((item: any) =>
          isDuration ? item.secondRangeTumbok : item.secondDateTumbok
        ),
        label: `Tumbok ${secondLabel}`,
        color: "#D2A7FF",
      },
      {
        data: chartData.map((item: any) =>
          isDuration ? item.firstRangeSahod : item.firstDateSahod
        ),
        label: `Sahod ${firstLabel}`,
        color: "#BB86FC",
      },
      {
        data: chartData.map((item: any) =>
          isDuration ? item.secondRangeSahod : item.secondDateSahod
        ),
        label: `Sahod ${secondLabel}`,
        color: "#A06FE6",
      },
    ];
  } else if (urlParam === "3" || urlParam === "6") {
    const gameCategories = ["STLPares", "STLSwer2", "STLSwer3", "STLSwer4"];
    return gameCategories.flatMap((category) => [
      {
        data: chartData.map((item: any) =>
          isDuration
            ? item[`firstRange${category}`]
            : item[`firstDate${category}`]
        ),
        label: `${category.replace("STL", "STL ")} ${firstLabel}`,
        color: getCategoryColor(category, true),
      },
      {
        data: chartData.map((item: any) =>
          isDuration
            ? item[`secondRange${category}`]
            : item[`secondDate${category}`]
        ),
        label: `${category.replace("STL", "STL ")} ${secondLabel}`,
        color: getCategoryColor(category, false),
      },
    ]);
  }
  return [];
};