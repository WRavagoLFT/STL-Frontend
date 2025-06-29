import { ZodSchema } from "zod";

export interface TransactionData {
  TransactionDate: string;
  RegionId: number;
  Region: string;
  ProvinceId: number;
  Province: string;
  GameCategoryId: number;
  GameCategory: string;
  DrawOrder: 1 | 2 | 3;
  TotalBets: number;
  TotalBettors: number;
  TotalWinners: number;
  TotalBetAmount: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  TotalPayout: number;
  TotalEarnings: number;
  CombinationOne: string | null;
  CombinationTwo: string | null;
  CombinationThree: string | null;
  CombinationFour: string | null;
  DateOfTransaction?: string;
}

// for dashboard cards
export type DashboardData = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  inactiveUsers: number;
  newUsers: number;
};

// for dashboard charts
export interface LegendItem {
  color: string;
  label: string;
}

export type EditLogFields = {
  logField: string;
  EditLogDetailsId: number;
  User: string;
  EditedBy?: string;
  CreatedAt: string;
  OldValue: string;
  NewValue: string;
  Remarks: string;
  OperatorId?: number;
  EditedByName?: string;
}

export type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
};

export type FormValidationProps = {
  schema: ZodSchema<any>;
  formData: any;
  setErrors: (errors: any) => void;
  setIsVerifyModalOpen: (isOpen: boolean) => void;
};

export interface Share {
  ShareTitle: string;
  ShareType: number;
  Percentage: number;
  ShareAmount: number;
  OperationDate: number;
  OperatorBreakdown?: Record<string, number>;
}

export interface NetIncomePageProps {
  netAmount: number;
  netPercentage: number;
}

export type Branch = {
  BranchId: number;
  BranchName: string;
  //branchId: number;
};

export interface Device {
  assignmentDate: any;
  usageNotes: number;
  simNumber: number;
  telcoProvider: string;
  dataPlan: string;
  assignedUser: number;
  
  deviceId?: number;
  issuedBy?: string;
  lastknownGPS?: string;
  lastSyncTimestamp?: string;
  unauthorizedLocationAlerts?: string;
  dataStatus?: string;
  lastMaintenance?: string;
  replacementHistory?: string;
  applicationVersion?: string;
  dateInstalled?: string;
  lastLoginTime?: string;
  lastAppUpdated?: string;
  OperatorName?: string;
  remarks?: string;

  CreatedAt?: string;

  DeviceId?: number;
  AssignmentDate?: string;
  AssignedUser?: string;
  IssuedBy?: string;
  UsageNotes?: string;
  SIMNumber?: string;
  TelcoProvider?: string;
  DataPlan?: string;
  LastSyncTimestamp?: string;
  DeviceStatus?: string;
  LastMaintenanceDate?: string | null;
  LastReplacementDate?: string | null;
  ApplicationVersion?: string | null;
  DateApplicationInstalled?: string | null;
  DateApplicationUpdated?: string | null;
  LastLoginTime?: string;
}

export type RoleConfig = {
  label: string;
  textlabel: string;
  roleId: number;
  permittedUserTypes: number[];
};

export type GameCombination = {
  gameType?: number; 
  provinceId?: number;
  combinationOne?: number;
  combinationTwo?: number;
  combinationThree?: number;
  combinationFour?: number;
  gameSchedule?: number;
  //gameTypeId?: number;
}



