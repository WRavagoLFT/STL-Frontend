import React, { useState } from "react";
import { Device } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import Swal from "sweetalert2";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";

interface UpdateDeviceFormProps {
  title?: string;
  onSubmit: (data: Device) => void;
  initialData?: Partial<Device>;
  onClose?: () => void;

  device?: Device;
  slug?: string;
}

const UpdateDeviceForm: React.FC<UpdateDeviceFormProps> = ({
  onSubmit,
  initialData = {},
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

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
    },
    // validationSchema: toFormikValidationSchema(operatorSchema),
    onSubmit: async (values) => {
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
        const submittedData: { [key: string]: string | number | string[] } = {
          ...values,
        };
        setFormData(submittedData);
        openConfirmModal();
      }
      // If canceled, do nothing
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
              placeholder="Select Assignment Date"
              className="mt-1"
              {...formik.getFieldProps("issuedBy")}
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
              //options={usageNotesOptions}
              //   value={
              //     pcsoBranchOptions.find(
              //       (opt) => opt.value === formik.values.usageNotes?.toString()
              //     ) || null
              //   }
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
            <label htmlFor="issuedBy" className="block text-sm">
              Last Known GPS Coordinates
            </label>
            <Input
              type="text"
              id="issuedBy"
              placeholder="Select Assignment Date"
              className="mt-1"
              {...formik.getFieldProps("issuedBy")}
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
            <label htmlFor="issuedBy" className="block text-sm">
              Last Sync Timestamp
            </label>
            <Input
              type="text"
              id="issuedBy"
              placeholder="Select Assignment Date"
              className="mt-1"
              {...formik.getFieldProps("issuedBy")}
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
            <label htmlFor="issuedBy" className="block text-sm">
              Unauthorized Location Alerts
            </label>
            <Input
              type="text"
              id="issuedBy"
              placeholder="Select Assignment Date"
              className="mt-1"
              {...formik.getFieldProps("issuedBy")}
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
            <label htmlFor="dataPlan" className="block text-sm">
              Device Status
            </label>
            <Input
              type="text"
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

          <div>
            <label htmlFor="dataPlan" className="block text-sm">
              Last Maintenance
            </label>
            <Input
              type="date"
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

          <div>
            <label htmlFor="dataPlan" className="block text-sm">
              Replacement History
            </label>
            <Input
              type="date"
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
        </div>
      </div>

      <div className="text-md font-bold mb-2 my-2">Application Information</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <label htmlFor="issuedBy" className="block text-sm">
            Application Version
          </label>
          <Input
            type="text"
            id="issuedBy"
            placeholder="Select Assignment Date"
            className="mt-1"
            {...formik.getFieldProps("issuedBy")}
            error={
              !!(formik.touched.assignmentDate && formik.errors.assignmentDate)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("issuedBy") || "\u00A0"}
          </p>
        </div>
        <div>
          <label htmlFor="assignmentDate" className="block text-sm">
            Last Application Login Time
          </label>
          <Input
            type="text"
            id="assignmentDate"
            placeholder="Select Assignment Date"
            className="mt-1"
            {...formik.getFieldProps("assignmentDate")}
            error={
              !!(formik.touched.assignmentDate && formik.errors.assignmentDate)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("assignmentDate") || "\u00A0"}
          </p>
        </div>

        <div>
          <label htmlFor="assignmentDate" className="block text-sm">
            Date Application Installed
          </label>
          <Input
            type="date"
            id="assignmentDate"
            placeholder="Select Assignment Date"
            className="mt-1"
            {...formik.getFieldProps("assignmentDate")}
            error={
              !!(formik.touched.assignmentDate && formik.errors.assignmentDate)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("assignmentDate") || "\u00A0"}
          </p>
        </div>
        <div>
          <label htmlFor="assignmentDate" className="block text-sm">
            Last Application Updated
          </label>
          <Input
            type="date"
            id="assignmentDate"
            placeholder="Select Assignment Date"
            className="mt-1"
            {...formik.getFieldProps("assignmentDate")}
            error={
              !!(formik.touched.assignmentDate && formik.errors.assignmentDate)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("assignmentDate") || "\u00A0"}
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
      </div>
    </form>
  );
};

export default UpdateDeviceForm;
