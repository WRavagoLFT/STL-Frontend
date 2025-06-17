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
//  labels and value formatters
//  T a generic of type, but with restriction
//  Any object of type T must have a property called dataKey
//  The value of that dataKey must be one of the keys of translations.
//  series is a parameter, an array of type T
//  each element in the array must match the rules of T.

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

// sample data
export const TodaysBettorsAndBetsData = [
  { 
    draw: "First Draw", 
    bettors: 30.44695, 
    bets: 92.11335 
  },
  { 
    draw: "Second Draw", 
    bettors: 27.81, 
    bets: 82.15   
  },
  { draw: "Third Draw", 
    bettors: 21.67, 
    bets: 78.90       
  },
];

// sample data
export const TodaysBettorCountByGameTypeData = [
  { 
    draw: "First Draw", 
    STL_Pares: 23.45, 
    STL_Swer2: 18.67,
    STL_Swer3: 22.14,
    STL_Swer4: 19.88,
  },
  { 
    draw: "Second Draw", 
    STL_Pares: 30.25, 
    STL_Swer2: 22.09,
    STL_Swer3: 25.78,
    STL_Swer4: 23.01,    
  },
  { draw: "Third Draw", 
    STL_Pares: 27.81, 
    STL_Swer2: 20.43,
    STL_Swer3: 24.65,
    STL_Swer4: 21.76,
  },
];
