import React, { useEffect, useState } from "react";
import EditLogsTablePage from "../tables/EditLogsTable";

export interface EditModalPageProps {
  open: boolean;
  id: number;
  fetchData: (id: number) => Promise<any>;
  columns: any[];
  onClose: () => void;
}

const EditModalPage: React.FC<EditModalPageProps> = ({
  open,
  id,
  fetchData,
  columns,
  onClose,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return; // only fetch when modal is open

    const getEditData = async () => {
      setLoading(true);
      const response = await fetchData(id);
      //console.log("Edit data response:", response);
      if (response?.success) {
        setData(response.data || []);
      }
      setLoading(false);
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

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg px-3 py-5 max-w-4xl w-full shadow-lg relative bg-[#F8F0E3]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="mt-4">
          <div className="text-2xl font-bold leading-none">
            {data.length > 0 ? data[0].User : ""}
          </div>
          <div className="text-sm mb-3">{data.length > 0 ? data[0].User : ""}</div>
          <EditLogsTablePage data={data} columns={columns} />
        </div>

      </div>
    </div>
  );
};

export default EditModalPage;
