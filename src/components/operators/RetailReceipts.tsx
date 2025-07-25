"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import GrossAACSharePage from "../retail-receipts/GrossAACShare";
import { useRetailReceiptProcessor } from "@/components/retail-receipts/RetailReceiptProcessor";
import AACTaxesPage from "../retail-receipts/ACCSTaxes";
import NetAACIncomePage from "../retail-receipts/NetAACIncome";
import GrossPSCOSharePage from "../retail-receipts/GrossPSCOShare";
import PCSOTaxesPage from "../retail-receipts/PCSOTaxes";
import NetPSCOIncomePage from "../retail-receipts/NetPSCOIncome";
import { fetchRetailReceiptsData } from "@/lib/api/transactions";
import Select, { ActionMeta, SingleValue } from "react-select";
import Input from "../ui/inputs/TextInputs";

export type OptionType = {
  label: string;
  value: string;
};

const RetailReceiptOperatorsPage = ({ operatorId }: { operatorId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [operationDate, setOperationDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const filterOptions: OptionType[] = [
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
  ];

  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [filterBy, setFilterBy] = useState<OptionType>(filterOptions[0]); // default to Monthly
  const [selectedYear, setSelectedYear] = useState<OptionType | null>(null);
  const [loading, setLoading] = useState(false);

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

  // /transactions/getRetailReceipts/:year/:month for AAC and PCSO receipts
  const fetchRetailData = useCallback(async () => {
    setLoading(true);

    if (!operationDate) {
      console.warn("No operationDate provided, skipping fetch");
      setReceiptData(null);
      setLoading(false);
      return;
    }

    try {
      let data;
      const yearFromOpDate = operationDate.split("-")[0];
      const year = selectedYear ? selectedYear.value : yearFromOpDate;
      const updatedOperationDate = operationDate.replace(/^\d{4}/, year);
      const [parsedYearStr, parsedMonthStr] = updatedOperationDate.split("-");
      const parsedYear = Number(parsedYearStr);
      const parsedMonth = Number(parsedMonthStr);

      if (filterBy.value === "Monthly") {
        data = await fetchRetailReceiptsData(parsedYear, parsedMonth, undefined, operatorId);
      } else if (filterBy.value === "Yearly" && selectedYear) {
        data = await fetchRetailReceiptsData(Number(selectedYear.value), undefined, undefined, operatorId);
      }

      if (data?.success) {
        setReceiptData(data.data);
      } else {
        setReceiptData(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setReceiptData(null);
    } finally {
      setLoading(false);
    }
  }, [filterBy, operationDate, selectedYear, operatorId]);

  useEffect(() => {
    fetchRetailData();
  }, [fetchRetailData]);

  //console.log("Operator ID passed to useRetailReceiptProcessor:", operatorId);
  
  const yearNumber = selectedYear ? Number(selectedYear.value) : undefined;

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
    yearNumber,
    operatorId
  );

  return (
    <div className="flex flex-col">
      <div className="text-base font-bold mb-2">Retail Receipts</div>
      <div className="flex flex-wrap gap-x-4 mb-5">
        {/* Filter By */}
        <div className="flex-1 min-w-[200px]">
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
              if (selectedOption) {
                setFilterBy(selectedOption);
                // reset selection when filter changes
                if (selectedOption.value === "Monthly") {
                  setSelectedYear(null);
                }
              }
            }}
            options={filterOptions}
            classNamePrefix="react-select"
            styles={{
                control: (provided, state) => {
                  const isDisabled = state.isDisabled;
                  return {
                    ...provided,
                    fontSize: "0.875rem",
                    //padding: "2px",
                    minHeight: "35px",
                    height: "32px",
                    borderRadius: "9px",
                    borderColor: "#0038A8",
                    color: isDisabled ? "#6B7280" : "inherit",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    '&:hover': {
                      borderColor: "#0038A8",
                    },
                  };
                },
              menu: (provided) => ({
                ...provided,
                zIndex: 10,
              }),
            }}
          />
        </div>

        {/* Date of Report */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="operationDate"
            className="text-sm font-medium text-[#0038A8]"
          >
            Date of Report
          </label>

          {filterBy?.value === "Monthly" && (
            <Input
              type="month"
              value={operationDate}
              onChange={(e: any) => setOperationDate(e.target.value)}
            />
          )}

          {filterBy?.value === "Yearly" && (
            <Select
              name="year"
              value={selectedYear}
              options={yearOptions}
              onChange={handleYearChange}
              placeholder="Select Year"
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderRadius: "0.5rem",
                  color: "#2F2F2F",
                  padding: "0.25rem",
                  boxShadow: state.isFocused ? "none" : provided.boxShadow,
                }),
                menu: (provided) => ({
                  ...provided,
                  //backgroundColor: "#F8C73F",
                  zIndex: 10,
                }),
              }}
            />
          )}
        </div>
      </div>
      <div className="flex gap-4 mb-1">
        <div className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
          <div className="flex flex-col">
            <span className="text-sm font-bold">STL Collections</span>
          </div>
          <div className="flex justify-center md:justify-end text-base font-semibold">
            ₱ {receiptData?.Collections?.toLocaleString() || "0.00"}
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <h1 className="font-bold">Authorize Agent Corporation</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="w-full mt-3">
          <GrossAACSharePage
            totalPercentage={aacTotalPercentage}
            totalShareAmount={aacTotalShareAmount}
            breakdown={aacBreakdown}
          />
        </div>

        <div className="w-full">
          <AACTaxesPage
            totalPercentage={aacTaxTotalPercentage}
            totalShareAmount={aacTaxTotalShareAmount}
            breakdown={aacTaxBreakdown}
          />
        </div>
        <div className="w-full">
          <NetAACIncomePage
            netAmount={netAacTotalAmount}
            netPercentage={netAacTotalPercentage}
          />
        </div>
        <div className="w-full mt-2">
          <h1 className="font-bold"> PCSO</h1>
        </div>
        <div className="w-full">
          <GrossPSCOSharePage
            totalPercentage={pcsoTotalPercentage}
            totalShareAmount={pcsoTotalShareAmount}
            breakdown={pcsoBreakdown}
          />
        </div>
        <div className="w-full">
          <PCSOTaxesPage
            totalPercentage={pcsoTaxTotalPercentage}
            totalShareAmount={pcsoTaxTotalShareAmount}
            breakdown={pcsoTaxBreakdown}
          />
        </div>
        <div className="w-full">
          <NetPSCOIncomePage
            netAmount={netPcsoTotalAmount}
            netPercentage={netPcsoTotalPercentage}
          />
        </div>
      </div>
    </div>
  );
};

export default RetailReceiptOperatorsPage;
