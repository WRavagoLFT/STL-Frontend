import { ZodSchema } from "zod";

export interface User {
  data?: any;
  userId?: number;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  email: string;
  suffix: string | null;
  operatorId: number;
  userTypeId: number;
  accountType: number;
  
  UserId?: number;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Email?: string;
  Suffix?: string | null;
  OperatorId?: number;
  UserTypeId?: number;
  
  pcsoBranchId?: number;
  BranchId?: number;
  BranchName?: string;
  AssignedArea?: string;

  cityName?: number;
  kaboId?: number;

  fullName?: string;
  DateOfRegistration?: string;
  OperatorDetails?: { OperatorName?: string } | null;

  Region?: string;
  region: string;
  LastLogin?: string;
  LastTokenRefresh?: string;
  IsActive?: number;
  Cities?: { CityId: number; CityName: string }[];
  CreatedBy?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
}

export interface Operator {
  operatorId?: number;
  name: string;
  contactNumber: string;
  dateOfOperation: string;
  email: string;
  address: string;
  gameTypes: string;
  areaOfOperations: string;
  cities: any;
  regions: any[];
  provinces: any[];
  OperatorId?: any[];

  execFirstName?: string;
  execLastName?: string;
  execSuffix?: string;
  execNumber?: string;
  execEmail?: string;
  execPassword?: string;

  Cities?: { CityId: number; CityName: string }[]; // Optional, if not always present
  data?: any; // for operator update
  OperatorName?: string;
  Executive?: string;
  OperatorEmail?: string | null;
  Status?: number; // Consider using enum if Status can be "Active" = 1, etc.
  CreatedAt?: string;
  DateOfOperation?: string;
  OperatorAddress?: string;
  OperatorContactNos?: string;
  Email?: string | null;
  ContactNo?: string;
  OperatorRepresentative?: string;
  OperatorRegion?: any; // Ideally replace `any` with a specific Region type
  Region?: any; // Same here
  Slug?: string;

  // Optional shared fields (if reused with users)
  LastLogin?: string;
  LastTokenRefresh?: string;
  UserStatusId?: number;
  DateOfRegistration?: string;
  IsActive?: number;
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



