"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { AccessGuard } from "@/components/auth/AccessGuard";
import PCSOTaxesPage from "@/components/retail-receipts/PCSOTaxes";
import { useRetailReceiptProcessor } from "@/components/retail-receipts/RetailReceiptProcessor";
import {
  fetchRetailReceiptsMetrics,
  fetchRetailReceiptsData,
} from "@/lib/api/transactions";
import Select, { ActionMeta, SingleValue } from "react-select";
import RetailReceiptSkeleton from "@/components/retail-receipts/RetailReceiptSkeleton";
import { ExportRetailDataToPDF } from "@/components/retail-receipts/ExportRetailDataToPdf";
import ExportRetailDataToExcel from "@/components/retail-receipts/ExportReceiptsCSV";
import dynamic from "next/dynamic";

const ReceiptCardsPage = dynamic(() => import("@/components/retail-receipts/ReceiptsCardPage"));
const GrossAACSharePage = dynamic(() => import("@/components/retail-receipts/GrossAACShare"));
const GrossPSCOSharePage = dynamic(() => import("@/components/retail-receipts/GrossPSCOShare"));
const AACTaxesPage = dynamic(() => import("@/components/retail-receipts/ACCSTaxes"));
const NetAACIncomePage = dynamic(() => import("@/components/retail-receipts/NetAACIncome"));
const NetPSCOIncomePage = dynamic(() => import("@/components/retail-receipts/NetPSCOIncome"));

export type OptionType = {
  label: string;
  value: string;
};

