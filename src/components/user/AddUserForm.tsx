import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";

interface AddUserFormProps {
  title?: string;
  operatorMap: Record<number, Operator>;
  onSubmit: (data: User) => void;
  initialData?: Partial<User>;
  userTypeId: number;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  operatorMap,
  initialData = {},
  onSubmit,
  userTypeId,
}) => {
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

  // console.log('hello usertypeid:', userTypeId);

  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    suffix: initialData.suffix || "",
    password: "",
    phoneNumber: initialData.phoneNumber || "",
    email: initialData.email || "",
    userTypeId: userTypeId,
    // OperatorId: initialData.OperatorId || "",
    operatorId:
      operatorOptions.find(
        (opt) => opt.value === String(initialData.operatorId)
      ) || null,
  });

  // console.log("operatormapp", operatorMap);

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

  // Handle change for CustomSelect
  const handleSelectChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    const selectedOption =
      operatorOptions.find((opt) => opt.value === value) || null;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // prepare data for submission
    const submittedData: User = {
      ...formData,
      // convert operatorId if needed
      operatorId:
        typeof formData.operatorId === "object" && formData.operatorId !== null
          ? parseInt(formData.operatorId.value)
          : 0,
    };

    console.log("Submitted User Data:", submittedData);

    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Column 1 */}
      <div className="flex flex-col gap-x-6 gap-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm"
          >
            Given Name
          </label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Given Name"
            className="mt-1"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label
              htmlFor="lastName"
              className="block text-sm"
            >
              Last Name
            </label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              className="mt-1"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-">
            <label
              htmlFor="suffix"
              className="block text-sm mb-1"
            >
              Suffix
            </label>
          <CustomSelect
            name="suffix"
            value={suffixOptions.find(option => option.value === formData.suffix) || null}
            options={suffixOptions}
            onChange={handleSelectChange}
            placeholder="Suffix"
            error={false}
          />
          </div>
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm"
          >
            Phone Number
          </label>
          <Input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Phone Number"
            className="mt-1"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-x-6 gap-y-4">
        <div>
          <label
            htmlFor="operatorId"
            className="block text-sm mb-1"
          >
            Assigned PCSO Branch
          </label>
          <CustomSelect
            name="operatorId"
            value={formData.operatorId}
            options={operatorOptions}
            onChange={handleSelectChange}
            placeholder="Select Assigned PCSO Branch"
            error={false}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm"
          >
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            className="mt-1"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm"
          >
            Password
          </label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="mt-1"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2 mt-2"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
