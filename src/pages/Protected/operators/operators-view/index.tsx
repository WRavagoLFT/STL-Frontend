import React, { useEffect, useState } from "react";
import OperatorViewPage from "~/components/operators/OperatorView";
import { useOperatorFormStore } from "../../../../store/useOperatorFormStore";
import { operatorSchema } from "~/schemas/operatorSchema";
import { Operator } from "~/types/types";
import RetailReceiptOperatorsPage from "~/components/operators/RetailReceipts";
import BackIconButton from "~/components/ui/icons/BackButton";
import router from "next/router";
import { editLogOperator } from "~/utils/api/operators";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { operatorEditColumns } from "~/config/operatorEditLogTableColumns";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { fetchFormOptionsData } from "~/hooks/userLoadOperators";

export interface OperatorViewPageProps {
  slug: string;
  operator: Operator;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug, operator }) => {
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
              schema={operatorSchema}
              isOpen={true}
              onClose={() => router.push("/operators")}
              onViewEditLogs={(operatorId) => handleViewEditLogs(operatorId)}
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
