import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { userSchema } from "~/schemas/userSchema";
import ConfirmUserActionModalPage from "../shared/ConfirmUserActionModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { generateValidPassword } from "~/utils/passwordgenerate";

interface AddUserFormProps {
  title?: string;
  operatorMap: Record<number, Operator>;
  onSubmit: (data: User) => void;
  initialData?: Partial<User>;
  userTypeId: number;
  onClose?: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  operatorMap,
  initialData = {},
  onSubmit,
  userTypeId,
  onClose,
}) => {
  const operatorOptions: OptionType[] = Object.values(operatorMap).map(
    (operator) => ({
      value:
        operator.OperatorId !== undefined
          ? operator.OperatorId.toString()
          : "0",
      label: operator.OperatorName ?? "Unknown",
    })
  );
  const [formData, setFormData] = useState<{ [key: string]: string | number | string[] }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const title = userTypeId === 2 ? "Manager" : userTypeId === 3 ? "Executive" : "User";
  const [showPassword, setShowPassword] = useState(false);

  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleModalClose = () => {
    // Close the confirm modal and the parent AddUserModal
    closeConfirmModal();
    if (onClose) onClose();
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName ||  "",
      suffix: initialData.suffix || "",
      password: "",
      phoneNumber: initialData.phoneNumber || "",
      email: initialData.email || "",
      userTypeId,
      operatorId:
        initialData.operatorId !== undefined && initialData.operatorId !== null
          ? initialData.operatorId.toString()
          : "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    onSubmit: (values) => {
    const submittedData: { [key: string]: string | number | string[] } = {
        ...values,
        operatorId: parseInt(values.operatorId),
      };
      setFormData(submittedData);
      openConfirmModal();
    },
  });

  // Helpers to display errors
  const getError = (field: string) =>
    formik.touched[field as keyof typeof formik.touched] &&
    formik.errors[field as keyof typeof formik.errors]
      ? (formik.errors[field as keyof typeof formik.errors] as string)
      : null;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid grid-cols-2 gap-4"
      noValidate
    >
      {/* Column 1 */}
      <div className="flex flex-col gap-x-6 gap-y-2">
        <div>
          <label htmlFor="firstName" className="block text-sm">
            Given Name
          </label>
          <Input
            type="text"
            id="firstName"
            placeholder="Given Name"
            className="mt-1"
            {...formik.getFieldProps("firstName")}
            error={!!(formik.touched.firstName && formik.errors.firstName)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("firstName") || "\u00A0"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="lastName" className="block text-sm">
              Last Name
            </label>
            <Input
              type="text"
              id="lastName"
              placeholder="Last Name"
              className="mt-1"
              {...formik.getFieldProps("lastName")}
              error={!!(formik.touched.lastName && formik.errors.lastName)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("lastName") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="suffix" className="block text-sm mb-1">
              Suffix
            </label>
            <CustomSelect
              name="suffix"
              options={suffixOptions}
              value={
                suffixOptions.find(
                  (option) => option.value === formik.values.suffix
                ) || null
              }
              onChange={(e) => {
                formik.setFieldValue("suffix", e.target.value);
              }}
              placeholder="Suffix"
              error={!!getError("suffix")}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("suffix") || "\u00A0"}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm">
            Phone Number
          </label>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Phone Number"
            className="mt-1"
            {...formik.getFieldProps("phoneNumber")}
            error={!!(formik.touched.phoneNumber && formik.errors.phoneNumber)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("phoneNumber") || "\u00A0"}
          </p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-x-6 gap-y-2">
        <div>
          <label htmlFor="operatorId" className="block text-sm mb-1">
            Assigned PCSO Branch
          </label>
          <CustomSelect
            name="operatorId"
            options={operatorOptions}
            value={
              operatorOptions.find(
                (opt) => opt.value === formik.values.operatorId
              ) || null
            }
            onChange={(e) => {
              formik.setFieldValue("operatorId", e.target.value);
            }}
            placeholder="Select Assigned PCSO Branch"
            error={!!getError("operatorId")}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("operatorId") || "\u00A0"}
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm">
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            placeholder="Email Address"
            className="mt-1"
            {...formik.getFieldProps("email")}
            error={!!(formik.touched.email && formik.errors.email)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("email") || "\u00A0"}
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
          </label>

          <div className="flex space-x-2">
            {/* Password Input with Eye Toggle */}
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="pr-10" // padding for eye icon
                {...formik.getFieldProps("password")}
                error={!!(formik.touched.password && formik.errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={() => {
                const generatedPassword = generateValidPassword();
                formik.setFieldValue("password", generatedPassword);
              }}
              className="bg-[#F6BA12] hover:bg-[#D1940F] text-[#181A1B] text-sm px-4 py-2 rounded-lg whitespace-nowrap"
            >
              Generate
            </button>
          </div>

          {/* Error Message */}
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : "\u00A0"}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2 mt-1"
          disabled={formik.isSubmitting}
        >
          Add {title}
        </button>

        <ConfirmUserActionModalPage
          formData={formData}
          setFormData={setFormData}
          actionType="create"
          setErrors={setErrors}
          open={isConfirmModalOpen}
          onClose={handleModalClose}
          onConfirm={() => {
            onSubmit(formData as unknown as User);
            closeConfirmModal();
            if (onClose) onClose();
          }}
        />
      </div>
    </form>
  );
};

export default AddUserForm;
