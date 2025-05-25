import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";

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
  const title = userTypeId === 2 ? "Manager" : userTypeId === 3 ? "Executive" : "User";

  // console.log("selectedUserrrr", selectedUser);
  const operatorOptions: OptionType[] = Object.values(operatorMap).map(operator => ({
    value: operator.OperatorId !== undefined ? operator.OperatorId.toString() : '0',
    label: operator.OperatorName ?? 'Unknown',
  }));
  
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
    { label: "Esq.", value: "Esq." },
  ];

  const mapSelectedUserToFormData = (user: any) => ({
    firstName: user?.FirstName || "",
    lastName: user?.LastName || "",
    suffix: user?.Suffix || "",
    phoneNumber: user?.PhoneNumber || "",
    email: user?.Email || "",
    userTypeId: user?.UserTypeId || userTypeId,
    operatorId:
    operatorOptions.find(
      (opt) => opt.value === String(user?.OperatorId)
    ) || null,
  });

  const [formData, setFormData] = useState(mapSelectedUserToFormData(selectedUser));

  // console.log('hello usertypeid:', userTypeId);

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
    const submittedData: User = {
      ...formData,
      // convert operatorId if needed
    };

    console.log("Submitted User Data:", submittedData);

    onSubmit(submittedData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="font-bold mb-1">{title} Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="flex flex-col gap-x-6 gap-y-4">
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
                  value={suffixOptions.find(option => option.value === formData.suffix) || null}  // eto ay mali
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
                disabled
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-x-6 gap-y-4">
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
                disabled
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm">
                Status
              </label>
              <Input
                type="status"
                name="status"
                id="status"
                className="mt-1"
                value={formData.password}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
        </div>

        <h2 className="font-bold mt-5 mb-1">Update History</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="flex flex-col gap-x-6 gap-y-4">
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
                value={selectedUser?.DateOfRegistration || ""}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-x-6 gap-y-4">
            <div>
              <label htmlFor="LastUpdatedBy" className="block text-sm">
                Last Updated By
              </label>
              <Input
                type="text"
                name="LastUpdatedBy"
                id="LastUpdatedBy"
                className="mt-1"
                value={selectedUser?.LastUpdatedBy || ""}
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
                value={selectedUser?.LastUpdatedDate || ""}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            className="col-span-2 mt-2 w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2"
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateUserForm;
