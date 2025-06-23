import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useAuthStore } from "../../store/useForgetAuthStore";
import { forgetPassEmail } from "~/utils/api/auth";
import ActivityIndicator from "./ActivityIndicator";

const ForgotPassword = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "" });
  const [errors, setErrors] = useState<{ username?: string }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const authStore = useAuthStore();

  const validateCredentials = (credentials: { username: string }) => {
    let errors: { username?: string } = {};

    if (!credentials.username.trim()) {
      errors.username = "Email Address is Required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.username)) {
      errors.username = "Please enter a valid email address.";
    }

    return errors;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCredentials(credentials);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Login Successful.", credentials);
      setErrors({});


    } else {
      setErrors(validationErrors);
    }
  };

  const handleNavigation = async () => {
    const validationErrors = validateCredentials(credentials);
    if (Object.keys(validationErrors).length === 0) {

      setIsLoading(true)
      setIsButtonDisabled(true)

      authStore.setEmail(credentials.username)
      const result = await forgetPassEmail(credentials.username)

      setIsLoading(false)
      setIsButtonDisabled(false)
      if(!result.success) return

      console.log(authStore.email, result)
      router.push("/email-verification");

    } else {
      setErrors(validationErrors);
    }
  };

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
          <div className="relative">
            <div
              className="mb-6 inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <a
                href="/"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0038A8]"
              >
                <FaArrowLeft className="text-[#F8F0E3]" />
              </a>
              {showTooltip && (
                <div className="absolute left-12 top-2 bg-[#0038A8] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Back to Login
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center flex-col mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0038A8]">
              {LoginSectionData.forgotPasswordTitle}
            </h1>
            <p className="text-[#0038A8] text-sm mt-2">
              {LoginSectionData.forgotPasswordDescription}
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full">
            <div className="flex flex-col items-stretch w-full">
              <div className="mb-4">
                <label className="block mb-2 text-sm text-left">
                  {LoginSectionData.EmailAddressTitle}
                </label>

                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-md border bg-[#F8F0E3] ${errors.username ? "border-[#CE1126]" : "border-[#0038A8]"} text-[#0038A8] focus:outline-none`}
                  placeholder="Enter Email Address"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  disabled={isLoading}
                />
                {errors.username && (
                  <span className="text-[#CE1126] text-xs mt-1 block">
                    {errors.username}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              onClick={handleNavigation}
              className={`w-full mt-4 py-2 text-sm rounded-md transition bg-[#F6BA12] text-[#212121] hover:opacity-70 ${isButtonDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={isLoading || isButtonDisabled}
            >
              {LoginSectionData.resetPasswordButton}
            </button>
          </form>

          <div className="absolute bottom-4 left-0 right-0 text-center px-4 lg:bottom-8">
            <p className="text-xs text-[#0038A8]">
              {LoginSectionData.copyright}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
