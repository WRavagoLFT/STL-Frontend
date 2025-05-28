import React, { useState } from "react";
import { IconButton } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { verifyPass } from "~/utils/api/auth";
import { ConfirmUserActionModalProps } from "~/types/interfaces";
import axiosInstance from "~/utils/axiosInstance";
import useUserRoleStore from "../../store/useUserStore";
import { LoginSectionData } from "~/data/LoginSectionData";
import { fetchUsers } from "~/utils/api/users";

const ConfirmSuspendModal: React.FC<ConfirmUserActionModalProps> = ({
  formData,
  setFormData,
  setErrors,
  actionType,
  open,
  endpoint,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const { roleId, setData } = useUserRoleStore();
  const [remarks, setRemarks] = useState("");

  const handleVerifyUserAction = async () => {
    console.log("handleVerifyUserAction called");
    console.log("Current actionType:", actionType);
    console.log("Current password:", password);
    console.log("Current formData:", formData);

    if (!password) {
      setError("Password is required.");
      console.warn("Password validation failed: Password is required.");
      return;
    }

    try {
      console.log("Verifying password...");
      const { success: isVerified } = await verifyPass(password);
      console.log("Password verification result:", isVerified);

      if (!isVerified) {
        setError("Invalid password. Please try again.");
        console.warn("Password verification failed.");
        return;
      }

      setError("");

      const userId = formData.UserId;
      console.log("UserId from formData:", userId);

      if (!userId) {
        setError("User ID is required.");
        console.warn("User ID validation failed: No UserId in formData.");
        return;
      }
      if (!remarks.trim()) {
        setError("Remarks are required.");
        return;
      }

      if (actionType === "suspend") {
        console.log(`Suspending user with ID: ${userId}`);
        const suspendUrl = `/users/${userId}/suspend`;
        console.log("Suspend URL:", suspendUrl);

        const response = await axiosInstance.patch(
          suspendUrl,
          { remarks: remarks },
          { withCredentials: true }
        );

        console.log("Suspend response:", response);

        if (!response?.data?.success) {
          const errMsg = response?.data?.message || "Failed to suspend user.";
          setError(errMsg);
          console.error("Suspend failed:", errMsg);
          await Swal.fire({
            icon: "error",
            title: "Error!",
            text: errMsg,
            confirmButtonColor: "#D32F2F",
          });
          return;
        }

        console.log("User suspended successfully.");
        await Swal.fire({
          icon: "success",
          title: "User Suspended!",
          text: "The user has been suspended successfully.",
          confirmButtonColor: "#67ABEB",
        });
      } else if (actionType === "update") {
        console.log(
          "Update action detected. Implement your update logic here."
        );
        // Add your update code if needed
      }

      // Reset after success
      console.log("Resetting form state and closing modal...");
      setFormData({});
      setPassword("");
      setErrors({});
      onClose();

      if (roleId) {
        console.log("Fetching users for roleId:", roleId);
        fetchUsers(roleId, setData);
      }
    } catch (error: any) {
      console.error("Error during user action:", error);
      console.log("Full error response:", error?.response?.data);

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
                <div className="w-full mb-2">
                  <label
                    htmlFor="remarks"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    placeholder="Enter Remarks"
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.stopPropagation();
                      }
                    }}
                    className="w-full px-4 py-3 text-sm rounded-md border border-gray-600 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white-200"
                  />
                </div>

                {/* Password Input */}
                <div className="relative w-full mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Password
                  </label>
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
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
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

export default ConfirmSuspendModal;
