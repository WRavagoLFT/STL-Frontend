"use client";

import { useState, useEffect } from "react";
import { Share } from "@/types/types";
import { calculateNetIncome, processShares } from "./calculateShareTotals";

export const useRetailReceiptProcessor = (
  receiptData: string,
  filterBy: string,
  operationDate: string,
  selectedYear?: number,
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

  //console.log('RECEIPT DATA:', receiptData);
  
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
    if (!operationDate) {
      console.log("Missing operationDate, skipping fetch.");
      return;
    }

    const [parsedYear, parsedMonth] = operationDate.split("-").map(Number);
    const yearToUse = selectedYear ?? parsedYear;

    const filterByLower = typeof filterBy === "string" ? filterBy.toLowerCase() : null;
    const isMonthly = filterByLower === "monthly";
    const isYearly = filterByLower === "yearly";

    const monthParam: number | undefined = isMonthly ? parsedMonth : undefined;
    const filterByParam: number | undefined =
      !isMonthly && !isYearly && typeof filterBy !== "undefined"
        ? Number(filterBy)
        : undefined;

    const handleProcess = (data: any) => {
      const aac = processShares(data?.Receipts?.AAC, AAC_GROSS_TITLES, yearToUse, monthParam, 1);
      setAacBreakdown(aac.breakdown);
      setAacTotalPercentage(aac.totalPercentage);
      setAacTotalShareAmount(aac.totalShareAmount);

      const pcso = processShares(data?.Receipts?.PCSO, PCSO_TITLES, yearToUse, monthParam, 1);
      setPcsoBreakdown(pcso.breakdown);
      setPcsoTotalPercentage(pcso.totalPercentage);
      setPcsoTotalShareAmount(pcso.totalShareAmount);

      const aacTax = processShares(data?.Receipts?.PCSO, AAC_TAX_TITLES, yearToUse, monthParam, 2);
      setAacTaxBreakdown(aacTax.breakdown);
      setAacTaxTotalPercentage(aacTax.totalPercentage);
      setAacTaxTotalShareAmount(aacTax.totalShareAmount);

      const pcsoTax = processShares(data?.Receipts?.PCSO, PCSO_TAX_TITLES, yearToUse, monthParam, 2);
      setPcsoTaxBreakdown(pcsoTax.breakdown);
      setPcsoTaxTotalPercentage(pcsoTax.totalPercentage);
      setPcsoTaxTotalShareAmount(pcsoTax.totalShareAmount);

      const { netAmount: netAacAmount, netPercentage: netAacPercentage } = calculateNetIncome(
        aac.totalShareAmount,
        aac.totalPercentage,
        aacTax.totalShareAmount,
        aacTax.totalPercentage,
        "AAC"
      );
      setNetAacTotalAmount(netAacAmount);
      setNetAacTotalPercentage(netAacPercentage);

      const { netAmount: netPcsoAmount, netPercentage: netPcsoPercentage } = calculateNetIncome(
        pcso.totalShareAmount,
        pcso.totalPercentage,
        pcsoTax.totalShareAmount,
        pcsoTax.totalPercentage,
        "PCSO"
      );
      setNetPcsoTotalAmount(netPcsoAmount);
      setNetPcsoTotalPercentage(netPcsoPercentage);
    };

  if (receiptData) {
    try {
      const parsedData = typeof receiptData === "string"
        ? JSON.parse(receiptData)
        : receiptData;

      handleProcess(parsedData);
    } catch (error) {
      console.error("Invalid receiptData JSON:", error);
    }
  }

  }, [receiptData, filterBy, operationDate, selectedYear, operatorId]);

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
