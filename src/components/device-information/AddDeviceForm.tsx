"use client";

import React, { useEffect, useState } from "react";
import Input from "../ui/inputs/TextInputs";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import Swal from "sweetalert2";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { addDeviceSchema } from "~/schemas/deviceSchema";
import { getUsageNotes } from "./ParentDeviceView";
import { AddDevicePayload } from "~/lib/api/device/device.service";

interface AddDeviceFormProps {
  title?: string;
  onSubmit: (data: AddDevicePayload) => void;
  initialData?: Partial<AddDevicePayload>;
  onClose?: () => void;
  userid?: number;
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({
  onSubmit,
  initialData = {},
  onClose,
  userid,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [usageNotes, setUsageNotes] = useState<any[]>([]);

  const usageNotesOptions = usageNotes.map((un) => ({
    value: un.DeviceUsageNotesId.toString(),
    label: un.DeviceUsageNotes,
  }));

  //console.log('USAGE NOTES OPTIONS', usageNotesOptions);
  //console.log('USAGE NOTES IN THE ADD', usageNotes);

  useEffect(() => {
    getUsageNotes(setUsageNotes);
  }, []);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  
  //console.log('USER ID FROM THE KABO/KUBRADOR PAGE', userid);

  const handleModalClose = () => {
    // Close the confirm modal and the parent AddUserModal
    closeConfirmModal();
    if (onClose) onClose();
  };

  const formik = useFormik({
    initialValues: {
      assignmentDate: initialData.assignmentDate || "",
      simNumber: initialData.simNumber || "",
      telcoProvider: initialData.telcoProvider || "",
      dataPlan: initialData.dataPlan || "",
      usageNotes: initialData.usageNotes || "",

      issuedBy: initialData.issuedBy || "",
      lastknownGPS: initialData.lastknownGPS || "",
      lastSyncTimestamp: initialData.lastSyncTimestamp || "",
      unauthorizedLocationAlerts: initialData.unauthorizedLocationAlerts || "",
      dataStatus: initialData.dataStatus || "",
      lastMaintenance: initialData.lastMaintenance || "",
      replacementHistory: initialData.replacementHistory || "",
      applicationVersion: initialData.applicationVersion || "",
      dateInstalled: initialData.dateInstalled || "",
      lastLoginTime: initialData.lastLoginTime || "",
      lastAppUpdated: initialData.lastAppUpdated || "",
    },

    validationSchema: toFormikValidationSchema(addDeviceSchema),
    onSubmit: async (values) => {
      //console.log("Form submitted. Raw values from Formik:", values);
      try {
        const result = await Swal.fire({
          title: "<strong>Add Confirmation</strong>",
          html: `Did you enter the correct details?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#EF4444",
          cancelButtonColor: "#3B82F6",
          confirmButtonText: '<i class="fa fa-ban"></i> Yes, I did',
          cancelButtonText: 'No, let me check',
          customClass: {
            popup: 'bg-[#FFFFFF] text-black rounded-md',
            title: 'text-lg font-semibold',
            confirmButton: 'bg-[#0038A8] rounded-md text-white text-base hover:bg-blue-700 px-8 py-1',
            cancelButton: 'bg-transparent px-4 text-base',
          },
          buttonsStyling: false,
        });

        if (result.isConfirmed) {
          //console.log("User confirmed submission in SweetAlert dialog.");

          const cleanedData = Object.entries(values).reduce(
            (acc, [key, value]) => {
              if (value !== null && value !== undefined && value !== "") {
                acc[key] = value;
              }
              return acc;
            }, {} as { [key: string]: string | number | string[] }
          );

          cleanedData.assignedUser = userid || 0;

          //console.log("Data prepared for final submission (cleaned):", cleanedData);

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

  const getError = (field: string) =>
    formik.touched[field as keyof typeof formik.touched] &&
    formik.errors[field as keyof typeof formik.errors]
      ? (formik.errors[field as keyof typeof formik.errors] as string)
      : null;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-x-6 gap-y-2">
          <div className="text-md font-bold">Device Information</div>
          <div>
            <label htmlFor="assignmentDate" className="block text-sm">
              Assignment Date
            </label>
            <Input
              type="date"
              id="assignmentDate"
              placeholder="Select Assignment Date"
              className="mt-1"
              {...formik.getFieldProps("assignmentDate")}
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
              error={
                !!(
                  formik.touched.assignmentDate && formik.errors.assignmentDate
                )
              }
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
                     (opt) => opt.value === formik.values.usageNotes?.toString()
                   ) || null
                 }
              onChange={(e) => {
                formik.setFieldValue("usageNotes", e.target.value);
              }}
              placeholder="Select Usage Notes"
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
                !!(
                  formik.touched.lastknownGPS && formik.errors.lastknownGPS
                )
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
              {...formik.getFieldProps("lastSyncTimestamp")}
              error={
                !!(
                  formik.touched.lastSyncTimestamp && formik.errors.lastSyncTimestamp
                )
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("lastSyncTimestamp") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="unauthorizedLocationAlerts" className="block text-sm">
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
                  formik.touched.unauthorizedLocationAlerts && formik.errors.unauthorizedLocationAlerts
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
              disabled
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
              disabled
              {...formik.getFieldProps("lastMaintenance")}
              error={!!(formik.touched.lastMaintenance && formik.errors.lastMaintenance)}
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
              disabled
              {...formik.getFieldProps("replacementHistory")}
              error={!!(formik.touched.replacementHistory && formik.errors.replacementHistory)}
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
              !!(formik.touched.applicationVersion && formik.errors.applicationVersion)
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
            {...formik.getFieldProps("lastLoginTime")}
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
            type="date"
            id="dateInstalled"
            placeholder="-"
            className="mt-1"
            disabled
            {...formik.getFieldProps("dateInstalled")}
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
            type="date"
            id="lastAppUpdated"
            placeholder="-"
            className="mt-1"
            disabled
            {...formik.getFieldProps("lastAppUpdated")}
            error={
              !!(formik.touched.lastAppUpdated && formik.errors.lastAppUpdated)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("lastAppUpdated") || "\u00A0"}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2 mt-4"
        >
          Add Device
        </button>

        <ConfirmUserActionModalPage
          open={isConfirmModalOpen}
          onClose={handleModalClose}
          mode="add"
          onConfirm={async () => {
            try {
              await onSubmit(formData as unknown as AddDevicePayload); // submit from the parent component handled after password verification
              closeConfirmModal(); // close confirm modal
              if (onClose) onClose(); // optionally close the parent modal
            } catch (err) {
              console.error("Error during onSubmit:", err);
            }
          }}
        />
      </div>
    </form>
  );
};

export default AddDeviceForm;
