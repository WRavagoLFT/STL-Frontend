// this is a dyanamic handling of router based on usertype id.
// usage of this is for error 404 and api login.

import axiosInstance from "./axiosInstance";

export const handleRouter = async (router: any) => {
  try {
    const userResponse = await axiosInstance.get("/users/getCurrentUser");
    const user = userResponse.data;
    const userTypeId = user?.data?.UserTypeId;

    let targetPath = "";

    switch (userTypeId) {
      case 3:
      case 4:
      case 6:
        targetPath = "/dashboard";
        break;
      case 5:
        targetPath = "/draw-summary";
        break;
      default:
        console.warn("Unrecognized userTypeId:", userTypeId);
        return;
    }

    if (router.pathname !== targetPath) {
      router.push(targetPath);
    }

  } catch (err) {
    console.error("Failed to get user info", err);
  }
};

