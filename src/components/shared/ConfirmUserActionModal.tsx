import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Close as CloseIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { verifyPass } from "~/utils/api/auth";
import { ConfirmUserActionModalProps } from "~/types/interfaces";
import axiosInstance from "~/utils/axiosInstance";
import { fetchUsers } from "~/utils/api/users";
import useUserRoleStore from "../../store/useUserStore";
import { LoginSectionData } from "~/data/LoginSectionData";

const ConfirmUserActionModalPage: React.FC<ConfirmUserActionModalProps> = ({
  formData,
  setFormData,
  setErrors,
  actionType,
  open,
  endpoint,
  onClose
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const { roleId, setData } = useUserRoleStore();

const handleVerifyUserAction = async () => {
  if (!password) {
    setError("Password is required.");
    return;
  }

  try {
    const { success: isVerified } = await verifyPass(password);
    if (!isVerified) {
      setError("Invalid password. Please try again.");
      return;
    }

    setError("");

    const isDeleting = actionType === "update"; // <-- Renamed for clarity
    const isCreating = actionType === "create";

    const userId = formData.UserId;

    if (isDeleting && !userId) {
      setError("User ID is required to delete a user.");
      return;
    }

    const endpointUrl = isDeleting ? endpoint.update : endpoint.create;

    // Normalize data to use correct field names
    const dataToSend = {
      ...(userId && { userId }),
      ...Object.entries(formData).reduce(
        (acc, [key, val]) => {
          if (val !== undefined && key !== "UserId") acc[key] = val;
          return acc;
        },
        {} as Record<string, any>
      ),
      ...(roleId && { userTypeId: roleId }),
      ...(isDeleting && { IsDeleted: 1 }), // <-- Changed from IsActive: false
    };

    const axiosCall = isDeleting ? axiosInstance.patch : axiosInstance.post;

    const response = await axiosCall(endpointUrl, dataToSend, {
      withCredentials: true,
    });

    if (!response?.data?.success) {
      const errMsg =
        response?.data?.message || `Failed to ${actionType} user.`;
      setError(errMsg);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errMsg,
        confirmButtonColor: "#D32F2F",
      });
      return;
    }

    setFormData({});
    setPassword("");
    setErrors({});
    onClose();

    if (roleId) {
      fetchUsers(roleId, setData);
    }

    await Swal.fire({
      icon: "success",
      title: isDeleting ? "User Deleted!" : "User Created!",
      text: isDeleting
        ? "The user has been marked as deleted."
        : "The user has been created successfully.",
      confirmButtonColor: "#67ABEB",
    });
  } catch (error: any) {
    console.error("Error during user action:", error);
    console.log("Full error response:", error?.response?.data);
    console.log("Endpoint URL when failed:", endpoint?.update);

    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "An unexpected error occurred.";

    setError(backendMessage);

    await Swal.fire({
      icon: "error",
      title: "Unexpected Error!",
      text: `Error while trying to ${actionType} user: ${backendMessage}`,
      confirmButtonColor: "#D32F2F",
    });
  }
};


  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative z-20 flex w-full justify-center items-center">
            <div className="w-[60%] sm:w-[60%] md:w-[40%] max-w-[430px] py-11 px-6 bg-[#F8F0E3] rounded-lg relative">
              {/* Close Button */}
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: "#ACA993",
                  padding: 0,
                  minWidth: 0,
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: "#928F7F",
                  },
                }}
              >
                <CloseIcon
                  style={{
                    fontWeight: 'bold',
                    fontSize: 22,
                    color: "#F8F0E3",
                  }}
                />
              </IconButton>

              {/* Logo + Title */}
              <div className="text-center mb-4 mt-2">
                <img
                  src={LoginSectionData.image}
                  alt="altLogo"
                  className="max-w-[35%] mx-auto mb-3"
                  loading="lazy"
                />
                <h1 className="text-3xl font-bold">
                  {LoginSectionData.ConfirmIdentity}
                </h1>
                <p className="text-xs">
                  {LoginSectionData.ConfirmIdentityDescription}
                </p>
              </div>

              <div className="px-5 mt-7">
                {/* Password Input */}
                <div className="relative w-full mb-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 pr-10 text-sm rounded-md border ${error ? "border-red-500" : "border-gray-600"} bg-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-white-200"}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  onClick={handleVerifyUserAction}
                  className="w-full py-2.5 mt-5 bg-[#F6BA12] hover:bg-[#FFD100] text-[#212121] rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmUserActionModalPage;
