"use client";

import React, { useEffect, useState } from "react";
import router, { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BackIconButton from "@/components/ui/icons/BackButton";
import { operatorEditColumns } from "@/config/operatorEditLogTableColumns";
import { AccessGuard } from "@/components/auth/AccessGuard";
import { fetchFormOptionsData } from "@/hooks/userLoadOperators";
import Swal from "sweetalert2";
import { useOperatorFormStore } from "@/store/useOperatorFormStore";
import {
  OperatorsItem,
  updateOperator,
  UpdateOperatorPayload,
  editLogOperator,
} from "@/lib/api/operators/operators.service";
import EditModalPage from "../ui/modals/EditLogModalWrapper";
import RetailReceiptOperatorsPage from "./RetailReceipts";
const OperatorViewPage = dynamic(() => import("@/components/operators/UpdateOperatorForm"));

interface OperatorViewPageProps {
  slug: string;
  operator: OperatorsItem;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug, operator }) => {
  const router = useRouter();
  const [showEditLog, setShowEditLog] = useState(false);
  const editLogtableColumns = operatorEditColumns();
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    null
  );
  const [editLoading, setEditLoading] = useState(false);

  const handleViewEditLogs = async (operatorId: number) => {
    setEditLoading(true);
    setSelectedOperatorId(operatorId);

    try {
      setShowEditLog(true); // Show only after "loading" is ready
    } finally {
      setEditLoading(false);
    }
  };

  const { gameTypes, regions, provinces, cities, areaOfOperations } =
    useOperatorFormStore();

  useEffect(() => {
    fetchFormOptionsData();
  }, []);

  const handleUpdateOperator = async (
    data: UpdateOperatorPayload
  ): Promise<void> => {
    if (!data.operatorId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Operator ID",
        text: "Operator ID is required to update operator.",
      });
      return;
    }

    try {
      const result = await updateOperator(data);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Optional: re-fetch or refresh data
        await fetchFormOptionsData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            result.message || "Something went wrong while updating the user.",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: err?.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <AccessGuard allowedUserTypes={[6]}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center space-x-4">
          <BackIconButton
            to="/operators"
            bgColor="#0038A8"
            hoverColor="#004ccf"
            iconColor="#fff"
            size={30}
            onClick={() => {
              router.push("/operators");
            }}
          />
          <div className="text-2xl md:text-3xl font-bold truncate">
            {operator?.data.OperatorName || "N/A"}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-4 w-full mt-1">
          <div className="flex flex-col w-full md:w-3/5">
            <OperatorViewPage
              initialUserOperatorData={operator}
              gameTypes={gameTypes}
              provinces={provinces}
              regions={regions}
              cities={cities}
              areaofoperations={areaOfOperations}
              onClose={() => router.push("/operators")}
              onViewEditLogs={(operatorId) => handleViewEditLogs(operatorId)}
              onSubmit={handleUpdateOperator}
            />

            {selectedOperatorId !== null && showEditLog && !editLoading && (
              <EditModalPage
                open={showEditLog}
                id={selectedOperatorId}
                fetchData={editLogOperator}
                columns={editLogtableColumns}
                onClose={() => setShowEditLog(false)}
                initialUserOperatorData={operator}
              />
            )}
          </div>

          <div className="flex flex-col w-full md:w-2/5 min-w-0">
            <RetailReceiptOperatorsPage
              operatorId={operator?.data.OperatorId}
            />
          </div>
        </div>
      </div>
    </AccessGuard>
  );
};

export default OperatorsView;
