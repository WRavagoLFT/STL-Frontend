import React, { useEffect, useState } from "react";
import { Device } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import Swal from "sweetalert2";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import dayjs from "dayjs";
import { getUsageNotes } from "~/pages/Protected/device-information/device-information-view";

interface UpdateDeviceFormProps {
  title?: string;
  onSubmit: (data: Device) => void;
  onClose?: () => void;

  device?: Device;
  deviceId?: Device;
  slug?: string;
  userid?: number;
}

const UpdateDeviceForm: React.FC<UpdateDeviceFormProps> = ({
  onSubmit,
  onClose,
  device,
  deviceId,
  userid,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  //console.log('PASSED DEVICE ID', deviceId);
  //console.log('PASSED DEVICE', device);
  const [usageNotes, setUsageNotes] = useState<any[]>([]);

  const usageNotesOptions = usageNotes.map((un) => ({
    value: un.DeviceUsageNotesId.toString(),
    label: un.DeviceUsageNotes,
  }));

  useEffect(() => {
    getUsageNotes(setUsageNotes);
  }, []);

  console.log('DEVICE', device);
  //console.log('USAGE NOTES IN THE UPDATE', usageNotes);

  const [isDisabled, setIsDisabled] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  
  const handleDisable = () => {
    setTimeout(() => {
      setIsDisabled(false);
    }, 0); // Slight delay to prevent immediate "Save" click
  };

  const handleModalClose = () => {
    // Close the confirm modal and the parent AddUserModal
    closeConfirmModal();
    if (onClose) onClose();
  };

  const alwaysDisabledKeys = ["name", "LastName"];

  const formik = useFormik({
    initialValues: {
      deviceId: device?.DeviceId || "",
      assignmentDate: device?.AssignmentDate || "",
      simNumber: device?.SIMNumber || "",
      telcoProvider: device?.TelcoProvider || "",
      dataPlan: device?.DataPlan || "",
      usageNotes: device?.UsageNotes || "",

      issuedBy: device?.OperatorName || "",
      lastknownGPS: device?.lastknownGPS || "",
      lastSyncTimestamp: device?.LastSyncTimestamp || "",
      unauthorizedLocationAlerts: device?.unauthorizedLocationAlerts || "",
      dataStatus: device?.DeviceStatus || "",
      lastMaintenance: device?.LastMaintenanceDate || "",
      replacementHistory: device?.LastReplacementDate || "",
      applicationVersion: device?.ApplicationVersion || "",
      dateInstalled: device?.DateApplicationInstalled || "",
      lastLoginTime: device?.DateApplicationUpdated || "",
      lastAppUpdated: device?.DateApplicationUpdated || "",

      remarks: device?.remarks || "",
    },
    // validationSchema: toFormikValidationSchema(operatorSchema),
    onSubmit: async (values) => {
      console.log("Form submitted. Raw values from Formik:", values);

      try {
        const result = await Swal.fire({
          title: "Update Confirmation",
          text: "Did you enter the correct details?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, I did",
          cancelButtonText: "No, let me check",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });

        if (result.isConfirmed) {
          console.log("User confirmed submission in SweetAlert dialog.");

          // Clean data by removing null, undefined, or empty strings
          const cleanedData = Object.fromEntries(
            Object.entries(values).filter(([_, value]) =>
              value !== null && value !== undefined && value !== ""
            )
          );

          if (values.deviceId) {
            cleanedData.deviceId = values.deviceId;
          }

          // Add assignedUser if present
          // cleanedData.assignedUser = userid || 0;

          console.log("Data prepared for final submission (cleaned):", cleanedData);

          setFormData(cleanedData);
          openConfirmModal();
        } else {
          console.log("User canceled confirmation dialog. Submission aborted.");
        }
      } catch (error) {
        console.error("Unexpected error during submission confirmation flow:", error);
      }
    },
  });

  // Helpers to display errors
  const getError = (field: string) =>
    formik.touched[field as keyof typeof formik.touched] &&
    formik.errors[field as keyof typeof formik.errors]
      ? (formik.errors[field as keyof typeof formik.errors] as string)
      : null;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-x-6 gap-y-2">
          <div className="text-md font-bold">Device Information</div>
          <div>
            <label htmlFor="assignmentDate" className="block text-sm">
              Assignment Date
            </label>
            <Input
              type="device"
              id="assignmentDate"
              className="mt-1"
              value={
                formik.values.assignmentDate
                  ? dayjs(formik.values.assignmentDate).format(
                      "MM/DD/YYYY hh:mm A"
                    )
                  : ""
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                const parsedDate = dayjs(inputValue, "MM/DD/YYYY", true);
                if (parsedDate.isValid()) {
                  formik.setFieldValue(
                    "assignmentDate",
                    parsedDate.format("YYYY-MM-DD")
                  );
                } else {
                  formik.setFieldValue("assignmentDate", "");
                }
              }}
              disabled
              error={
                !!(
                  formik.touched.assignmentDate && formik.errors.assignmentDate
                )
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("assignmentDate") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="issuedBy" className="block text-sm">
              Issued by
            </label>
            <Input
              type="text"
              id="issuedBy"
              placeholder="-"
              className="mt-1"
              {...formik.getFieldProps("issuedBy")}
              disabled
              error={!!(formik.touched.issuedBy && formik.errors.issuedBy)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("issuedBy") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="usageNotes" className="block text-sm mb-1">
              Usage Notes / Restrictions
            </label>
              <CustomSelect
                name="usageNotes"
                options={usageNotesOptions}
                value={
                  usageNotesOptions.find(
                    (opt) => opt.label === formik.values.usageNotes
                  ) || null
                }
                onChange={(e) => {
                  formik.setFieldValue("usageNotes", e.target.value);
                }}
                disabled
                error={!!getError("usageNotes")}
              />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("usageNotes") || "\u00A0"}
            </p>
          </div>
          <div className="text-md font-bold">Live Tracking</div>
          <div>
            <label htmlFor="lastknownGPS" className="block text-sm">
              Last Known GPS Coordinates
            </label>
            <Input
              type="text"
              id="lastknownGPS"
              placeholder="-"
              className="mt-1"
              disabled
              {...formik.getFieldProps("lastknownGPS")}
              error={
                !!(formik.touched.lastknownGPS && formik.errors.lastknownGPS)
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("lastknownGPS") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="lastSyncTimestamp" className="block text-sm">
              Last Sync Timestamp
            </label>
            <Input
              type="text"
              id="lastSyncTimestamp"
              placeholder="-"
              className="mt-1"
              disabled
              value={
                formik.values.assignmentDate
                  ? dayjs(formik.values.assignmentDate).format(
                      "MM/DD/YYYY hh:mm A"
                    )
                  : ""
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                const parsedDate = dayjs(inputValue, "MM/DD/YYYY", true);
                if (parsedDate.isValid()) {
                  formik.setFieldValue(
                    "assignmentDate",
                    parsedDate.format("YYYY-MM-DD")
                  );
                } else {
                  formik.setFieldValue("assignmentDate", "");
                }
              }}
              error={
                !!(
                  formik.touched.lastSyncTimestamp &&
                  formik.errors.lastSyncTimestamp
                )
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("lastSyncTimestamp") || "\u00A0"}
            </p>
          </div>

          <div>
            <label
              htmlFor="unauthorizedLocationAlerts"
              className="block text-sm"
            >
              Unauthorized Location Alerts
            </label>
            <Input
              type="text"
              id="unauthorizedLocationAlerts"
              placeholder="-"
              className="mt-1"
              disabled
              {...formik.getFieldProps("unauthorizedLocationAlerts")}
              error={
                !!(
                  formik.touched.unauthorizedLocationAlerts &&
                  formik.errors.unauthorizedLocationAlerts
                )
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("unauthorizedLocationAlerts") || "\u00A0"}
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-x-6 gap-y-2">
          <div className="text-md font-bold">SIM & Connectivity</div>
          <div>
            <label htmlFor="simNumber" className="block text-sm">
              Assigned SIM Number
            </label>
            <Input
              type="tel"
              id="simNumber"
              placeholder="Enter Assigned SIM Number"
              className="mt-1"
              {...formik.getFieldProps("simNumber")}
              disabled={alwaysDisabledKeys.includes("simNumber") || isDisabled}
              error={!!(formik.touched.simNumber && formik.errors.simNumber)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("simNumber") || "\u00A0"}
            </p>
          </div>
          <div>
            <label htmlFor="telcoProvider" className="block text-sm">
              Telco Provider
            </label>
            <Input
              type="tel"
              id="telcoProvider"
              placeholder="Enter Telco Provider"
              className="mt-1"
              {...formik.getFieldProps("telcoProvider")}
              error={
                !!(formik.touched.telcoProvider && formik.errors.telcoProvider)
              }
              disabled
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("telcoProvider") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="dataPlan" className="block text-sm">
              Data Plan
            </label>
            <Input
              type="tel"
              id="dataPlan"
              placeholder="Enter Data Plan"
              className="mt-1"
              {...formik.getFieldProps("dataPlan")}
              disabled={alwaysDisabledKeys.includes("dataPlan") || isDisabled}
              error={!!(formik.touched.dataPlan && formik.errors.dataPlan)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("dataPlan") || "\u00A0"}
            </p>
          </div>
          <div className="text-md font-bold">Maintenance & Support</div>

          <div>
            <label htmlFor="dataStatus" className="block text-sm">
              Device Status
            </label>
            <Input
              type="text"
              id="dataStatus"
              placeholder="-"
              className="mt-1"
              disabled={alwaysDisabledKeys.includes("dataStatus") || isDisabled}
              {...formik.getFieldProps("dataStatus")}
              error={!!(formik.touched.dataStatus && formik.errors.dataStatus)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("dataStatus") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="lastMaintenance" className="block text-sm">
              Last Maintenance
            </label>
            <Input
              type="date"
              id="lastMaintenance"
              placeholder="-"
              className="mt-1"
              disabled={
                alwaysDisabledKeys.includes("lastMaintenance") || isDisabled
              }
              {...formik.getFieldProps("lastMaintenance")}
              error={
                !!(
                  formik.touched.lastMaintenance &&
                  formik.errors.lastMaintenance
                )
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("lastMaintenance") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="replacementHistory" className="block text-sm">
              Replacement History
            </label>
            <Input
              type="date"
              id="replacementHistory"
              placeholder="-"
              className="mt-1"
              disabled={
                alwaysDisabledKeys.includes("replacementHistory") || isDisabled
              }
              {...formik.getFieldProps("replacementHistory")}
              error={
                !!(
                  formik.touched.replacementHistory &&
                  formik.errors.replacementHistory
                )
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("replacementHistory") || "\u00A0"}
            </p>
          </div>
        </div>
      </div>

      <div className="text-md font-bold mb-2 my-2">Application Information</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <label htmlFor="applicationVersion" className="block text-sm">
            Application Version
          </label>
          <Input
            type="text"
            id="applicationVersion"
            placeholder="-"
            className="mt-1"
            disabled
            {...formik.getFieldProps("applicationVersion")}
            error={
              !!(
                formik.touched.applicationVersion &&
                formik.errors.applicationVersion
              )
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("applicationVersion") || "\u00A0"}
          </p>
        </div>
        <div>
          <label htmlFor="lastLoginTime" className="block text-sm">
            Last Application Login Time
          </label>
          <Input
            type="text"
            id="lastLoginTime"
            placeholder="-"
            className="mt-1"
            disabled
            value={
              formik.values.assignmentDate
                ? dayjs(formik.values.assignmentDate).format(
                    "MM/DD/YYYY hh:mm A"
                  )
                : ""
            }
            onChange={(e) => {
              const inputValue = e.target.value;
              const parsedDate = dayjs(inputValue, "MM/DD/YYYY", true);
              if (parsedDate.isValid()) {
                formik.setFieldValue(
                  "assignmentDate",
                  parsedDate.format("YYYY-MM-DD")
                );
              } else {
                formik.setFieldValue("assignmentDate", "");
              }
            }}
            error={
              !!(formik.touched.lastLoginTime && formik.errors.lastLoginTime)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("lastLoginTime") || "\u00A0"}
          </p>
        </div>

        <div>
          <label htmlFor="dateInstalled" className="block text-sm">
            Date Application Installed
          </label>
          <Input
            type="text"
            id="dateInstalled"
            placeholder="-"
            className="mt-1"
            disabled
            value={
              formik.values.assignmentDate
                ? dayjs(formik.values.assignmentDate).format(
                    "MM/DD/YYYY hh:mm A"
                  )
                : ""
            }
            onChange={(e) => {
              const inputValue = e.target.value;
              const parsedDate = dayjs(inputValue, "MM/DD/YYYY", true);
              if (parsedDate.isValid()) {
                formik.setFieldValue(
                  "assignmentDate",
                  parsedDate.format("YYYY-MM-DD")
                );
              } else {
                formik.setFieldValue("assignmentDate", "");
              }
            }}
            error={
              !!(formik.touched.dateInstalled && formik.errors.dateInstalled)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("dateInstalled") || "\u00A0"}
          </p>
        </div>
        <div>
          <label htmlFor="lastAppUpdated" className="block text-sm">
            Last Application Updated
          </label>
          <Input
            type="text"
            id="lastAppUpdated"
            placeholder="-"
            className="mt-1"
            disabled
            value={
              formik.values.assignmentDate
                ? dayjs(formik.values.assignmentDate).format(
                    "MM/DD/YYYY hh:mm A"
                  )
                : ""
            }
            onChange={(e) => {
              const inputValue = e.target.value;
              const parsedDate = dayjs(inputValue, "MM/DD/YYYY", true);
              if (parsedDate.isValid()) {
                formik.setFieldValue(
                  "assignmentDate",
                  parsedDate.format("YYYY-MM-DD")
                );
              } else {
                formik.setFieldValue("assignmentDate", "");
              }
            }}
            error={
              !!(formik.touched.lastAppUpdated && formik.errors.lastAppUpdated)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("lastAppUpdated") || "\u00A0"}
          </p>
        </div>
      </div>

      {/* Remarks input shown only when editing */}
      {!isDisabled && (
        <div className="col-span-2 my-1">
          <label htmlFor="remarks" className="block text-sm">
            Remarks
          </label>
          <Input
            type="text"
            name="remarks"
            id="remarks"
            className="mt-1"
            value={formik.values.remarks}
            onChange={formik.handleChange}
            error={!!(formik.touched.remarks && formik.errors.remarks)}
          />
          {formik.touched.remarks && formik.errors.remarks && (
            <p className="text-[#CE1126] text-xs mt-1">
              {formik.errors.remarks}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-2">
        {isDisabled ? (
          <button
            type="button"
            className="w-full mt-3 px-7 py-2 bg-[#F6BA12] text-black text-sm rounded transition"
            onClick={handleDisable}
          >
            Update
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="w-full mt-3 px-7 py-2 bg-[#F6BA12] text-black text-sm rounded transition"
              disabled={!formik.isValid}
            >
              Save
            </button>
          </>
        )}
      </div>

      <ConfirmUserActionModalPage
        open={isConfirmModalOpen}
        onClose={handleModalClose}
        onConfirm={async () => {
          try {
            await onSubmit(formData as unknown as Device); // submit from the parent component handled after password verification
            closeConfirmModal(); // close confirm modal
            if (onClose) onClose(); // optionally close the parent modal
          } catch (err) {
            console.error("Error during onSubmit:", err);
          }
        }}
      />
    </form>
  );
};

export default UpdateDeviceForm;
