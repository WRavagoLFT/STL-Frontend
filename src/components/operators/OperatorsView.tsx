"use client";

import React, { useEffect, useState } from "react";
import OperatorViewPage from "~/components/operators/UpdateOperatorForm";
import { Operator } from "~/types/types";
import RetailReceiptOperatorsPage from "~/components/operators/RetailReceipts";
import BackIconButton from "~/components/ui/icons/BackButton";
import router, { useRouter } from "next/navigation";
import { editLogOperator, updateOperator } from "~/lib/api/operators";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { operatorEditColumns } from "~/config/operatorEditLogTableColumns";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { fetchFormOptionsData } from "~/hooks/userLoadOperators";
import Swal from "sweetalert2";
import { useOperatorFormStore } from "~/store/useOperatorFormStore";

export interface OperatorViewPageProps {
  slug: string;
  operator: Operator;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug, operator }) => {
  const router = useRouter();
  const [showEditLog, setShowEditLog] = useState(false);
  const editLogtableColumns = operatorEditColumns();
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    null
  );

  const handleViewEditLogs = (operatorId: number) => {
    setSelectedOperatorId(operatorId); // save the operatorId you want to view
    setShowEditLog(true); // then open modal
  };

  const {
    gameTypes,
    regions,
    provinces,
    cities,
    areaOfOperations,
  } = useOperatorFormStore();

  //console.log("operatorrr console", operator);
  
  useEffect(() => {
    fetchFormOptionsData();
  }, []);

  const handleUpdateOperator = async (data: Operator): Promise<void> => {
    try {
      console.log("[handleUpdateOperator] Called with data:", data);

      if (!data.operatorId) {
        console.warn("[handleUpdateOperator] Missing operatorId in data:", data);
        throw new Error("Operator ID is required to update operator.");
      }

      console.log("[handleUpdateOperator] Sending update request to backend with operatorId:", data.operatorId);
      const result = await updateOperator(data);

      console.log("[handleUpdateOperator] Response from updateOperator:", result);

      if (result.success) {
        // Optional: log exactly what was updated
        console.log("[handleUpdateOperator] Operator updated successfully:", {
          operatorId: data.operatorId,
          updatedFields: data,
        });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Optional: reload or re-fetch data here
        // await loadData();

      } else {
        console.error("[handleUpdateOperator] Update failed. Message:", result.message);
        console.error("[handleUpdateOperator] Response data:", result.data);

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Something went wrong while updating the user.",
        });
      }

    } catch (error) {
      const err = error as Error;

      console.error("[handleUpdateOperator] Unexpected error occurred:", err);
      console.error("[handleUpdateOperator] Stack Trace:", err.stack);

      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: err.message || "An unexpected error occurred.",
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
          {/* Left side - Operator View */}
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

            {selectedOperatorId !== null && showEditLog && (
              <>
                <EditModalPage
                  open={showEditLog}
                  id={selectedOperatorId}
                  fetchData={editLogOperator}
                  columns={editLogtableColumns}
                  onClose={() => setShowEditLog(false)}
                  initialUserOperatorData={operator}
                />
              </>
            )}
          </div>

          {/* Right side - Retail Receipt */}
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
