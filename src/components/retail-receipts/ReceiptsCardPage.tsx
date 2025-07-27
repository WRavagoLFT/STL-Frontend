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
  loading?: boolean;
}

const ReceiptCardsPage = ({
  receiptDataMetrics,
  textlabel = "Receipt",
  loading,
}: ReceiptCardsPageProps) => {
  const formatPeso = (amount: number) => `₱ ${amount.toLocaleString()}`;
  const formatNumber = (value: number) => value.toLocaleString();

  const calculatedCardData = [
    {
      label: "Total Bets",
      value: formatPeso(receiptDataMetrics?.TotalBets ?? 0),
      color: "#4A90E2",
    },
    {
      label: "Total Bettors",
      value: formatNumber(receiptDataMetrics?.TotalBettors ?? 0),
      color: "#50E3C2",
    },
    {
      label: "Total Payout",
      value: formatPeso(receiptDataMetrics?.TotalPayout ?? 0),
      color: "#F76E3F",
    },
    {
      label: "Total Revenue",
      value: formatPeso(receiptDataMetrics?.TotalRevenue ?? 0),
      color: "#F5A623",
    },
    {
      label: "Total Winners",
      value: formatNumber(receiptDataMetrics?.TotalWinners ?? 0),
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
          loading={loading}
        />
      ))}
    </div>
  );
};

export default ReceiptCardsPage;
