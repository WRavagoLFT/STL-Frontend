"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import { match } from "path-to-regexp";
import lightTheme from "@/styles/theme";
import { AccessGuard } from "@/components/auth/AccessGuard";
import Sidebar from "@/components/layout/Sidebar";

const staticPaths = [
  "/dashboard",
  "/operators",
  "/operators/operators-add",
  "/retail-receipt",
  "/device",
  "/device/device-add",
  "/draw-summary",
  "/bets-comparisons",
  "/wins-comparisons",
];

const dynamicPaths = [
  "/users/:role",
  "/users/users-view/:slug",
  "/operators/operators-view/:slug",
  "/device/device-view/:slug",
  "/winning-summary/:slug",
  "/betting-summary/:mainSlug",
  "/betting-summary/:mainSlug/betting-comparisons/:comparisonSlug",
  "/winning-summary/:mainSlug/winning-comparisons/:comparisonSlug",
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AccessGuard allowedUserTypes={[3, 4, 5, 6]}>
        <div className="flex min-h-screen">
          <div className="h-screen sticky top-0">
            <Sidebar />
          </div>
          <div className="flex flex-col flex-grow overflow-hidden">
            <main className="flex-grow overflow-y-auto px-4 py-8">
              {children}
            </main>
          </div>
        </div>
      </AccessGuard>
    </ThemeProvider>
  );
}
