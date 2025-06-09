// components/cards/ReceiptCardsPage.tsx

import React from "react";
import Card from "../ui/dashboardcards/Cards";

interface ReceiptMetrics {
  TotalBets: number;
  TotalBettors: number;
  TotalPayout: number;
  TotalRevenue: number;
  TotalWinners: number;
}

interface ReceiptCardsPageProps {
  receiptDataMetrics: ReceiptMetrics | null;
  textlabel?: string;
}

const ReceiptCardsPage = ({
  receiptDataMetrics,
  textlabel = "Receipt",
}: ReceiptCardsPageProps) => {
  if (!receiptDataMetrics) return null;

  const formatPeso = (amount: number) => `₱ ${amount.toLocaleString()}`;
  const formatNumber = (value: number) => value.toLocaleString();

  const calculatedCardData = [
    {
      label: "Total Bets",
      value: formatPeso(receiptDataMetrics.TotalBets),
      color: "#4A90E2",
    },
    {
      label: "Total Bettors",
      value: formatNumber(receiptDataMetrics.TotalBettors),
      color: "#50E3C2",
    },
    {
      label: "Total Payout",
      value: formatPeso(receiptDataMetrics.TotalPayout),
      color: "#F76E3F",
    },
    {
      label: "Total Revenue",
      value: formatPeso(receiptDataMetrics.TotalRevenue),
      color: "#F5A623",
    },
    {
      label: "Total Winners",
      value: formatNumber(receiptDataMetrics.TotalWinners),
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
          textlabel={textlabel}
        />
      ))}
    </div>
  );
};

export default ReceiptCardsPage;
