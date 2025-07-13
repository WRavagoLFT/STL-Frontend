"use client";

import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { verifyPass } from "@/lib/api/auth";
import { LoginSectionData } from "@/data/LoginSectionData";

export interface ConfirmUserActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (remarks?: string) => Promise<void>;
  mode: "add" | "update" | "suspend";
  remarks?: string;
  setRemarks?: (data: string) => void;
}

const ConfirmUserActionModalPage: React.FC<ConfirmUserActionModalProps> = ({
  open,
  onConfirm,
  onClose,
  mode,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleTogglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const handleVerifyUserAction = async () => {
    if (!password.trim()) {
      console.warn("[WARN] Password is empty");
      setError("Password is required.");
      return;
    }

    if (mode === "suspend" && !remarks.trim()) {
      console.warn("[WARN] Remarks are empty during suspend mode");
      setError("Remarks are required for suspension.");
      return;
    }
  
    setLoading(true);
    try {
      const { success: isVerified } = await verifyPass(password);

      if (!isVerified) {
        setError("Invalid password. Please try again.");
        setLoading(false);
        return;
      }

      setError("");

      if (mode === "suspend") {
        await onConfirm(remarks); 
      } else {
        await onConfirm();
      }
    } catch (err) {
      console.error("[ERROR] Unexpected error during verification:", err);
      setError("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative z-20 flex w-full justify-center items-center">
        <div className="w-[60%] sm:w-[60%] md:w-[40%] max-w-[430px] py-8 px-6 bg-[#F8F0E3] rounded-lg relative">
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
            {mode === "suspend" && (
              <div className="relative w-full mb-2">
                <textarea
                  id="remarks"
                  placeholder="Enter remarks"
                  value={remarks}
                  onChange={(e) => setRemarks?.(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-md border ${
                    error ? "border-red-500" : "border-gray-600"
                  } bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    error ? "focus:ring-red-500" : "focus:ring-white-200"
                  }`}
                  disabled={loading}
                  rows={5}
                />
              </div>
            )}

            <div className="relative w-full mb-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 text-sm rounded-md bg-transparent border ${
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
