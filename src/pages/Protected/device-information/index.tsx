import React, { useState, useEffect, useCallback } from "react";
import { AccessGuard } from "~/components/auth/AccessGuard";
import Card from "~/components/ui/dashboardcards/Cards";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import { devicesTableColumns } from "~/config/devicesTableColumns";
import { Device } from "~/types/types";
import { fetchDevices } from "~/utils/api/device";

const DeviceInformationPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tableColumns = devicesTableColumns();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchDevices();

      if (result.success === false) {
        setError(result.message || "Failed to fetch devices.");
        setDevices([]);
      } else {
        setDevices(result.data ?? result);
      }
    } catch (err) {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AccessGuard allowedUserTypes={[1, 2, 3, 4, 5, 6]}>
      <div className="space-y-3 h-full">
        <h1 className="text-3xl font-bold">Device Information</h1>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} label={`Card ${index + 1}`} value={undefined} />
          ))}
        </div>
        <div className="">
          <DetailedTable 
            data={devices} 
            columns={tableColumns} 
            pageType="Device Information" 
          />
        </div>
      </div>
    </AccessGuard>
  );
};

export default DeviceInformationPage;
