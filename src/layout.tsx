// Layout.tsx
import React from "react";
import Sidebar from "./components/layout/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar: fixed height and no scroll */}
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Main content grows, scrolls vertically */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <main className="flex-grow overflow-y-auto px-4 py-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
