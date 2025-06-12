import React, { useEffect, useState, useMemo, useRef } from "react";
import { GameCombination } from "~/types/types";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import { useFormik } from "formik";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import Swal from "sweetalert2";
import Input from "../ui/inputs/TextInputs";
import { addGameCombination } from "~/schemas/gameCombinationSchema";
import { toFormikValidationSchema } from "~/utils/formikHelpers";

interface AddGameCombinationFormProps {
  title?: string;
  onSubmit: (data: GameCombination) => void;
  initialData?: Partial<GameCombination>;
  onClose?: () => void;
  gameCategoryMap: Map<string, string>;
  gameScheduleOptions: { value: number; label: string }[];
  gameTypes: {
    GameTypeId: number;
    GameType: string;
    GameCategoryId: number;
    GameScheduleId: number;
  }[];
}

const AddGameCombinationForm: React.FC<AddGameCombinationFormProps> = ({
  initialData = {},
  onSubmit,
  onClose,
  gameCategoryMap,
  gameScheduleOptions,
  gameTypes,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: string | number | string[] }>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const identifiedGameTypeIdRef = useRef<number | undefined>(undefined);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const handleModalClose = () => {
    closeConfirmModal();
    if (onClose) onClose();
  };

  const gameCategorySelectOptions: OptionType[] = useMemo(() => {
    if (!Array.isArray(gameTypes)) {
      console.warn("gameTypes prop is not an array for gameCategorySelectOptions:", gameTypes);
      return [];
    }

    const uniqueCategoryIds = new Set<number>();
    const options: OptionType[] = [];

    gameTypes.forEach(gameType => {
      if (!uniqueCategoryIds.has(gameType.GameCategoryId)) {
        uniqueCategoryIds.add(gameType.GameCategoryId);
        const categoryName = gameCategoryMap.get(String(gameType.GameCategoryId));
        if (categoryName) {
          options.push({
            value: String(gameType.GameCategoryId),
            label: categoryName,
          });
        }
      }
    });
    return options;
  }, [gameTypes, gameCategoryMap]);
  
  const validate = toFormikValidationSchema(addGameCombination);

  const formik = useFormik({
    initialValues: {
      gameType: initialData.gameType || "",
      provinceId: initialData.provinceId || "",
      combinationOne: initialData.combinationOne || "",
      combinationTwo: initialData.combinationTwo || "",
      combinationThree: initialData.combinationThree || "",
      combinationFour: initialData.combinationFour || "",
      gameSchedule: initialData.gameSchedule ? String(initialData.gameSchedule) : "",
    },
    validate,
    //validationSchema: toFormikValidationSchema(addGameCombination),
    onSubmit: async (values) => {
      //console.log("[Form Submit] Submitted Values (before conversion):", values);

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

      const submittedGameCategoryId: number | undefined = values.gameType
        ? Number(values.gameType)
        : undefined;

      const submittedGameScheduleId: number | undefined = values.gameSchedule
        ? Number(values.gameSchedule)
        : undefined;

      const finalIdentifiedGameTypeId = identifiedGameTypeIdRef.current;
      //console.log("Final Identified GameTypeId for submission:", finalIdentifiedGameTypeId);

      const finalData: GameCombination = {
        gameType: finalIdentifiedGameTypeId,
        provinceId: values.provinceId ? Number(values.provinceId) : undefined,
        combinationOne: values.combinationOne ? Number(values.combinationOne) : undefined,
        combinationTwo: values.combinationTwo ? Number(values.combinationTwo) : undefined,
        combinationThree: values.combinationThree ? Number(values.combinationThree) : undefined,
        combinationFour: values.combinationFour ? Number(values.combinationFour) : undefined,
        gameSchedule: submittedGameScheduleId,
      };

      setFormData(finalData);
      openConfirmModal();
    },
  });

  const drawTimeOptions: OptionType[] = useMemo(() => {
    const selectedGameCategoryId = formik.values.gameType;

    if (!Array.isArray(gameTypes) || !selectedGameCategoryId) {
      return [];
    }

    const relevantScheduleIds = new Set<number>();
    gameTypes.forEach(type => {
      if (String(type.GameCategoryId) === selectedGameCategoryId) {
        relevantScheduleIds.add(type.GameScheduleId);
      }
    });

    const filteredOptions = gameScheduleOptions.filter(schedule =>
      relevantScheduleIds.has(schedule.value)
    );

    return filteredOptions.map(schedule => ({
      value: String(schedule.value),
      label: schedule.label,
    }));
  }, [formik.values.gameType, gameTypes, gameScheduleOptions]);

  useEffect(() => {
    const { gameType, gameSchedule } = formik.values;

    if (gameType && gameSchedule) {
      const submittedGameCategoryId = Number(gameType);
      const submittedGameScheduleId = Number(gameSchedule);

      const foundGameType = gameTypes.find(type =>
        type.GameCategoryId === submittedGameCategoryId &&
        type.GameScheduleId === submittedGameScheduleId
      );

      identifiedGameTypeIdRef.current = foundGameType?.GameTypeId;
      //console.log("Identified GameTypeId (via useEffect):", identifiedGameTypeIdRef.current);
    } else {
      identifiedGameTypeIdRef.current = undefined;
      //console.log("Could not identify GameTypeId: Missing Game Category ID or Game Schedule ID.");
    }

    const isCurrentScheduleValid = drawTimeOptions.some(
      option => option.value === gameSchedule
    );
    if (!isCurrentScheduleValid) {
      formik.setFieldValue("gameSchedule", "");
    }
  }, [formik.values.gameType, formik.values.gameSchedule, gameTypes, drawTimeOptions, formik.setFieldValue]);

  const getError = (field: string) => {
    const error = formik.errors[field as keyof typeof formik.errors];
    const touched = formik.touched[field as keyof typeof formik.touched];

    if (touched && error && typeof error === "string") {
      return error.split("|")[0].trim();
    }

    return null;
  };

  // Determine how many combination inputs to show based on gameType
  const selectedGameType = Number(formik.values.gameType);
  const showCombinationThree = selectedGameType === 3 || selectedGameType === 4;
  const showCombinationFour = selectedGameType === 4;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid grid-cols-1 gap-4"
      noValidate
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="gameType" className="block text-sm mb-1">
            Game Type
          </label>
          <CustomSelect
            name="gameType"
            options={gameCategorySelectOptions}
            //value={formik.values.gameType}
            onChange={(e) => {
              const value = e.target.value;
              //console.log("Selected Game Category ID (as string):", value);
              formik.setFieldValue("gameType", value);
              // Clear combination fields when gameType changes to prevent stale data
              formik.setFieldValue("combinationOne", "");
              formik.setFieldValue("combinationTwo", "");
              formik.setFieldValue("combinationThree", "");
              formik.setFieldValue("combinationFour", "");
            }}
            placeholder="Select Game Type"
            error={!!getError("gameType")}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("gameType") || "\u00A0"}
          </p>
        </div>

        <div>
          <label htmlFor="gameSchedule" className="block text-sm mb-1">
            Draw Time
          </label>
          <CustomSelect
            name="gameSchedule"
            options={drawTimeOptions}
            //value={formik.values.gameSchedule}
            onChange={(e) => {
              const value = e.target.value;
              //console.log("Selected Game Schedule ID (as string):", value);
              formik.setFieldValue("gameSchedule", value);
            }}
            placeholder="Select Draw Time"
            error={!!getError("gameSchedule")}
            disabled={!formik.values.gameType}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("gameSchedule") || "\u00A0"}
          </p>
        </div>
        
        {/* Combination One (always shown for gameType 1, 2, 3, 4) */}
        {(selectedGameType === 1 || selectedGameType === 2 || selectedGameType === 3 || selectedGameType === 4) && (
          <div>
            <label htmlFor="combinationOne" className="block text-sm">
              First Drawn Number
            </label>
            <Input
              type="text"
              id="combinationOne"
              placeholder="Enter First Drawn Number"
              className="mt-1"
              {...formik.getFieldProps("combinationOne")}
              error={!!(formik.touched.combinationOne && formik.errors.combinationOne)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("combinationOne") || "\u00A0"}
            </p>
          </div>
        )}

        {/* Combination Two (always shown for gameType 1, 2, 3, 4) */}
        {(selectedGameType === 1 || selectedGameType === 2 || selectedGameType === 3 || selectedGameType === 4) && (
          <div>
            <label htmlFor="combinationTwo" className="block text-sm">
              Second Drawn Number
            </label>
            <Input
              type="text"
              id="combinationTwo"
              placeholder="Enter Second Drawn Number"
              className="mt-1"
              {...formik.getFieldProps("combinationTwo")}
              error={!!(formik.touched.combinationTwo && formik.errors.combinationTwo)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("combinationTwo") || "\u00A0"}
            </p>
          </div>
        )}

        {/* Combination Three (shown for gameType 3 and 4) */}
        {showCombinationThree && (
          <div>
            <label htmlFor="combinationThree" className="block text-sm">
              Third Drawn Number
            </label>
            <Input
              type="text"
              id="combinationThree"
              placeholder="Enter Third Drawn Number"
              className="mt-1"
              {...formik.getFieldProps("combinationThree")}
              error={!!(formik.touched.combinationThree && formik.errors.combinationThree)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("combinationThree") || "\u00A0"}
            </p>
          </div>
        )}

        {/* Combination Four (shown for gameType 4) */}
        {showCombinationFour && (
          <div>
            <label htmlFor="combinationFour" className="block text-sm">
              Fourth Drawn Number
            </label>
            <Input
              type="text"
              id="combinationFour"
              placeholder="Enter Fourth Drawn Number"
              className="mt-1"
              {...formik.getFieldProps("combinationFour")}
              error={!!(formik.touched.combinationFour && formik.errors.combinationFour)}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("combinationFour") || "\u00A0"}
            </p>
          </div>
        )}
        
      </div>
      {/* Submit Button */}
      <div className="col-span-full">
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
              const dataToSubmit = {
                ...(formData as GameCombination),
                identifiedGameTypeId: identifiedGameTypeIdRef.current,
              };
              await onSubmit(dataToSubmit);
              closeConfirmModal();
              if (onClose) onClose();
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