import React, { useEffect, useState } from "react";
import { GameCombination } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { useFormik } from "formik";
import { userSchema } from "~/schemas/userSchema";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import Swal from "sweetalert2";
import { toFormikValidationSchema } from "~/utils/formikHelpers";

interface AddGameCombinationFormProps {
  title?: string;
  onSubmit: (data: GameCombination) => void;
  initialData?: Partial<GameCombination>;
  onClose?: () => void;
}

const AddGameCombinationForm: React.FC<AddGameCombinationFormProps> = ({
  initialData = {},
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: string | number | string[] }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
        gameType: initialData.gameType || "",
        provinceId: initialData.provinceId || "",
        combinationOne: initialData.combinationOne || "",
        combinationTwo: initialData.combinationTwo || "",
        combinationThree: initialData.combinationThree || "",
        combinationFour: initialData.combinationFour || "",
        gameSchedule: initialData.gameSchedule || ""
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

      if (!result.isConfirmed) return;

      // Remove null, undefined, or empty string values
      const cleanedData: { [k: string]: string | number | string[] } = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            (typeof value === "string" ? value.trim() !== "" : true)
        )
      );

      setFormData(cleanedData);
      openConfirmModal();
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



        

      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2 mt-1"
          disabled={formik.isSubmitting}
        >
          Add Draw Combination
        </button>

        <ConfirmUserActionModalPage
          open={isConfirmModalOpen}
          onClose={handleModalClose}
          onConfirm={async () => {
            try {
              await onSubmit(formData as unknown as GameCombination); // submit from the parent component handled after password verification
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

export default AddGameCombinationForm;
