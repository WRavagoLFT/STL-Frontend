import React, { useEffect, useState } from "react";
import { Branch, Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { useFormik } from "formik";
import { userSchema } from "~/schemas/userSchema";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { generateValidPassword } from "~/utils/passwordgenerate";
import Swal from "sweetalert2";
import { toFormikValidationSchema } from "~/utils/formikHelpers";

interface AddUserFormProps {
  title?: string;
  operatorMap: Record<number, Operator>;
  onSubmit: (data: User) => void;
  initialData?: Partial<User>;
  userTypeId: number;
  onClose?: () => void;
  pcsoBranchMap: { data: Branch[] };
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  operatorMap,
  initialData = {},
  onSubmit,
  userTypeId,
  onClose,
  pcsoBranchMap
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

  const pcsoBranchOptions: OptionType[] = (pcsoBranchMap?.data || []).map((branch) => ({
    value: branch.BranchId?.toString() ?? "0",
    label: branch.BranchName ?? "Unknown",
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

  const [formData, setFormData] = useState<{ [key: string]: string | number | string[] }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const title = userTypeId === 2 ? "Manager" : userTypeId === 3 ? "Executive" : "User";
  const [showPassword, setShowPassword] = useState(false);

  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const handleModalClose = () => {
    closeConfirmModal();
    if (onClose) onClose();
  };
  const validate = toFormikValidationSchema(userSchema);

  const formik = useFormik({
    initialValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      suffix: initialData.suffix || "",
      password: "",
      phoneNumber: initialData.phoneNumber || "",
      email: initialData.email || "",
      userTypeId,
      operatorId:
        initialData.operatorId !== undefined && initialData.operatorId !== null
          ? initialData.operatorId.toString()
          : "",
      accountType: 2,
      BranchId: initialData.BranchId || "",
    },
    validate,    
    onSubmit: async (values) => {
    console.log("[Form Submit] Submitted Values:", values);

      const result = await Swal.fire({
        title: "Add Confirmation",
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
          operatorId: parseInt(values.operatorId),
        };
        setFormData(submittedData);
        openConfirmModal();
      }
      // Do nothing if user cancels
    },
  });

  useEffect(() => {
    console.log("Validation Errors:", formik.errors);
    //console.log("Touched Fields:", formik.touched);
  }, [formik.errors, formik.touched]);
  
  // Helpers to display errors
  const getError = (field: string) => {
    const error = formik.errors[field as keyof typeof formik.errors];
    const touched = formik.touched[field as keyof typeof formik.touched];
    
    if (touched && error && typeof error === "string") {
      return error.split("|")[0].trim();  // show only the first error message
    }
    
    return null;
  };

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
            placeholder="Enter Given Name"
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
              placeholder="Enter Last Name"
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
              placeholder="Enter Suffix"
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
            placeholder="Enter Phone Number"
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
      {/* FOR MANAGERS ONLY */}
      <div className="flex flex-col gap-x-6 gap-y-2">
        {formik.values.userTypeId === 4 && (
          <div>
            <label htmlFor="operatorId" className="block text-sm mb-1">
              Assigned Company
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
              placeholder="Select Assigned Company"
              error={!!getError("operatorId")}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("operatorId") || "\u00A0"}
            </p>
          </div>
        )}

        {/* FOR EXECUTIVE - PROVINCIAL ADMIN ONLY */}
        {formik.values.userTypeId === 5 && (
          <div>
            <label htmlFor="BranchId" className="block text-sm mb-1">
              Assigned PCSO Branch
            </label>
            <CustomSelect
              name="BranchId"
              options={pcsoBranchOptions}
              value={
                pcsoBranchOptions.find(
                  (opt) => opt.value === formik.values.BranchId?.toString()
                ) || null
              }
              onChange={(e) => {
                formik.setFieldValue("BranchId", e.target.value);
              }}
              placeholder="Select Assigned PCSO Branch"
              error={!!getError("BranchId")}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("BranchId") || "\u00A0"}
            </p>
          </div>
        )}

        {/* this still needs adjustments if text input or select input */}
        {/* FOR KABO ONLY */}
        {formik.values.userTypeId === 2 && (
          <div>
            <label htmlFor="areaZone" className="block text-sm">
              Assigned Area / Zone
            </label>
              <Input
                type="areaZone"
                id="areaZone"
                placeholder="Enter Assigned Area / Zone"
                className="mt-1"
                {...formik.getFieldProps("areaZone")}
                error={!!(formik.touched.email && formik.errors.email)}
              />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("areaZone") || "\u00A0"}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm">
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            placeholder="Enter Email Address"
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
                placeholder="Generate Password"
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
      </div>
    </form>
  );
};

export default AddUserForm;
