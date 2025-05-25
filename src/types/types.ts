import { ZodSchema } from "zod";

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

export interface User {
  userId?: number;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  email: string;
  suffix: string | null;
  operatorId: number;
  userTypeId: number;

  fullName?: string; // Consider making this a computed field on the frontend
  DateOfRegistration?: string;
  OperatorDetails?: {
    OperatorName?: string;
  };
  Region?: string; // Remove this if 'region' below is preferred
  region?: string;
  LastLogin?: string;
  LastTokenRefresh?: string;
  IsActive?: number;
  Cities?: { CityId: number; CityName: string }[];
}

// Define the Operator type
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

  data?: any; // for operator update
  OperatorId?: number;
  OperatorName?: string;
  Executive?: string;
  OperatorEmail?: string | null;
  Status?: number; // Consider using enum if Status can be "Active" = 1, etc.
  CreatedAt?: string;
  DateOfOperation?: string;
  Cities?: { CityId: number; CityName: string }[];
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

export type EditLogFields = {
  logField: string;
  EditLogDetailsId: number;
  User: string;
  EditedBy: string;
  CreatedAt: string;
  OldValue: string;
  NewValue: string;
  Remarks: string;
  
  OperatorId?: number;
}

export interface RoleConfig {
  userTypeId: number;
  endpoint: {
    create: string;
    update: string;
  };
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    gridSpan: number;
    options?: { value: string; label: string }[];
  }[];
}

export interface operatorConfig {
  userTypeId: number;
  endpoint: {
    create: string;
    update: string;
  };
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    gridSpan: number;
    options?: { value: string; label: string }[];
  }[];
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



