import axiosInstance from '../axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export interface DeviceItem {
  DeviceId: number;
  AssignmentDate: string;
  IssuedBy: string;
  UsageNotes: string;
  SIMNumber: string;
  TelcoProvider: string;
  DataPlan: string;
  LastSyncTimestamp: string;
  DeviceStatus: string;
  OperatorName: string;
  AssignedUser: string;
  LastMaintenanceDate: string | null;
  LastReplacementDate: string | null;
  ApplicationVersion: string;
  DateApplicationInstalled: string;
  DateApplicationUpdated: string;
  LastLoginTime: string;
  CreatedAt: string;

  lastknownGPS?: string;
  unauthorizedLocationAlerts?: string;
  remarks?: string;
}

export interface DeviceResponse {
  success: boolean;
  data: DeviceItem[];
  message?: string;
}

export const fetchDevices = async (): Promise<DeviceResponse> => {
  const url = validateRelativeUrl("/devices");
  const response = await axiosInstance.get<DeviceResponse>(url);
  return response.data;
};

export const fetchDeviceById = async (deviceId: number): Promise<DeviceResponse> => {
  const url = validateRelativeUrl(`/devices/?deviceId=${deviceId}`);
  const response = await axiosInstance.get<DeviceResponse>(url);
  return response.data;
};

export interface UsageNotesItem {
  DeviceUsageNotesId: number;
  DeviceUsageNotes: string;
}

export interface UsageNotesResponse {
  success: boolean;
  data: UsageNotesItem[];
  message?: string;
} 

export const fetchUsageNotes = async (): Promise<UsageNotesResponse> => {
  const url = validateRelativeUrl("/devices/usage-notes");
  const response = await axiosInstance.get<UsageNotesResponse>(url);
  return response.data;
};

export const editLogDevice = async (deviceId: number): Promise<UsageNotesResponse> => {
  const url = validateRelativeUrl(`/devices/${deviceId}/edit-log`);
  const response = await axiosInstance.get<UsageNotesResponse>(url);
  return response.data;
};

export interface AddDevicePayload {
  assignmentDate: string;
  usageNotes: number;
  simNumber: number;
  telcoProvider: string;
  dataPlan: string;

  issuedBy?: string;
  lastknownGPS?: string;
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
  lastSyncTimestamp?: string;
}

export interface AddDeviceResponse {
  success: boolean;
  data: AddDevicePayload[];
  message?: string;
}

export const addDevice = async (payload: AddDevicePayload): Promise<AddDeviceResponse> => {
  const url = validateRelativeUrl("/devices/");
  const response = await axiosInstance.post<AddDeviceResponse>(url, payload);
  return response.data;
};

export interface UpdateDevicePayload {
  deviceId: any;
  assignmentDate: string;
  usageNotes: number;
  simNumber: number;
  telcoProvider: string;
  dataPlan: string;

  issuedBy?: string;
  lastknownGPS?: string;
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
  lastSyncTimestamp?: string;
}


export interface UpdateDeviceResponse {
  success: boolean;
  data: UpdateDevicePayload[];
  message?: string;
}

export const updateDevice = async (deviceId: number, payload: UpdateDevicePayload ): Promise<UpdateDeviceResponse> => {
  const url = validateRelativeUrl(`/devices/${deviceId}`);
  const response = await axiosInstance.patch<UpdateDeviceResponse>(url, payload);
  return response.data;
};