export const ParentRetailReceipt = () => {
  const [operationDate, setOperationDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const filterOptions: OptionType[] = [
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
  ];
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [filterBy, setFilterBy] = useState<OptionType>(filterOptions[0]);
  const [isAACOpen, setIsAACOpen] = useState(false);
  const [isAACtaxOpen, setIsAACtaxOpen] = useState(false);
  const [isPCSOOpen, setIsPCSOOpen] = useState(false);
  const [isPCSOTaxOpen, setIsPCSOTaxOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<OptionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [receiptDataMetrics, setReceiptDataMetrics] = useState<{
    TotalBets: number;
    TotalBettors: number;
    TotalPayout: number;
    TotalRevenue: number;
    TotalWinners: number;
  } | null>(null);

  const currentYearOption = useMemo(() => {
    const year = new Date().getFullYear();
    return { label: year.toString(), value: year.toString() };
  }, []);

  const yearOptions = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const year = parseInt(currentYearOption.value) - i;
      return { label: year.toString(), value: year.toString() };
    });
  }, [currentYearOption]);

  const [appliedFilterBy, setAppliedFilterBy] = useState<OptionType>(
    filterOptions[0]
  );
  const [appliedSelectedYear, setAppliedSelectedYear] =
    useState<OptionType | null>(currentYearOption);

  useEffect(() => {
    if (filterBy?.value === "Yearly" && !selectedYear) {
      setSelectedYear(currentYearOption);
    }
  }, [filterBy, selectedYear, currentYearOption]);

  const handleYearChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (newValue) {
      setSelectedYear(newValue);
    } else {
      setSelectedYear({
        label: currentYearOption.toString(),
        value: currentYearOption.toString(),
      });
    }
  };

  const fetchAllRetailData = useCallback(async () => {
    setLoading(true);

    try {
      let metricsRes, dataRes;

      if (!operationDate) {
        console.warn("No operationDate provided, skipping fetch");
        setReceiptData(null);
        setReceiptDataMetrics(null);
        return;
      }

      const yearFromOpDate = operationDate.split("-")[0];
      const year = selectedYear ? selectedYear.value : yearFromOpDate;
      const updatedOperationDate = operationDate.replace(/^\d{4}/, year);
      const [parsedYearStr, parsedMonthStr] = updatedOperationDate.split("-");
      const parsedYear = Number(parsedYearStr);
      const parsedMonth = Number(parsedMonthStr);

      if (filterBy.value === "Monthly") {
        [metricsRes, dataRes] = await Promise.all([
          fetchRetailReceiptsMetrics(parsedYear, parsedMonth),
          fetchRetailReceiptsData(parsedYear, parsedMonth),
        ]);
      } else if (filterBy.value === "Yearly" && selectedYear) {
        const selectedYearVal = Number(selectedYear.value);
        [metricsRes, dataRes] = await Promise.all([
          fetchRetailReceiptsMetrics(selectedYearVal),
          fetchRetailReceiptsData(selectedYearVal),
        ]);
      }

      setReceiptDataMetrics(metricsRes?.success ? metricsRes.data : null);
      setReceiptData(dataRes?.success ? dataRes.data : null);
    } catch (error) {
      console.error("Fetch error:", error);
      setReceiptData(null);
      setReceiptDataMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [filterBy, operationDate, selectedYear]);

  useEffect(() => {
    fetchAllRetailData();
  }, [fetchAllRetailData]);

  const yearNumber = Number(selectedYear?.value ?? new Date().getFullYear());

  const {
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
  } = useRetailReceiptProcessor(
    receiptData,
    filterBy?.value,
    operationDate,
    yearNumber
  );
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <Suspense fallback={<RetailReceiptSkeleton />}>
        <div className="py-8 md:py-1">
          <h1 className="text-3xl font-bold mb-3">STL Retail Receipt</h1>
          <div className="flex flex-col md:flex-row gap-4 lg:pr-2 mb-4 w-full lg:w-2/5">
            <div className="w-full lg:w-1/2">
              <div>
                <label
                  htmlFor="filterBy"
                  className="text-sm font-medium text-[#0038A8]"
                >
                  Filter by
                </label>
                <Select
                  name="filterBy"
                  value={filterBy}
                  onChange={(selectedOption) => {
                    if (!loading && selectedOption) {
                      setFilterBy(selectedOption);
                      if (selectedOption.value === "Monthly") {
                        setSelectedYear(null);
                      }
                    }
                  }}
                  options={filterOptions}
                  classNamePrefix="custom-select"
                  styles={selectStyles}
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="operationDate"
                  className="text-sm font-medium text-[#0038A8]"
                >
                  Date of Report
                </label>

                {filterBy?.value === "Monthly" && (
                  <input
                    id="operationDate"
                    type="month"
                    value={operationDate}
                    onChange={(e) => setOperationDate(e.target.value)}
                      className="bg-[#F6BA12] text-sm min-h-[35px] text-[black] h-[32px] border-transparent border-[#0038A8]
                       hover:border-[#0038A8] rounded-[9px] shadow-none focus:outline-none px-2 cursor-default"
                  />
                )}

                {filterBy?.value === "Yearly" && (
                  <Select
                    name="year"
                    value={selectedYear}
                    options={yearOptions}
                    onChange={handleYearChange}
                    classNamePrefix="custom-select"
                    menuPortalTarget={document.body}
                    styles={selectStyles}
                  />
                )}
              </div>
            </div>
          </div>
          <ReceiptCardsPage
            receiptDataMetrics={receiptDataMetrics ?? null}
            textlabel="Collection"
            loading={loading}
          />
          <div className="flex gap-6 mt-4 mb-3">
            <div className="w-full md:w-1/2 md:pr-3">
              {loading ? (
                <div className="flex flex-col md:flex-row gap-6 mb-1">
                  <div className="w-full space-y-4">
                    <div className="bg-[#F6BA12] px-4 py-5 rounded-lg shadow-sm animate-pulse space-y-2">
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full bg-[#F6BA12] p-2 rounded-md flex flex-col lg:flex-row lg:items-center md:justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">STL Collections</span>
                      <span className="text-lg font-bold md:hidden">
                        ₱{" "}
                        {receiptData?.Collections?.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "0.00"}
                      </span>
                    </div>

                    <div className="hidden md:block text-base font-semibold">
                      ₱{" "}
                      {receiptData?.Collections?.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "0.00"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <GrossAACSharePage
                  totalPercentage={aacTotalPercentage}
                  totalShareAmount={aacTotalShareAmount}
                  breakdown={aacBreakdown}
                  isOpen={isAACOpen}
                  setIsOpen={setIsAACOpen}
                  loading={loading}
                />
                <AACTaxesPage
                  totalPercentage={aacTaxTotalPercentage}
                  totalShareAmount={aacTaxTotalShareAmount}
                  breakdown={aacTaxBreakdown}
                  isOpen={isAACtaxOpen}
                  setIsOpen={setIsAACtaxOpen}
                  loading={loading}
                />
                <NetAACIncomePage
                  netAmount={netAacTotalAmount}
                  netPercentage={netAacTotalPercentage}
                  loading={loading}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <GrossPSCOSharePage
                  totalPercentage={netPcsoTotalPercentage}
                  totalShareAmount={netPcsoTotalAmount}
                  breakdown={pcsoBreakdown}
                  isOpen={isPCSOOpen}
                  setIsOpen={setIsPCSOOpen}
                  loading={loading}
                />
                <PCSOTaxesPage
                  totalPercentage={pcsoTaxTotalPercentage}
                  totalShareAmount={pcsoTaxTotalShareAmount}
                  breakdown={pcsoTaxBreakdown}
                  isOpen={isPCSOTaxOpen}
                  setIsOpen={setIsPCSOTaxOpen}
                  loading={loading}
                />
                <NetPSCOIncomePage
                  netAmount={pcsoTotalShareAmount}
                  netPercentage={pcsoTotalPercentage}
                  loading={loading}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-8 flex flex-row gap-2 md:gap-3 md:pr-3">
            <div className="w-1/2">
              <ExportRetailDataToExcel
                receiptData={receiptData}
                receiptDataMetrics={receiptDataMetrics}
                filterBy={filterBy}
                operationDate={operationDate}
                yearNumber={yearNumber}
                loading={loading}
              />
            </div>
            <div className="w-1/2">
              <ExportRetailDataToPDF
                filterBy={filterBy}
                operationDate={operationDate}
                yearNumber={yearNumber}
                receiptDataMetrics={receiptDataMetrics}
                aacTotalShareAmount={aacTotalShareAmount}
                pcsoTotalShareAmount={pcsoTotalShareAmount}
                aacTaxTotalShareAmount={aacTaxTotalShareAmount}
                pcsoTaxTotalShareAmount={pcsoTaxTotalShareAmount}
                netAacTotalAmount={netAacTotalAmount}
                netPcsoTotalAmount={netPcsoTotalAmount}
                aacBreakdown={aacBreakdown}
                pcsoBreakdown={pcsoBreakdown}
                aacTaxBreakdown={aacTaxBreakdown}
                pcsoTaxBreakdown={pcsoTaxBreakdown}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </AccessGuard>
  );
};

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "0.875rem",
    minHeight: "35px",
    height: "32px",
    paddingBottom: "2rem",
    borderRadius: "9px",
    borderColor: "#0038A8",
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#0038A8",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 10,
  }),
};
