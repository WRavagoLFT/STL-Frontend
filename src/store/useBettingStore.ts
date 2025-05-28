import { create } from 'zustand';

// For Dashboard Cards
import getTransactionsData from '~/utils/api/transactions/get.TransactionsData.service';

const getTodayDate = () => new Date().toISOString().slice(0, 10);
const getYesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

export type categoryType = 
  'Total Bets and Bettors' |
  'Total Bets by Bet Type' |
  'Total Bettors by Bet Type' |
  'Total Bets by Game Type' |
  'Total Bettors by Game Type' |
  'Top Betting Region by Total Bets' |
  'Top Betting Region by Total Bettors';

type dateType = 'Specific Date' | 'Date Duration';

export interface BettorsandBetsSummaryProps {
  activeGameType: string;
  categoryFilter: categoryType;
  dateFilter: dateType;
  firstDateSpecific: string | null;
  secondDateSpecific: string | null;
  firstDateDuration: string | null;
  secondDateDuration: string | null;
}

interface BettingStore {
  loading: boolean,
  // For Submenus, Date type extracted from URL params
  activeGameType: string;
  categoryFilter: categoryType;
  dateFilter: dateType;
  // If Filtered by Specific Date
  firstDateSpecific: string | null;
  secondDateSpecific: string | null;
  // If Filtered by Date Duration
  firstDateDuration: string | null;
  secondDateDuration: string | null;
  cardsAggregatedData: {
    totalBettors: number;
    totalWinners: number;
    totalBets: number;
    totalPayout: number;
    totalRevenue: number;
  };
  

  // For Submenus, Date type extracted from URL params
  setGameType: (gameType: string) => void;
  setCategoryFilter: (category: categoryType) => void;
  setDateFilter: (type: dateType) => void;
  // If Filtered by Specific Datee
  setFirstDateSpecific: (date: string) => void;
  setSecondDateSpecific: (date: string) => void;
  // If Filtered by Date Duration
  setFirstDateDuration: (date: string) => void;
  setSecondDateDuration: (date: string) => void;
  fetchAndAggregateData: () => Promise<void>;
  resetFilters: () => void;
}

export const useBettingStore = create<BettingStore>((set) => ({
    loading: false,
    activeGameType: '',
    categoryFilter: 'Total Bets and Bettors',
    dateFilter: 'Specific Date',
    firstDateSpecific: getYesterdayDate(),
    secondDateSpecific: getTodayDate(),
    firstDateDuration: null,
    secondDateDuration: null,
    cardsAggregatedData: {
      totalBettors: 0,
      totalWinners: 0,
      totalBets: 0,
      totalPayout: 0,
      totalRevenue: 0,
    },
    
    setLoading: () => set((state)=> ({loading: !state.loading})),
    setGameType: (gameType) => set({ activeGameType: gameType }),
    setCategoryFilter: (category:categoryType) => set({ categoryFilter: category }),
    setDateFilter: (type:dateType) => set({ dateFilter: type }),
    setFirstDateSpecific: (date) => set({ firstDateSpecific: date }),
    setSecondDateSpecific: (date) => set({ secondDateSpecific: date }),
    setFirstDateDuration: (date) => set({ firstDateDuration: date }),
    setSecondDateDuration: (date) => set({ secondDateDuration: date }),

    // Dashboard Cards Component
    // 
    fetchAndAggregateData: async () => {
      try {
        // Fetch the data using the getTransactionsData function
        const data = await getTransactionsData<{
          TransactionDate: string;
          RegionId: number;
          Region: string;
          RegionFull: string;
          TotalBets: number;
          TotalBettors: number;
          TotalWinners: number;
          TotalBetAmount: number;
          TotalPayout: number;
          TotalEarnings: number;
        }[]>("/transactions/getHistoricalRegion", '');
        
        
        console.log(`Betting Dashboard Cards Data:`, JSON.stringify(data, null, 2))
        // Check if data is valid and is an array
        if (data && Array.isArray(data)) {
          // Aggregate the totals
          const totals = data.reduce(
            (acc, item) => {
              acc.totalBettors += item.TotalBettors;
              acc.totalWinners += item.TotalWinners;
              acc.totalBets += item.TotalBets;
              acc.totalPayout += item.TotalPayout;
              acc.totalRevenue += item.TotalEarnings;
              return acc;
            },
            {
              totalBettors: 0,
              totalWinners: 0,
              totalBets: 0,
              totalPayout: 0,
              totalRevenue: 0,
            }
          );
    
          // Update the store with the aggregated data
          set({ cardsAggregatedData: totals });
        } else {
          console.error("Unexpected data format or no data returned:", data);
        }
      } catch (error) {
        console.error("Error fetching and aggregating data:", error);
      }
    },

    

    resetFilters: () =>
      set({
        categoryFilter: 'Total Bets and Bettors',
        dateFilter: 'Specific Date',
        firstDateSpecific: null,
        secondDateSpecific: null,
        firstDateDuration: null,
        secondDateDuration: null
      }),
}));

