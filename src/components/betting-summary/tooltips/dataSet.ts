export const translations = {
  bettors: "Bettors",
  bets: "Bets",
} as const

export const translationsGameTypes = {
  pares: "STL Pares",
  swer2: "STL Swer 2",
  swer3: "STL Swer 3",
  swer4: "STL Swer 4",
} as const;

export const translationsBets = {
  tumbok: "Tumbok",
  sahod: "Sahod",
  ramble: "Ramble",
  casas: "Casas"
}

export function addLabels<
  T extends { dataKey: "bettors" | "bets" | "ratio" }
>(series: T[]) {
  return series.map((item) => ({
    ...item,
    label:
      item.dataKey === "bettors"
        ? "Bettors"
        : item.dataKey === "bets"
        ? "Bets"
        : "Ratio",
    valueFormatter: (v: number | null) => {
      if (v === null) return "-";
      if (item.dataKey === "bets") {
        const formatted = (v * 100000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `₱ ${formatted}`;
      }
      if (item.dataKey === "ratio") {
        return `1:${v.toFixed(2)}`;
      }
      return v.toLocaleString();
    },
  }));
}



export function addLabelsBets<
  T extends { dataKey: keyof typeof translationsBets }
>(series: T[]) {
  return series.map((item) => ({
    ...item,
    label: translationsBets[item.dataKey],
    valueFormatter: (v: number | null) => {
      if (v === null) return '-';
      return (v * 100000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  }));
}

