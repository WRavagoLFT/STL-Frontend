'use client';

import React, { useEffect, useState } from "react";
import EditLogsTablePage from "../tables/EditLogTable";
import BackIconButton from "../icons/BackButton";

export interface EditModalPageProps {
  open: boolean;
  id: number;
  fetchData: (id: number) => Promise<any>;
  columns: any[];
  onClose: () => void;
  userTypeId?: number;
  selectedUser?: any;
  initialUserOperatorData?: any;
}

const EditModalPage: React.FC<EditModalPageProps> = ({
  open,
  id,
  fetchData,
  columns,
  onClose,
  userTypeId,
  selectedUser,
  initialUserOperatorData,
}) => {
  const [editData, setEditData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const title =
    userTypeId === 3 ? "Manager" :
    userTypeId === 4 ? "Executive" : "Operator";

  useEffect(() => {
    if (!open) return;

    const getEditData = async () => {
      setLoading(true);
      try {
        const response = await fetchData(id);
        if (response?.success) {
          setEditData(response.data || []);
        } else {
          setEditData([]);
        }
      } catch (err) {
        console.error("Failed to fetch edit logs:", err);
        setEditData([]);
      } finally {
        setLoading(false);
      }
    };

    getEditData();
  }, [id, fetchData, open]);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg px-4 pt-5 pb-10 max-w-[90%] sm:max-w-[80%] md:max-w-[800px] 
                   lg:max-w-[650px] xl:max-w-[990px] 
                   max-h-[90vh] w-full shadow-lg relative bg-[#F8F0E3]"
        onClick={(e) => e.stopPropagation()}
      >
        <BackIconButton
          bgColor="#ACA993"
          hoverColor="#9b987e"
          iconColor="#fff"
          size={30}
          onClick={onClose}
        />
        <div className="mt-3">
          <div className="text-2xl font-bold leading-none">
            {selectedUser?.FirstName ?? ""} {selectedUser?.LastName ?? ""} 
            {initialUserOperatorData?.data?.OperatorName ? `  ${initialUserOperatorData.data.OperatorName}` : ""}
          </div>
          <div className="text-sm mb-3">{title}</div>
          <EditLogsTablePage data={editData} columns={columns} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EditModalPage;
