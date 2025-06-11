import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AccessGuard } from "~/components/auth/AccessGuard";
import AACTaxesPage from "~/components/retail-receipts/ACCSTaxes";
import GrossAACSharePage from "~/components/retail-receipts/GrossAACShare";
import GrossPSCOSharePage from "~/components/retail-receipts/GrossPSCOShare";
import NetAACIncomePage from "~/components/retail-receipts/NetAACIncome";
import NetPSCOIncomePage from "~/components/retail-receipts/NetPSCOIncome";
import PCSOTaxesPage from "~/components/retail-receipts/PCSOTaxes";
import { useRetailReceiptProcessor } from "~/components/retail-receipts/useRetailReceiptProcessor";
import { fetchRetailReceiptsMetrics, fetchRetailReceiptsData } from "~/utils/api/transactions";
import Select, { ActionMeta, SingleValue } from "react-select";
import ReceiptCardsPage from "~/components/retail-receipts/ReceiptsCardPage";
import Input from "~/components/ui/inputs/TextInputs";

export type OptionType = {
  label: string;
  value: string;
};

const RetailReceiptPage = () => {
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

  // Fetch metrics callback
  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (filterBy.value === "Monthly") {
        const [year, month] = operationDate.split("-");
        res = await fetchRetailReceiptsMetrics(Number(year), Number(month));
      } else if (filterBy.value === "Yearly" && selectedYear) {
        res = await fetchRetailReceiptsMetrics(Number(selectedYear.value));
      }

      if (res?.success) {
        setReceiptDataMetrics(res.data);
      } else {
        setReceiptDataMetrics(null);
      }
    } catch (error) {
      setReceiptDataMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [filterBy, operationDate, selectedYear]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Fetch retail data
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
        data = await fetchRetailReceiptsData(parsedYear, parsedMonth);

      } else if (filterBy.value === "Yearly" && selectedYear) {
        data = await fetchRetailReceiptsData(Number(selectedYear.value));
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
  }, [filterBy, operationDate, selectedYear]);

  useEffect(() => {
    fetchRetailData();
  }, [fetchRetailData]);

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
  } = useRetailReceiptProcessor(filterBy.value, operationDate, yearNumber);

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <div className="mx-auto px-0 py-1">
        <h1 className="text-3xl font-bold mb-3">STL Retail Receipt</h1>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-4">
          <div className="flex-[1_1_200px]">
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
                  control: (provided) => ({
                    ...provided,
                    borderColor: "#0038A8 !important", // Default blue border
                    fontSize: "0.875rem",
                    padding: "2px",
                    color: "inherit",
                    backgroundColor: "white",
                    cursor: "default",
                    "&:hover": {
                      borderColor: "#0038A8",
                    },
                    boxShadow: "none",
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 1000000,
                  }),
                  menu: (provided) => ({
                    ...provided,
                    maxHeight: 400,
                    overflowY: "auto",
                  }),
                }}
              />
            </div>
          </div>
          <div className="flex-[1_1_200px]">
            <div>
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
                  control: (provided) => ({
                    ...provided,
                    borderColor: "#0038A8 !important", // Default blue border
                    fontSize: "0.875rem",
                    padding: "2px",
                    color: "inherit",
                    backgroundColor: "white",
                    cursor: "default",
                    "&:hover": {
                      borderColor: "#0038A8",
                    },
                    boxShadow: "none",
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 1000000,
                  }),
                  menu: (provided) => ({
                    ...provided,
                    maxHeight: 400,
                    overflowY: "auto",
                  }),
                }}
                />
              )}
            </div>
          </div>
          <div className="flex-[1_1_200px]" />
          <div className="flex-[1_1_200px] content-end"></div>
          <div className="flex-[1_1_200px] content-end"></div>
        </div>

        {/* Cards */}
        <ReceiptCardsPage
          receiptDataMetrics={receiptDataMetrics}
          textlabel="Collection"
        />

        <div className="flex gap-6 mt-8 mb-3">
          <div className="w-1/2">
            <div className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
              <div className="flex flex-col">
                <span className="text-sm font-bold">STL Collections</span>
              </div>
                <div className="flex justify-center md:justify-end text-base font-semibold">
                  ₱ {receiptData?.Collections?.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                </div>
            </div>
          </div>
          <div className="w-1/2"></div>
        </div>

        {/* Accordion content below */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <GrossAACSharePage
                totalPercentage={aacTotalPercentage}
                totalShareAmount={aacTotalShareAmount}
                breakdown={aacBreakdown}
              />
              <AACTaxesPage
                totalPercentage={aacTaxTotalPercentage}
                totalShareAmount={aacTaxTotalShareAmount}
                breakdown={aacTaxBreakdown}
              />
              <NetAACIncomePage
                netAmount={netAacTotalAmount}
                netPercentage={netAacTotalPercentage}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <GrossPSCOSharePage
                totalPercentage={pcsoTotalPercentage}
                totalShareAmount={pcsoTotalShareAmount}
                breakdown={pcsoBreakdown}
              />
              <PCSOTaxesPage
                totalPercentage={pcsoTaxTotalPercentage}
                totalShareAmount={pcsoTaxTotalShareAmount}
                breakdown={pcsoTaxBreakdown}
              />
              <NetPSCOIncomePage
                netAmount={netPcsoTotalAmount}
                netPercentage={netPcsoTotalPercentage}
              />
            </div>
          </div>
        </div>
      </div>
    </AccessGuard>
  );
};

export default RetailReceiptPage;
