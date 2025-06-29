"use client";

import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { z } from "zod";
import { useRouter } from "next/navigation";
import ActivityIndicator from "./ActivityIndicator";
import { loginUser } from "~/lib/api/login";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Invalid email",
    }),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setErrors({});

    const validation = loginSchema.safeParse(credentials);

    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as "email" | "password"] = issue.message;
      });

      setErrors(fieldErrors);
      setIsLoggingIn(false);
      return;
    }

    try {
      await loginUser(credentials, router);
    } catch (error: any) {
      setErrors({
        general: "Invalid credentials, please try again",
      });
      setIsLoggingIn(false);
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="bg-[#F8F0E3] container-2xl w-full min-h-screen flex flex-col items-center justify-center lg:items-stretch lg:flex-row">
      {/* Left Section (Logo & Title) */}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center py-8 px-4 lg:py-0">
        <div className="text-center w-full max-w-md">
          <div className="flex justify-center gap-3 mb-4">
            <img
              src={LoginSectionData.image2}
              alt="PCSO Logo"
              className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] object-contain"
              loading="lazy"
            />
            <img
              src={LoginSectionData.image}
              alt="STL Logo"
              className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] object-contain"
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

      {/* Right Section (Login Form) */}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center px-4 pb-10 lg:pb-0 relative">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0038A8]">
              {LoginSectionData.cardTitle}
            </h1>
            <p className="text-[#0038A8] text-sm">
              {LoginSectionData.cardDescription}
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full">
            {/* Email Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-left">
                {LoginSectionData.EmailAddressTitle}
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className={`w-full px-3 py-2 pr-10 rounded border text-sm lg:text-base bg-[#F8F0E3] text-[#0038A8] placeholder-[#ACA993] focus:outline-none
              ${errors.email || errors.general ? "border-[#CE1126]" : "border-[#0038A8]"}`}
                suppressHydrationWarning
              />
              {errors.email && (
                <span className="text-[#CE1126] text-xs mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-left">
                {LoginSectionData.PasswordTitle}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 pr-10 rounded border text-sm lg:text-base bg-[#F8F0E3] text-[#0038A8] placeholder-[#ACA993] focus:outline-none ${
                    errors.password || errors.general
                      ? "border-[#CE1126]"
                      : "border-[#0038A8]"
                  }`}
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACA993] text-lg"
                  suppressHydrationWarning
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                {(errors.password || errors.general) && (
                  <span className="text-[#CE1126] text-xs">
                    {errors.password || errors.general}
                  </span>
                )}
                <div className="ml-auto">
                  <a
                    href="/auth/forgot-password"
                    className="text-[#0038A8] text-xs hover:underline"
                  >
                    {LoginSectionData.forgotPassword}
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full mt-4 py-2 text-sm rounded-md transition ${
                isLoggingIn
                  ? "bg-[#F6BA12] text-[#212121] cursor-not-allowed opacity-70"
                  : "bg-[#F6BA12] text-[#212121] hover:opacity-70"
              }`}
              suppressHydrationWarning
            >
              {LoginSectionData.buttonText}
            </button>
          </form>

          {/* Loading Overlay (if needed) */}
          {isLoggingIn && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <ActivityIndicator />
            </div>
          )}
        </div>

        {/* Copyright Footer (fixed at bottom for mobile/tablet) */}
        <div className="absolute bottom-4 left-0 right-0 text-center px-4 lg:bottom-8">
          <p className="text-xs text-[#0038A8]">{LoginSectionData.copyright}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;