// generic component for dashboard cards
// This component is used to display various statistics on the dashboard
// It takes in props for the dashboard data, role label, text label, and card data

import React from "react";
import { CardsPageProps } from "@/types/interfaces";
import { getUserStatus } from "@/hooks/dashboarddata";
import dayjs from "dayjs";
import Card from "../ui/dashboardcards/Cards";

const CardsPage = <T extends { 
  LastLogin?: string; 
  LastTokenRefresh?: string; 
  UserStatusId?: number;
  DateOfRegistration?: string;
  IsActive?: number;
  loading?: boolean;
}>({
  dashboardData,
  textlabel,
  loading,
}: CardsPageProps<T>) => {

  // Get the date for seven days ago
  const sevenDaysAgo = dayjs().subtract(7, "days");
  
  // Calculate the status for each user and categorize them
  const totalItems = dashboardData.length;
  
  const activeItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "Active"
  ).length;

  const inactiveItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "Inactive"
  ).length;

  const suspendedItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "Suspended"
  ).length;

  const newItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "New"
  ).length;

  // Calculated card data to pass to the Card component
  const calculatedCardData = [
    {
      label: `Total ${textlabel}`,
      textlabel,
      value: totalItems.toString(),
      color: "#4A90E2",
    },
    {
      label: `Total Active ${textlabel}`,
      textlabel,
      value: activeItems.toString(),
      color: "#50E3C2",
    },
    {
      label: `Total of Deleted ${textlabel}`,
      textlabel,
      value: suspendedItems.toString(),
      color: "#F76E3F",
    },
    {
      label: `Total of Inactive ${textlabel}`,
      textlabel,
      value: inactiveItems.toString(),
      color: "#F5A623",
    },
    {
      label: `Total of New ${textlabel}`,
      textlabel,
      value: newItems.toString(),
      color: "#7ED321",
    },
  ];  
  
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3">
      {calculatedCardData.map((item, index) => (
        <Card
          key={index}
          label={item.label}
          value={item.value}
          color={item.color}
          textlabel={item.textlabel || ""}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default CardsPage;