import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { getUserStatus } from "~/utils/dashboarddata";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import { updateUserSchema } from "~/schemas/userSchema";
import { useAuthStore } from "~/store/useAuthStore";

interface UpdateUserFormProps {
  title?: string;
  operatorMap: Record<number, Operator>;
  onSubmit: (data: User & { remarks?: string }) => void;
  initialData?: Partial<User>;
  userTypeId: number;
  selectedUser?: User | null;
  onViewEditLogs?: (userId: number) => void;
  onClose?: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  operatorMap,
  onSubmit,
  userTypeId,
  selectedUser,
  onViewEditLogs = () => {},
  onClose,
}) => {
  const title = userTypeId === 2 ? "Manager" : userTypeId === 3 ? "Executive" : "User";
  //console.log('SELECTED USER', selectedUser);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const sevenDaysAgo = dayjs().subtract(7, "day");
  const [formData, setFormData] = useState<{[key: string]: string | number | string[];}>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const handleModalClose = () => { closeConfirmModal(); if (onClose) onClose();};
  const handleDisable = () => setIsDisabled(false);

  const alwaysDisabledKeys = ["name", "LastName"];
  if (!selectedUser) return null;

  const operatorOptions: OptionType[] = Object.values(operatorMap).map(
    (operator) => ({
      value:
        operator.OperatorId !== undefined
          ? operator.OperatorId.toString()
          : "0",
      label: operator.OperatorName ?? "Unknown",
    })
  );

  const suffixOptions: OptionType[] = [
    { label: "N/A", value: "" },
    { label: "Jr.", value: "Jr." },
    { label: "Sr.", value: "Sr." },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
    { label: "V", value: "V" },
    { label: "PhD", value: "PhD" },
    { label: "MD", value: "MD" },
    { label: "Mrs", value: "Mrs" },
    { label: "Mr", value: "Mr" },
    { label: "Esq.", value: "Esq." },
  ];

  const mapSelectedUserToFormData = (user: User) => ({
    userId: user?.UserId || 0,
    firstName: user?.FirstName || "",
    lastName: user?.LastName || "",
    suffix: user?.Suffix?.trim() || "",
    phoneNumber: user?.PhoneNumber || "",
    email: user?.Email || "",
    userTypeId: user?.UserTypeId || userTypeId,
    DateOfRegistration: user?.DateOfRegistration || "",
    operatorId:
      operatorOptions.find((opt) => opt.value === String(user?.OperatorId)) ||
      null,
    status: getUserStatus(user, sevenDaysAgo),
    remarks: "", // initialize remarks as empty string
    BranchName: user?.BranchName || "",
    AssignedArea: user?.AssignedArea || "",
  });

  const formik = useFormik({
    initialValues: mapSelectedUserToFormData(selectedUser),
    validationSchema: toFormikValidationSchema(updateUserSchema),
    onSubmit: (values) => {
      const submittedData: any = {
        userId: values.userId,
        firstName: values.firstName,
        lastName: values.lastName,
        suffix: values.suffix,
        phoneNumber: values.phoneNumber,
        email: values.email,
        userTypeId: values.userTypeId,
        DateOfRegistration: values.DateOfRegistration,
        OperatorId: values.operatorId?.value
          ? Number(values.operatorId.value)
          : null,
        remarks: values.remarks,
      };

      setFormData(submittedData);
      openConfirmModal();
    },
  });

  const getError = (field: string) =>
    formik.touched[field as keyof typeof formik.touched] &&
    formik.errors[field as keyof typeof formik.errors]
      ? (formik.errors[field as keyof typeof formik.errors] as string)
      : null;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="text-base font-bold mb-1">{title} Information</div>
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-x-6 gap-y-3">
          <div>
            <label htmlFor="firstName" className="block text-sm">
              Given Name
            </label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              className="mt-1"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              disabled
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="lastName" className="block text-sm">
                Last Name
              </label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                className="mt-1"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                disabled
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="suffix" className="block text-sm mb-1">
                Suffix
              </label>
              <CustomSelect
                name="suffix"
                value={
                  suffixOptions.find(
                    (option) => option.value === formik.values.suffix?.trim()
                  ) || { label: "N/A", value: "N/A" }
                }
                error={false}
                disabled={true}
                onChange={() => {}}
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm">
              Phone Number
            </label>
            <Input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              className="mt-1"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              disabled={
                alwaysDisabledKeys.includes("phoneNumber") || isDisabled
              }
              onBlur={formik.handleBlur}
              error={
                !!(formik.touched.phoneNumber && formik.errors.phoneNumber)
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("phoneNumber") || "\u00A0"}
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-x-6 gap-y-3">
          {formik.values.userTypeId == 4 && (
            <div>
              <label htmlFor="operatorId" className="block text-sm mb-1">
                Assigned Company
              </label>
              <CustomSelect
                name="operatorId"
                value={formik.values.operatorId}
                options={operatorOptions}
                error={false}
                disabled={true}
              />
            </div>
          )}

          {formik.values.userTypeId == 5 && (
            <div>
              <label htmlFor="BranchName" className="block text-sm mb-1">
                Assigned PCSO Branch
              </label>
              <Input
                name="BranchName"
                id="BranchName"
                value={formik.values.BranchName}
                onChange={formik.handleChange}
                disabled
                //error={!!(formik.touched.email && formik.errors.email)}
              />
            </div>
          )}

          {(formik.values.userTypeId === 1 ||
            formik.values.userTypeId === 2) && (
            <div>
              <label htmlFor="AssignedArea" className="block text-sm mb-1">
                Assigned Area / Zone
              </label>
              <Input
                name="AssignedArea"
                id="AssignedArea"
                value={formik.values.AssignedArea || "N/A"}
                onChange={formik.handleChange}
                disabled
                //error={!!(formik.touched.AssignedArea && formik.errors.AssignedArea)}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              className="mt-1"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={alwaysDisabledKeys.includes("email") || isDisabled}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.email && formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[#CE1126] text-xs mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm mb-1">
              Status
            </label>
            <CustomSelect
              name="status"
              value={{
                label: formik.values.status,
                value: formik.values.status,
              }}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Suspended", value: "Suspended" },
                { label: "New", value: "New" },
              ]}
              error={false}
              disabled
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      {formik.values.userTypeId !== 1 && formik.values.userTypeId !== 2 && (
        <>
          <h2 className="font-bold mt-3 mb-1">Update History</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="flex flex-col gap-x-6 gap-y-3">
              <div>
                <label htmlFor="CreatedBy" className="block text-sm">
                  Created By
                </label>
                <Input
                  type="text"
                  name="CreatedBy"
                  id="CreatedBy"
                  className="mt-1"
                  value={selectedUser?.CreatedBy || ""}
                  disabled
                />
              </div>

              <div>
                <label htmlFor="DateOfRegistration" className="block text-sm">
                  Creation Date
                </label>
                <Input
                  type="date"
                  name="DateOfRegistration"
                  id="DateOfRegistration"
                  className="mt-1"
                  value={
                    selectedUser?.DateOfRegistration
                      ? selectedUser.DateOfRegistration.slice(0, 10)
                      : ""
                  }
                  disabled
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-x-6 gap-y-3">
              <div>
                <label htmlFor="LastUpdatedBy" className="block text-sm">
                  Last Updated By
                </label>
                <Input
                  type="text"
                  name="LastUpdatedBy"
                  id="LastUpdatedBy"
                  className="mt-1"
                  value={selectedUser?.LastUpdatedBy || "N/A"}
                  disabled
                />
              </div>

              <div>
                <label htmlFor="LastUpdatedDate" className="block text-sm">
                  Last Updated Date
                </label>
                <Input
                  type="date"
                  name="LastUpdatedDate"
                  id="LastUpdatedDate"
                  className="mt-1"
                  value={
                    selectedUser?.LastUpdatedDate
                      ? selectedUser.LastUpdatedDate.slice(0, 10)
                      : "N/A"
                  }
                  disabled
                />
              </div>
              {/* View Edit Logs button */}
              {selectedUser && (
                <div
                  className="text-sm cursor-pointer hover:none flex justify-end leading-none"
                  onClick={() => onViewEditLogs(selectedUser.UserId as number)}
                >
                  View Update History
                </div>
              )}
            </div>
          </div>
        </>
      )}

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

      {currentUserType !== 3 && (
        <>
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
        </>
      )}

      <ConfirmUserActionModalPage
        open={isConfirmModalOpen}
        onClose={handleModalClose}
        onConfirm={async () => {
          try {
            await onSubmit(formData as unknown as User); // submit from the parent component handled after password verification
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

export default UpdateUserForm;
