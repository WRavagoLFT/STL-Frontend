import axiosInstance from "../axiosInstance";

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export interface OperatorsItem {
  data?: any;
  OperatorId: number;
  OperatorName: string;
  CreatedAt: string; // ISO Date string
  CreatedBy: string;
  Status: number;
  OperatorEmail: string;
  DateOfOperation: string; // ISO Date string
  AreaOfOperations: string | null;
  OperatorAddress: string;
  OperatorContactNos: string;
  OperatorRepresentative: string;
  IsDeleted: number;
  Email: string;
  Executive: string;
  ContactNo: string;
  Managers: {
    Name: string;
  }[];
  Cities: {
    CityId: number;
    CityName: string;
  }[];
  Region: {
    RegionId: number;
    RegionName: string;
    RegionFull: string;
    PSGC: string;
  };
  GameTypes: {
    GameCategory: string;
    GameCategoryId: number;
  }[];
  LastUpdatedBy: string;
  LastUpdatedDate: string; // ISO Date string

  LastLogin?: string;
  LastTokenRefresh?: string;
  UserStatusId?: number;
  RegionName?: string;
  BranchRegion?: string;
  OperatorRegion?: {
    RegionId: number;
    RegionName: string;
    RegionFull: string;
  };
}

export interface OperatorsResponse {
  success: boolean;
  data: OperatorsItem[];
  message?: string;
}

export interface AddOperatorPayload {
  name: string;
  dateOfOperation: string;
  email: string;
  contactNumber: number;
  address: string;
  cities: number;
  gameTypes: number;
  areaOfOperations: number;

  execFirstName: string;
  execLastName: string;
  execSuffix: string;
  execNumber: number;
  execEmail: string;
  execPassword: string;

  tumbokMultiplier?: number;
  sahodMultiplier?: number;
  rambleMultiplier?: number;
  tresCasasMultiplier?: number;
  saisCasasMultiplier?: number;
  dyisCasasMultiplier?: number;

  regions?: string;
  provinces?: string;
}

export interface UpdateOperatorPayload {
  name: string;
  dateOfOperation: string;
  email: string;
  contactNumber: number;
  address: string;
  cities: number;
  gameTypes: number;
  areaOfOperations: number;

  execFirstName: string;
  execLastName: string;
  execSuffix: string;
  execNumber: number;
  execEmail: string;
  execPassword: string;

  tumbokMultiplier?: number;
  sahodMultiplier?: number;
  rambleMultiplier?: number;
  tresCasasMultiplier?: number;
  saisCasasMultiplier?: number;
  dyisCasasMultiplier?: number;
  operatorId?: number;
}

export const fetchOperators = async (): Promise<OperatorsResponse> => {
  const url = validateRelativeUrl("/operators/getOperators");
  const response = await axiosInstance.get<OperatorsResponse>(url);
  return response.data;
};

export const addOperator = async (payload: AddOperatorPayload): Promise<OperatorsResponse> => {
  const url = validateRelativeUrl("operators/addOperator");
  const response = await axiosInstance.post<OperatorsResponse>(url, payload);
  return response.data;
};

export const updateOperator = async (payload: UpdateOperatorPayload): Promise<OperatorsResponse> => {
  const url = validateRelativeUrl("operators/editOperator");
  const response = await axiosInstance.patch<OperatorsResponse>(url, payload);
  return response.data;
};

export const editLogOperator = async (operatorId: number): Promise<OperatorsResponse> => {
  const url = validateRelativeUrl(`/operators/getOperatorEdits/${operatorId}`);
  const response = await axiosInstance.get<OperatorsResponse>(url);
  return response.data;
};
