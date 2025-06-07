import router from "next/router";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AccessGuard } from "~/components/auth/AccessGuard";
import UpdateDeviceForm from "~/components/device-information/UpdateDeviceForm";
import Card from "~/components/ui/dashboardcards/Cards";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import { devicesTableColumns } from "~/config/devicesTableColumns";
import { Device } from "~/types/types";
import { fetchDevices } from "~/utils/api/device";

const DeviceInformationPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfoData, setDeviceInfoData] = useState<{
    TotalDevices: number;
    TotalActiveDevices: number;
    TotalDamagedDevices: number;
    TotalInactiveDevices: number;
    TotalNewDevices: number;
  } | null>(null);

  const tableColumns = devicesTableColumns();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchDevices();
      console.log(result);

      if (result.success === false) {
        setError(result.message || "Failed to fetch devices.");
        setDevices([]);
        setDeviceInfoData(null);
      } else {
        const fetchedDevices = result.data ?? result;

        setDevices(fetchedDevices);

        // Calculate device summary data
        const summary = {
          TotalDevices: fetchedDevices.length,
          TotalActiveDevices: fetchedDevices.filter((d: Device) => d.DeviceStatus === "Active").length,
          TotalDamagedDevices: fetchedDevices.filter((d: Device) => d.DeviceStatus === "Damaged").length,
          TotalInactiveDevices: fetchedDevices.filter((d: Device) => d.DeviceStatus === "Inactive").length,
          TotalNewDevices: fetchedDevices.filter((d: Device) => d.DeviceStatus === "New").length,
        };

        setDeviceInfoData(summary);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  // for dashboard data
  const calculatedDevices = useMemo(() => {
    if (!deviceInfoData) return [];

    const formatNumber = (value: number) => value.toLocaleString();

    return [
      { label: "Total Devices", value: formatNumber(deviceInfoData.TotalDevices) },
      { label: "Total Active Devices", value: formatNumber(deviceInfoData.TotalActiveDevices) },
      { label: "Total Damaged Devices", value: formatNumber(deviceInfoData.TotalDamagedDevices) },
      { label: "Total Inactive Devices", value: formatNumber(deviceInfoData.TotalInactiveDevices) },
      { label: "Total New Devices", value: formatNumber(deviceInfoData.TotalNewDevices) },
    ];
  }, [deviceInfoData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AccessGuard allowedUserTypes={[5]}>
      <div className="space-y-3 h-full">
        <h1 className="text-3xl font-bold">Device Information</h1>
        <div className="flex flex-wrap gap-4">
          {calculatedDevices.map((item, index) => (
            <Card key={index} label={item.label} value={item.value} />
          ))}
        </div>
        <div>
          <DetailedTable 
            data={devices} 
            columns={tableColumns} 
            pageType="Device Information" 
            onAddClick={() => router.push("/device-information/device-information-add")}
            source="device"
          />
        
        </div>
      </div>
    </AccessGuard>
  );
};

export default DeviceInformationPage;