// Map here, for Custom Legend if the Selected Date Type (Specific)
export const getLegendItemsMap_Specific = (
  categoryFilter: categoryType,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null
): { label: string; color: string }[] => {
  console.log("categoryFilter:", categoryFilter);

  const legendItemsMap: Record<categoryType, { label: string; color: string }[]> = {
    "Total Bets and Bettors": [
      {
        label: `Bettors - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Bettors - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#5050A5",
      },
      {
        label: `Bets - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#7266C9",
      },
      {
        label: `Bets - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3B3B81",
      },
    ],
    "Total Bets by Bet Type": [
      {
        label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Tumbok - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#5050A5",
      },
      {
        label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#7266C9",
      },
      {
        label: `Sahod - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3B3B81",
      },
    ],
    "Total Bettors by Bet Type": [
      {
        label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Tumbok - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#5050A5",
      },
      {
        label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#7266C9",
      },
      {
        label: `Sahod - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3B3B81",
      },
    ],
    "Total Bets by Game Type": [
      {
        label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Pares - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#5050A5",
      },
      {
        label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#7266C9",
      },
      {
        label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3B3B81",
      },
      {
        label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#875AC4",
      },
      {
        label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#563D99",
      },
      {
        label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3E2466",
      },
    ],
    "Total Bettors by Game Type": [
      {
        label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Pares - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#5050A5",
      },
      {
        label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#7266C9",
      },
      {
        label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3B3B81",
      },
      {
        label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#875AC4",
      },
      {
        label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#563D99",
      },
      {
        label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3E2466",
      },
    ],
    "Top Betting Region by Total Bets": [
      {
        label: `Ranking - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Ranking - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3E2466",
      },
    ],
    "Top Betting Region by Total Bettors": [
      {
        label: `Ranking - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Ranking - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#3E2466",
      },
    ],
  };

  return legendItemsMap[categoryFilter];
};

// Map here, for Custom Legend if the Selected Date Type (Duration)
export const getLegendItemsMap_Duration = (
  categoryFilter: categoryType,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null,
  firstDateDuration: string | null,
  secondDateDuration: string | null
): { label: string; color: string }[] => {
  console.log("categoryFilter:", categoryFilter);
  const legendItemsMap: Record<categoryType, { label: string; color: string }[]> = {
  "Total Bets and Bettors": [
    {
      label: `Bettors - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Bettors - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#5050A5",
    },
    {
      label: `Bets - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#7266C9",
    },
    {
      label: `Bets - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3B3B81",
    },
  ],
  "Total Bets by Bet Type": [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Tumbok - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#5050A5",
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#7266C9",
    },
    {
      label: `Sahod - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3B3B81",
    },
  ],
  "Total Bettors by Bet Type": [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Tumbok - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#5050A5",
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#7266C9",
    },
    {
      label: `Sahod - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3B3B81",
    },
  ],
  "Total Bets by Game Type": [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Pares - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#5050A5",
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#7266C9",
    },
    {
      label: `STL Swer2 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3B3B81",
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#875AC4",
    },
    {
      label: `STL Swer3 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#563D99",
    },
    {
      label: `STL Swer4 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3E2466",
    },
  ],
  "Total Bettors by Game Type": [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Pares - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#5050A5",
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#7266C9",
    },
    {
      label: `STL Swer2 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3B3B81",
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#875AC4",
    },
    {
      label: `STL Swer3 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#563D99",
    },
    {
      label: `STL Swer4 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#3E2466",
    },
  ],
  "Top Betting Region by Total Bets": [
    {
      label: `Ranking - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Ranking - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#5050A5",
    },
  ],
  "Top Betting Region by Total Bettors": [
    {
      label: "E5C7FF",
      color: "#E5C7FF",
    },
    {
      label: "Ranking",
      color: "#5050A5",
    },
  ],
}

return legendItemsMap[categoryFilter]
}