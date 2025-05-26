import React, { useState } from "react";
import { IconButton } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { verifyPass } from "~/utils/api/auth";
import axiosInstance from "~/utils/axiosInstance";
import useUserRoleStore from "../../store/useUserStore";
import { LoginSectionData } from "~/data/LoginSectionData";

export interface ConfirmUserActionModalProps {
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  actionType: "create" | "update" | "delete" | string;
  open: boolean;
  onClose: () => void;
  resourceType: keyof Endpoints; // e.g. "user" or "operator"
  endpoints: Endpoints;
  onConfirm?: () => void;
}

interface Endpoints {
  user?: {
    add?: string;
    update?: string;
    delete?: string;
  };
  operator?: {
    add?: string;
    update?: string;
    delete?: string;
  };
  // Add more resource types if needed
}

const ConfirmUserActionModalPage: React.FC<ConfirmUserActionModalProps> = ({
  formData,
  setFormData,
  setErrors,
  actionType,
  open,
  onClose,
  resourceType,
  endpoints,
  onConfirm,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const { roleId, setData } = useUserRoleStore();

  // Validate endpoints exist for the resourceType
  const resourceEndpoints = endpoints[resourceType];
  if (!resourceEndpoints) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="bg-white p-4 rounded shadow max-w-sm">
          <p className="text-red-600">
            No API endpoints configured for resource: {resourceType}
          </p>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleVerifyUserAction = async () => {
    console.log("handleVerifyUserAction started");
    if (!password.trim()) {
      console.log("Password validation failed: empty password");
      setError("Password is required.");
      return;
    }
    setLoading(true);

    try {
      console.log("Verifying password...");
      const { success: isVerified } = await verifyPass(password);
      console.log("Password verification result:", isVerified);

      if (!isVerified) {
        console.log("Invalid password entered");
        setError("Invalid password. Please try again.");
        setLoading(false);
        return;
      }

      setError("");

      const isUpdating = actionType === "update";
      const isCreating = actionType === "create";
      const isDeleting = actionType === "delete";

      console.log("Action Type:", actionType);

      const userId = formData.UserId;
      if ((isUpdating || isDeleting) && !userId) {
        console.log("Missing UserId for update/delete action");
        setError("User ID is required.");
        setLoading(false);
        return;
      }

      // Prepare data to send, exclude UserId for creation
      const dataToSend = {
        ...(userId && { userId }),
        ...Object.entries(formData).reduce((acc, [key, val]) => {
          if (val !== undefined && key !== "UserId") acc[key] = val;
          return acc;
        }, {} as Record<string, any>),
        ...(roleId && { userTypeId: roleId }),
        ...(isDeleting && { IsDeleted: 1 }),
      };

      console.log("Prepared data to send:", dataToSend);
      console.log("Resource endpoints:", resourceEndpoints);

      let result;

      try {
        if (isCreating) {
          if (!resourceEndpoints.add) {
            console.log("Add endpoint is missing");
            setError("Add endpoint is missing");
            setLoading(false);
            return;
          }
          console.log("Sending POST to add endpoint:", resourceEndpoints.add);
          result = await axiosInstance.post(resourceEndpoints.add, dataToSend, {
            withCredentials: true,
          });
        } else if (isUpdating) {
          if (!resourceEndpoints.update) {
            console.log("Update endpoint is missing");
            setError("Update endpoint is missing");
            setLoading(false);
            return;
          }
          console.log("Sending PATCH to update endpoint:", resourceEndpoints.update);
          result = await axiosInstance.patch(resourceEndpoints.update, dataToSend, {
            withCredentials: true,
          });
        } else if (isDeleting) {
          if (!resourceEndpoints.delete) {
            console.log("Delete endpoint is missing");
            setError("Delete endpoint is missing");
            setLoading(false);
            return;
          }
          console.log("Sending DELETE to delete endpoint:", resourceEndpoints.delete);
          result = await axiosInstance.delete(resourceEndpoints.delete, {
            data: dataToSend,
            withCredentials: true,
          });
        } else {
          console.log("Unknown action type encountered:", actionType);
          setError(`Unknown action type: ${actionType}`);
          setLoading(false);
          return;
        }

        console.log("API response:", result);

        // Success handling here
        setLoading(false);
        // maybe setResult or other success state
      } catch (error) {
        console.error("Axios request error:", error);
        setLoading(false);
        setError("An error occurred while processing the request");
        return;
      }

      const wasSuccessful = result?.data?.success;
      console.log("Operation success flag:", wasSuccessful);

      if (!wasSuccessful) {
        const errMsg = result?.data?.message || `Failed to ${actionType} ${resourceType}.`;
        console.log("Backend returned failure message:", errMsg);
        setError(errMsg);
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errMsg,
          confirmButtonColor: "#D32F2F",
        });
        setLoading(false);
        return;
      }

      console.log("Operation successful, clearing form and closing modal");
      setFormData({});
      setPassword("");
      setErrors({});
      onClose();

      if (roleId) {
        console.log("Refreshing user list after action");
        await setData((prev) => prev);
      }

      await Swal.fire({
        icon: "success",
        title: isDeleting
          ? `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Deleted!`
          : `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} ${
              isCreating ? "Created" : "Updated"
            }!`,
        text: isDeleting
          ? `The ${resourceType} has been deleted successfully.`
          : `The ${resourceType} has been ${isCreating ? "created" : "updated"} successfully.`,
        confirmButtonColor: "#67ABEB",
      });
    } catch (error: any) {
      console.error("Unexpected error:", error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "An unexpected error occurred.";

      setError(backendMessage);

      await Swal.fire({
        icon: "error",
        title: "Unexpected Error!",
        text: `Error while trying to ${actionType} ${resourceType}: ${backendMessage}`,
        confirmButtonColor: "#D32F2F",
      });
    } finally {
      console.log("handleVerifyUserAction finished, setting loading false");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative z-20 flex w-full justify-center items-center">
        <div className="w-[60%] sm:w-[60%] md:w-[40%] max-w-[430px] py-8 px-6 bg-[#F8F0E3] rounded-lg relative">
          {/* Close Button */}


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
                className={`w-full px-4 py-2.5 pr-10 text-sm rounded-md border ${
                  error ? "border-red-500" : "border-gray-600"
                } bg-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-500" : "focus:ring-white-200"
                }`}
                autoFocus
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleTogglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                tabIndex={-1}
                disabled={loading}
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              onClick={handleVerifyUserAction}
              className="w-full py-2.5 mt-5 bg-[#F6BA12] hover:bg-[#FFD100] text-[#212121] rounded-lg text-sm font-medium disabled:opacity-50"
              disabled={loading || !password.trim()}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUserActionModalPage;
