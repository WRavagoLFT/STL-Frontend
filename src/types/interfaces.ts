import { z, ZodSchema } from "zod";
import { User, Operator, Share } from "./types";
import { userSchema } from "~/schemas/userSchema";
import { MultiValue } from "react-select";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode; 
  sortable?: boolean;
  filterable?: boolean;
  filterKey?: keyof T | string;
  sortKey?: keyof T | string;
  filterValue?: string | ((row: T) => string);
  onFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SortableTableCellProps {
  label: string;
  sortKey: string;
  isFilterVisible?: boolean;
}

export interface CardProps<T = React.ReactNode> {
  label: string;
  textlabel?: string;
  value: T;
  color?: string;
  style?: React.CSSProperties;
}

export interface CardsPageProps<T> {
  dashboardData: T[];
  roleLabel?: string;
  textlabel?: string;
}

export interface ChartDataItem<T = unknown> {
  label: string;
  data: number[];
  color: string;
  meta?: T;
}

export interface ChartCardProps<T = unknown> {
  label: string;
  chartData: ChartDataItem<T>[];
  regions: string[];
  pageType?: "executive" | "manager" | "operator" | "kabo" | "kubrador" | "Device Information";
  title?: string;
  roleLabel?: string;
  statsPerRegion: any[];
}

export interface CustomLegendProps {
  pageType?: "executive" | "manager" | "operator" | "kabo" | "kubrador" | "Device Information";
  label: string;
}

export interface UseUsersChartsDataProps<T> {
  dashboardData: T[];
  regions: string[];
  Region: string;
}

export interface ChartsDataPageProps<T extends { region: string }> {
  dashboardData: T[];
  userType?: string;
  getUserStatus?: (user: T, date: string) => string;
  pageType?: "executive" | "manager" | "operator" | "kabo" | "kubrador" | "Device Information";
  operatorMap?: Record<number, Operator>;
}

export interface DetailedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onCreate?: () => void;
  actionsRender?: (row: T) => React.ReactNode;
  pageType?: "executive" | "manager" | "operator" | "kabo" | "kubrador" | "Device Information";
  showExportButton?: boolean;
  onExportCSV?: () => void;
  operatorMap?: Record<number, Operator>;
  statsPerRegion?: any[];
  roleId?: number;
  onClose?: () => void;
  endpoint?: { // for handle suspense
    create: string;
    update: string;
  };
  shouldOpenAsPage?: boolean;
  source?: 'users' | 'operators' | 'device';
  onAddClick?: () => void;
  onUpdateClick?: (row: T) => void; // for update modal
}

export interface ChartBarItem {
  label: string;
  color: string;
  data: number[];
}

export interface RegionUser {
  OperatorRegion?: {
    RegionFull: string;
    RegionId: number;
    RegionName: string;
  };
  region: string;
  Region?: string;
}

export interface FieldOption {
  value: string;
  label: string;
  regionId?: number; 
  provinceId?: number; 
  cityId?: number;
  selected?: boolean;
  RegionName?: string; 
  RegionId?: number; 
  ProvinceName?: string;
  ProvinceId?: number;  
  CityName?: string;
  CityId?: number;
  GameCategoryId?: number;
  GameCategory?: string;
}

export interface ReusableModalPageProps {
  title?: string;
  endpoint?: {
    create: string;
    update: string;
  };
  isOpen: boolean;
  onClose: () => void;
  //fields: Field[];
  onSuccess?: () => void;
  onSubmit?: (formData: Record<string, string>) => Promise<void>;
  children?: (props: { handleSubmit: () => void }) => React.ReactNode;
  loading?: boolean;
  formData?: Record<string, string>;
  setFormData?: (data: Record<string, string>) => void;
  additionalPayload?: Record<string, any>;
  initialUserOperatorData?: any;
  operatorMap?: Record<number, Operator>;
  layout?: 'single' | 'double'; 

  gameTypes?: any[];
  provinces?: any[];
  regions?: any[];
  cities?: any[];
  areaofoperations?: any[];
  setSelectedRegion?: (regionId: string) => void;
  setSelectedProvince?: (provinceId?: string) => void;
  schema?: ZodSchema<any>;
  onViewEditLogs?: (operatorId: number) => void;
  selectedUser?: Operator | null;
}

export interface ModalPageProps {
  open?: boolean;
  onClose?: () => void;
  //fields?: Field[];
  //pageType?: "manager" | "executive" | "operator";
  additionalPayload?: Record<string, any>;
  onFieldChange?: (name: string, value: string) => void;
  initialUserData?: any;
  operatorMap?: { [key: number]: Operator };
  gameTypes?: FieldOption[];
  provinces?: FieldOption[];
  regions?: FieldOption[];
  cities?: FieldOption[];
  selectedRegion?: string;
  selectedProvince?: string;
  onRegionSelect?: (regionId: string) => void;
  onProvinceSelect?: (provinceId?: string) => void;
  handleMultiSelect?: (fieldName: string, selectedOptions: MultiValue<FieldOption>) => void;

  setSelectedRegion?: (regionId: string) => void;
  setSelectedProvince?: (provinceId?: string) => void;
  schema: ZodSchema<any>;
}

export interface UserFieldFormPageProps {
  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
}

export interface CSVExportButtonProps {
  statsPerRegion: any[];
  pageType?: "executive" | "manager" | "operator" | "kabo" | "kubrador" | "Device Information";
  roleId?: number;
  fileName?: string;
  columns?: any[];
  operatorMap?: any[];
}

export type UserFormData = z.infer<typeof userSchema>;

export const defaultValues: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",

  operatorId: 0,
  userTypeId: 0,
  accountType: 0
};

export interface ShareBreakdownPageProps {
  totalPercentage: number;
  totalShareAmount: number;
  breakdown: Share[];
  defaultBreakdown?: Share[];
  title?: string;
}
