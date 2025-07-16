"use client";

import { devicesTableColumns } from "@/config/devicesTableColumns";
import { DeviceItem, fetchDevices } from "@/lib/api/device/device.service";
import router, { useRouter } from "next/navigation";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { UsersSkeletonPage } from "../user/UsersSkeleton";
import Card from "../ui/dashboardcards/Cards";
import DetailedTable from "../ui/tables/DetailedTable";


export interface DeviceInfoSummary {
  TotalDevices: number;
  TotalActiveDevices: number;
  TotalDamagedDevices: number;
  TotalInactiveDevices: number;
  TotalNewDevices: number;
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const useLoadDevices = (
  setLoading: SetState<boolean>,
  setError: SetState<string | null>,
  setDevices: SetState<DeviceItem[]>,
  setDeviceInfoData: SetState<any>
) =>
    useCallback(async () => {
    setLoading(true);

    try {
      const result = await fetchDevices();

      if (!result || result.success === false) {
        setError(result?.message || "Failed to fetch devices.");
        setDevices([]);
        setDeviceInfoData(null);
        return;
      }

      const fetchedDevices: DeviceItem[] = result.data ?? [];

      setDevices(fetchedDevices);

      const summary: DeviceInfoSummary = {
        TotalDevices: fetchedDevices.length,
        TotalActiveDevices: fetchedDevices.filter(d => d.DeviceStatus === "Active").length,
        TotalDamagedDevices: fetchedDevices.filter(d => d.DeviceStatus === "Damaged").length,
        TotalInactiveDevices: fetchedDevices.filter(d => d.DeviceStatus === "Inactive").length,
        TotalNewDevices: fetchedDevices.filter(d => d.DeviceStatus === "New").length,
      };

      setDeviceInfoData(summary);
      setError(null); // clear previous error
    } catch (error) {
      console.error("Device fetch error:", error);
      setError("Unexpected error occurred.");
      setDevices([]);
      setDeviceInfoData(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setDevices, setDeviceInfoData]);

export const ParentDevicePage = () => {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [deviceInfoData, setDeviceInfoData] = useState<{
    TotalDevices: number;
    TotalActiveDevices: number;
    TotalDamagedDevices: number;
    TotalInactiveDevices: number;
    TotalNewDevices: number;
  } | null>(null);

  const tableColumns = devicesTableColumns();
  const loadData = useLoadDevices(
    setLoading,
    setError,
    setDevices,
    setDeviceInfoData 
  );

  // for dashboard data
  const calculatedDevices = useMemo(() => {
    if (!deviceInfoData) return [];

    const formatNumber = (value: number) => value.toLocaleString();

    return [
      {
        label: "Total Devices",
        value: formatNumber(deviceInfoData.TotalDevices),
      },
      {
        label: "Total Active Devices",
        value: formatNumber(deviceInfoData.TotalActiveDevices),
      },
      {
        label: "Total Damaged Devices",
        value: formatNumber(deviceInfoData.TotalDamagedDevices),
      },
      {
        label: "Total Inactive Devices",
        value: formatNumber(deviceInfoData.TotalInactiveDevices),
      },
      {
        label: "Total New Devices",
        value: formatNumber(deviceInfoData.TotalNewDevices),
      },
    ];
  }, [deviceInfoData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      {loading ? (
        <UsersSkeletonPage />
      ) : (
        <Suspense fallback={<UsersSkeletonPage />}>
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
                onAddClick={() =>
                  router.push("/device-information/device-information-add")
                }
                source="device"
              />
            </div>
          </div>
        </Suspense>
      )}
    </>
  );
};
