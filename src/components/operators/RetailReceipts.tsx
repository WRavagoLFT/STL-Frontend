import React, { useEffect, useState } from "react";
import GrossAACSharePage from "../retail-receipts/GrossAACShare";
import { useRetailReceiptProcessor } from "~/components/retail-receipts/useRetailReceiptProcessor";
import { fetchRetailReceipts } from "~/utils/api/transactions";
import AACTaxesPage from "../retail-receipts/ACCSTaxes";
import NetAACIncomePage from "../retail-receipts/NetAACIncome";
import GrossPSCOSharePage from "../retail-receipts/GrossPSCOShare";
import PCSOTaxesPage from "../retail-receipts/PCSOTaxes";
import NetPSCOIncomePage from "../retail-receipts/NetPSCOIncome";

const RetailReceiptOperatorsPage = ({ operatorId }: { operatorId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  // set default current month
  const [operationDate, setOperationDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [receiptData, setReceiptData] = useState<any | null>(null);

  // /transactions/getRetailReceipts/:year/:month for AAC and PCSO receipts
  useEffect(() => {
    const [year, month] = operationDate.split("-");

    fetchRetailReceipts(Number(year), Number(month), operatorId).then(
      (data) => {
        if (data?.success) {
          setReceiptData(data.data);
        }
      }
    );
  }, [operationDate, operatorId]);

  // console.log('OPERATOR ID IN THE COMPONENT:', operatorId);
  // console.log("Operator ID passed to useRetailReceiptProcessor:", operatorId);

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
  } = useRetailReceiptProcessor(operationDate, operatorId);

  return (
    <div className="flex flex-col">
      <div className="text-base font-bold mb-2">Retail Receipts</div>
      <div className="flex flex-col gap-1 mb-4">
        <label
          htmlFor="dateofReport"
          className="font-medium text-sm text-gray-700"
        >
          Date of Report
        </label>
        <input
          id="dateofReport"
          type="month"
          className="w-full border rounded px-3 py-1.5 text-sm bg-[#F8F0E3] border-[#0038A8]"
          value={operationDate}
          onChange={(e) => setOperationDate(e.target.value)}
          max={new Date().toISOString().slice(0, 7)}
        />
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
