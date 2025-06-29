'use client'

import React, { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/useForgetAuthStore";
import { updateForgottenPassword } from "~/lib/api/auth";
import ActivityIndicator from "./ActivityIndicator";

const SetNewPassword = () => {
  const [credentials, setCredentials] = useState({
    newpassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    newpassword?: string;
    confirmPassword?: string;
    passwordMismatch?: string;
    passwordLimit?: string;
  }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const [displayedError, setDisplayedError] = useState("");

  const authStore = useAuthStore()

  // Validation Function
  const validatePasswords = () => {
    const { newpassword, confirmPassword } = credentials;
    const trimmedNewPassword = newpassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    let newErrors: { passwordMismatch?: string; passwordLimit?: string } = {};

    // Check if passwords match
    if (trimmedNewPassword !== trimmedConfirmPassword) {
      newErrors.passwordMismatch = "Passwords do not match";
    } else {
      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(trimmedNewPassword)) {
        newErrors.passwordLimit =
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    if (!validatePasswords()) {
      setIsLoading(false)
      return;
    }

    if (!errors.passwordLimit && !errors.passwordMismatch) {
      console.log("Data: ", authStore.email, authStore.resetToken, credentials.newpassword);

      const result = await updateForgottenPassword(authStore.email, authStore.resetToken, credentials.newpassword)

      setIsLoading(false)
      if(!result.success) {
        setCurrentError(result.message)
        return
      }

      Swal.fire({
        title: "Success!",
        text: "New password has been set, you will be directed to the login page.",
        icon: "success",
        confirmButtonText: "Redirect",
        confirmButtonColor: "#0038A8",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          window.location.href = "auth/login";
        }
      });
    }
    setIsLoading(false)
  };

  const handleTogglePasswordVisibility = (
    type: "newpassword" | "confirmPassword"
  ) => {
    if (type === "newpassword") {
      setShowPassword((prev) => !prev);
    } else if (type === "confirmPassword") {
      setConfirmPassword((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(
      credentials.newpassword.trim() === "" ||
        credentials.confirmPassword.trim() === ""
    );
  }, [credentials.newpassword, credentials.confirmPassword]);

  useEffect(() => {
    if(currentError.toLowerCase().includes("token not found")) {
      setDisplayedError("Your token has expired or is invalid. Please return to the first step and try again.");
    }

    if(currentError.toLowerCase().includes("missing required")) {
      setDisplayedError("Some information are missing. Please return to the first step and try again.")
    }
  }, [currentError])

  useEffect(() => {
    console.log("Reset token is " + authStore.resetToken)
  }, [])

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center lg:items-stretch lg:flex-row bg-[#F8F0E3]">
      {isLoading && (
        <ActivityIndicator />
      )}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center py-8 px-4 lg:py-0">
        <div className="text-center w-full max-w-md">
          <div className="flex justify-center gap-3 mb-4">
            <img
              src={LoginSectionData.image2}
              alt="PCSO Logo"
              className="w-[35%] max-w-[150px] lg:max-w-[180px]"
              loading="lazy"
            />
            <img
              src={LoginSectionData.image}
              alt="STL Logo"
              className="w-[35%] max-w-[120px] lg:max-w-[180px]"
              loading="lazy"
            />
          </div>
          <h1 className="text-base md:text-xl font-bold text-[#0038A8]">
            {LoginSectionData.logoTitle}
          </h1>
          <p className="text-[#0038A8] text-sm">
            {LoginSectionData.logoDescription}
          </p>
        </div>
      </div>

      <div className="w-full lg:flex-1 flex flex-col justify-center items-center px-4 pb-16 lg:pb-0 relative">
        <div className="w-full max-w-md">
          <div className="flex justify-center flex-col text-left mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0038A8]">
              {LoginSectionData.SetNewPasswordTitle}
            </h1>
            <p className="text-[#0038A8] text-sm mt-2">
              {LoginSectionData.SetNewPasswordDescription}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="full">
            <div className="flex flex-col items-stretch w-full">
              <div className="mb-4">
                <label className="block mb-2 text-sm text-left">
                  {LoginSectionData.NewPassword}
                </label>

                <div className="relative">
                  <input
                    className={`w-full px-3 py-2 pr-10 rounded border text-sm lg:text-base text-[#0038A8] placeholder-[#ACA993] focus:outline-none ${
                      errors.passwordLimit || errors.passwordMismatch
                        ? "border-[#CE1126]"
                        : "border-[#0038A8]"
                    }`}
                    placeholder="Enter new password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.newpassword}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        newpassword: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACA993] text-lg"
                    onClick={() =>
                      handleTogglePasswordVisibility("newpassword")
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff className="text-inherit" />
                    ) : (
                      <Visibility className="text-inherit" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-left">
                  {LoginSectionData.ConfirmPassword}
                </label>

                <div className="relative">
                  <input
                    className={`w-full px-3 py-2 pr-10 rounded border text-sm lg:text-base text-[#0038A8] placeholder-[#ACA993] focus:outline-none ${
                      errors.passwordMismatch || errors.passwordLimit
                        ? "border-[#CE1126]"
                        : "border-[#0038A8]"
                    }`}
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={credentials.confirmPassword}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACA993] text-lg"
                    onClick={() =>
                      handleTogglePasswordVisibility("confirmPassword")
                    }
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff className="text-inherit" />
                    ) : (
                      <Visibility className="text-inherit" />
                    )}
                  </button>
                </div>
                {errors.passwordLimit && (
                  <span className="text-[#CE1126] text-xs">
                    {errors.passwordLimit}
                  </span>
                )}
              </div>
            </div>
            {errors.passwordMismatch && (
              <span className="text-[#CE1126] text-xs">
                {errors.passwordMismatch}
              </span>
            )}
            {
              displayedError.length > 0 && (
                <span className="text-[#CE1126] text-xs">
                  {displayedError}
                </span>
              )
            }
            <button
              type="submit"
              className={`w-full mt-4 py-2 text-sm rounded-md transition ${
                isButtonDisabled
                  ? "bg-[#F6BA12] text-[#212121] cursor-not-allowed opacity-70"
                  : "bg-[#F6BA12] text-[#212121] hover:opacity-70"
              }`}
              disabled={isButtonDisabled}
            >
              {LoginSectionData.UpdatePassword}
            </button>
          </form>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center px-4 lg:bottom-8">
          <p className="text-xs text-[#0038A8]">{LoginSectionData.copyright}</p>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
