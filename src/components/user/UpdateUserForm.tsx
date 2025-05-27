import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { getUserStatus } from "~/utils/dashboarddata";
import dayjs from "dayjs";

interface UpdateUserFormProps {
  title?: string;
  operatorMap: Record<number, Operator>;
  onSubmit: (data: User) => void;
  initialData?: Partial<User>;
  userTypeId: number;
  selectedUser?: User | null;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  operatorMap,
  onSubmit,
  userTypeId,
  selectedUser,
}) => {
  const title =
    userTypeId === 2 ? "Manager" : userTypeId === 3 ? "Executive" : "User";

  //console.log("selectedUserrrr", selectedUser);

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

  const sevenDaysAgo = dayjs().subtract(7, "day");

  const mapSelectedUserToFormData = (user: any) => ({
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
  });

  const [formData, setFormData] = useState(
    mapSelectedUserToFormData(selectedUser)
  );

  const [isDisabled, setIsDisabled] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);

  const handleDisable = () => {
    setIsDisabled(false);
    setShowEditButton(false);
  };

  const alwaysDisabledKeys = [
    "name",
    "LastName",
    "OperatorName",
    "CreatedBy",
    "DateOfRegistration",
    "DateOfOperation",
    "LastUpdatedBy",
    "LastUpdatedDate",
  ];

  // Handle changes for normal inputs (text/select)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // prepare data for submission
    const submittedData: any = {
      ...formData,
      // convert operatorId if needed
    };

    console.log("Submitted User Data:", submittedData);

    onSubmit(submittedData);
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <h2 className="font-bold mb-1">{title} Information</h2>
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
                value={formData.firstName}
                onChange={handleChange}
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
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="col-span-">
                <label htmlFor="suffix" className="block text-sm mb-1">
                  Suffix
                </label>
                <CustomSelect
                  name="suffix"
                  value={
                    suffixOptions.find(
                      (option) => option.value === formData.suffix?.trim()
                    ) || { label: "N/A", value: "N/A" }
                  }
                  error={false}
                  disabled={true}
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
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={
                  alwaysDisabledKeys.includes("phoneNumber") || isDisabled
                }
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-x-6 gap-y-3">
            <div>
              <label htmlFor="operatorId" className="block text-sm mb-1">
                Assigned PCSO Branch
              </label>
              <CustomSelect
                name="operatorId"
                value={formData.operatorId}
                options={operatorOptions}
                error={false}
                disabled={true}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
                disabled={alwaysDisabledKeys.includes("email") || isDisabled}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm mb-1">
                Status
              </label>
              <CustomSelect
                name="status"
                value={{ label: formData.status, value: formData.status }}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Suspended", value: "Suspended" },
                  { label: "New", value: "New" },
                ]}
                disabled
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: selected.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <h2 className="font-bold mt-5 mb-1">Update History</h2>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="text-sm cursor-pointer hover:none flex justify-end">
              View Update History
            </div>
          </div>
        </div>

        {!isDisabled && (
          <div className="col-span-2 my-4">
            <label htmlFor="remarks" className="block text-sm">
              Remarks
            </label>
            <Input
              type="text"
              name="remarks"
              id="remarks"
              className="mt-1"
              onChange={handleChange}
            />
          </div>
        )}

        {/* Show only when `showEditButton` is true */}
        {showEditButton && (
          <form onSubmit={handleSubmit}>
            <div className="w-full flex justify-end items-center my-2">
              <button
                type={isDisabled ? "button" : "submit"}
                onClick={isDisabled ? handleDisable : undefined} // Only handleDisable gets onClick
                className="w-full mt-3 px-7 py-2 bg-[#F6BA12] text-black text-sm rounded transition"
              >
                {isDisabled ? "Update" : "Save"}
              </button>
            </div>
          </form>
        )}

        {!isDisabled && (
          <button
            type="submit"
            className="col-span-2 mt-2 w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2"
          >
            Save
          </button>
        )}
      </form>

    </React.Fragment>
  );
};

export default UpdateUserForm;
