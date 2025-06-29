import axiosInstance from "../axiosInstance";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error("Absolute URLs are not allowed.");
  }
  return url;
};

export interface UsersItem {
  OperatorDetails: any;
  UserId: number;
  FirstName: string;
  LastName: string;
  Suffix: string | null;
  UserTypeId: number;
  CreatedBy: number | null;
  Email: string;
  PhoneNumber: string;
  SupervisorName: string | null;
  DeviceId: string | null;
  LastLogin?: string | null;
  LastTokenRefresh?: string | null;
  DateOfRegistration?: string;
  UserStatusId: number;
  IsDeleted: number;
  IsVerified: number;
  VerifiedAt: string | null;
  LastUpdatedBy: number | null;
  LastUpdatedDate: string | null;
  BranchId: number;
  BranchName: string;
  BranchRegion: number;
  Region?: any;
  AssignedArea?: string;
  OperatorId?: number;
  userId?: number;
}

export interface AddUserPayload {
  firstName: string;
  lastName: string;
  suffix: string;
  password: string;
  phoneNumber: number;
  email: string;
  userTypeId: number;
  operatorId: number;

  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;

  pcsoBranchId: number;
  cityName: number;
  kaboId: number;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  suffix: string;
  password: string;
  phoneNumber: number;
  email: string;
  userTypeId: number;
  operatorId: number;

  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;

  pcsoBranchId: number;
  cityName: number;
  kaboId: number;
  userId?: number;
  data: UsersItem;
}

export interface UsersResponse {
  success: boolean;
  data: UsersItem[];
  message?: string;
}

export const fetchUsers = async (): Promise<UsersResponse> => {
  const url = validateRelativeUrl("/users/getUsers");
  const response = await axiosInstance.get<UsersResponse>(url);
  return response.data;
};

export const addUsers = async (payload: AddUserPayload): Promise<UsersResponse> => {
  const url = validateRelativeUrl("users/addUser");
  const response = await axiosInstance.post<UsersResponse>(url, payload);
  return response.data;
};

export const updateUser = async (payload: UpdateUserPayload): Promise<UsersResponse> => {
  const url = validateRelativeUrl("users/edituser");
  const response = await axiosInstance.patch<UsersResponse>(url, payload);
  return response.data;
};

export const editLogUser = async (userId: number): Promise<UsersResponse> => {
  const url = validateRelativeUrl(`/users/getEditLog?userId=${userId}`);
  const response = await axiosInstance.get<UsersResponse>(url);
  return response.data;
};

export const suspendUser = async (userId: number, remarks?: string): Promise<UsersResponse> => {
  const url = validateRelativeUrl(`/users/${userId}/suspend`);
  const response = await axiosInstance.get<UsersResponse>(url);
  return response.data;
};

// Fetch user by ID function
export const fetchUserById = async (userId: string | number) => {
  try {
    const url = validateRelativeUrl("/users/getUsers");
    const response = await axiosInstance.get(url, {
      params: { userId },
    });

    if (Array.isArray(response.data.data)) {
      const user = response.data.data.find((u: any) => u.UserId == userId);

      if (user) {
        // Compute status if missing
        user.Status = user.IsActive ? "Active" : "Inactive";

        // Format date in "YYYY/MM/DD" format
        if (user.DateOfRegistration) {
          const date = new Date(user.DateOfRegistration);
          user.formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
        } else {
          user.formattedDate = "N/A";
        }
      }

      return {
        success: !!user,
        message: user ? "User found" : "User not found",
        data: user || {},
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: {} };
  }
};
