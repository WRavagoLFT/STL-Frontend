import { useState, useEffect } from "react";
import { Share } from "~/types/types";
import { fetchRetailReceipts } from "~/utils/api/transactions";
import { calculateNetIncome, processShares } from "./calculateShareTotals";

// reusable function for calculation
export const useRetailReceiptProcessor = (
  operationDate: string,
  operatorId?: number
) => {
  const [aacBreakdown, setAacBreakdown] = useState<Share[]>([]);
  const [aacTotalPercentage, setAacTotalPercentage] = useState(0);
  const [aacTotalShareAmount, setAacTotalShareAmount] = useState(0);

  const [pcsoBreakdown, setPcsoBreakdown] = useState<Share[]>([]);
  const [pcsoTotalPercentage, setPcsoTotalPercentage] = useState(0);
  const [pcsoTotalShareAmount, setPcsoTotalShareAmount] = useState(0);

  const [aacTaxBreakdown, setAacTaxBreakdown] = useState<Share[]>([]);
  const [aacTaxTotalPercentage, setAacTaxTotalPercentage] = useState(0);
  const [aacTaxTotalShareAmount, setAacTaxTotalShareAmount] = useState(0);

  const [pcsoTaxBreakdown, setPcsoTaxBreakdown] = useState<Share[]>([]);
  const [pcsoTaxTotalPercentage, setPcsoTaxTotalPercentage] = useState(0);
  const [pcsoTaxTotalShareAmount, setPcsoTaxTotalShareAmount] = useState(0);

  const [netAacTotalAmount, setNetAacTotalAmount] = useState(0);
  const [netAacTotalPercentage, setNetAacTotalPercentage] = useState(0);

  const [netPcsoTotalAmount, setNetPcsoTotalAmount] = useState(0);
  const [netPcsoTotalPercentage, setNetPcsoTotalPercentage] = useState(0);

  const AAC_GROSS_TITLES = [
    "Authorized Agent Share",
    "Commission of Salesforce",
    "Net Prize fund",
  ];

  const PCSO_TITLES = [
    "Printing cost to PCSO",
    "PCSO Charity fund",
    "PCSO Operating fund",
  ];

  const AAC_TAX_TITLES = [
    "Expanded witholding tax from Agency Commission",
    "VAT witholding tax from Agency commission",
    "Expanded witholding tax from Salesforce commission",
    "VAT witholding tax from Salesforce commission",
  ];

  const PCSO_TAX_TITLES = [
    "Expanded witholding tax from Agency Commission",
    "VAT witholding tax from Agency commission",
    "Expanded witholding tax from Salesforce commission",
    "VAT witholding tax from Salesforce commission",
    "Prize fund tax",
    "Documentary stamp tax"
  ];

useEffect(() => {
  // console.log("useRetailReceiptProcessor useEffect triggered");
  // console.log("operationDate:", operationDate);
  // console.log("Retail receipts for operator", JSON.stringify(operatorId));

  const [year, month] = operationDate.split("-").map(Number);
 // console.log("Parsed year and month:", year, month);

  fetchRetailReceipts(year, month, operatorId).then((response) => {
    // console.log("fetchRetailReceipts response:", response);

    if (!response?.success) {
      console.warn("Failed to fetch retail receipts");
      return;
    }

    const aac = processShares(
      response?.data?.Receipts?.AAC,
      AAC_GROSS_TITLES,
      year,
      month,
      1
    );
    // console.log("AAC processed shares:", aac);
    setAacBreakdown(aac.breakdown);
    setAacTotalPercentage(aac.totalPercentage);
    setAacTotalShareAmount(aac.totalShareAmount);

    const pcso = processShares(
      response?.data?.Receipts?.PCSO,
      PCSO_TITLES,
      year,
      month,
      1
    );
    // console.log("PCSO processed shares:", pcso);
    setPcsoBreakdown(pcso.breakdown);
    setPcsoTotalPercentage(pcso.totalPercentage);
    setPcsoTotalShareAmount(pcso.totalShareAmount);

    const aacTax = processShares(
      response?.data?.Receipts?.PCSO,
      AAC_TAX_TITLES,
      year,
      month,
      2
    );
    // console.log("AAC Tax processed shares:", aacTax);
    setAacTaxBreakdown(aacTax.breakdown);
    setAacTaxTotalPercentage(aacTax.totalPercentage);
    setAacTaxTotalShareAmount(aacTax.totalShareAmount);

    const pcsoTax = processShares(
      response?.data?.Receipts?.PCSO,
      PCSO_TAX_TITLES,
      year,
      month,
      2
    );
    // console.log("PCSO Tax processed shares:", pcsoTax);
    setPcsoTaxBreakdown(pcsoTax.breakdown);
    setPcsoTaxTotalPercentage(pcsoTax.totalPercentage);
    setPcsoTaxTotalShareAmount(pcsoTax.totalShareAmount);

    const { netAmount: netAacAmount, netPercentage: netAacPercentage } =
      calculateNetIncome(
        aac.totalShareAmount,
        aac.totalPercentage,
        aacTax.totalShareAmount,
        aacTax.totalPercentage
      );
    // console.log("Net AAC totals:", netAacAmount, netAacPercentage);
    setNetAacTotalAmount(netAacAmount);
    setNetAacTotalPercentage(netAacPercentage);

    const { netAmount: netPcsoAmount, netPercentage: netPcsoPercentage } =
      calculateNetIncome(
        pcso.totalShareAmount,
        pcso.totalPercentage,
        pcsoTax.totalShareAmount,
        pcsoTax.totalPercentage
      );
    // console.log("Net PCSO totals:", netPcsoAmount, netPcsoPercentage);
    setNetPcsoTotalAmount(netPcsoAmount);
    setNetPcsoTotalPercentage(netPcsoPercentage);
  });
}, [operationDate, operatorId]);

  return {
    aacBreakdown,
    aacTotalPercentage,
    aacTotalShareAmount,
    pcsoBreakdown,
    pcsoTotalPercentage,
    pcsoTotalShareAmount,
    aacTaxBreakdown,
    aacTaxTotalPercentage,
    aacTaxTotalShareAmount,
    pcsoTaxBreakdown,
    pcsoTaxTotalPercentage,
    pcsoTaxTotalShareAmount,
    netAacTotalAmount,
    netAacTotalPercentage,
    netPcsoTotalAmount,
    netPcsoTotalPercentage,
  };
};
