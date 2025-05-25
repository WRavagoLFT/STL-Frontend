// store/dashboardStore.ts
import { create } from "zustand";
import dayjs from "dayjs";
import { ChartBarItem } from "~/types/interfaces";

export interface DashboardData {
  LastLogin?: string;
  LastTokenRefresh?: string;
  UserStatusId?: number;
  DateOfRegistration?: string;
  IsActive?: number;
}

export interface DashboardState {
  roleConfig: { label: string; roleId: number } | null;
  dashboardData: DashboardData[];
  chartData: ChartBarItem[];
  sevenDaysAgo: dayjs.Dayjs;

  setDashboardData: (data: DashboardData[]) => void;
  setRoleConfig: (config: { label: string; roleId: number } | null) => void;
  updateThreshold: (days: number) => void;
  setChartData: (data: ChartBarItem[]) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: [],
  sevenDaysAgo: dayjs().subtract(7, "days"),
  roleConfig: null,
  chartData: [],

  setRoleConfig: (config) => set({ roleConfig: config }),
  setDashboardData: (data) => set({ dashboardData: data }),
  updateThreshold: (days) =>
    set({ sevenDaysAgo: dayjs().subtract(days, "days") }),
  setChartData: (data) => set({ chartData: data }),
}));

export default useDashboardStore;