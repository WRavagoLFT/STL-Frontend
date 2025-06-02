import React, { useState } from "react";
import { Operator } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import Select from "react-select";
import { FormikProps, useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import { operatorSchema } from "~/schemas/operatorSchema";
import Swal from "sweetalert2";
import { generateValidPassword } from "~/utils/passwordgenerate";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AddOperatorFormProps {
  title?: string;
  onSubmit: (data: Operator) => void;
  initialData?: Partial<Operator>;
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
  onClose?: () => void;
}

export interface AreaOfOperation {
  AreaOfOperationsOptionsId: number;
  AreaOfOperations: string;
}

const AddOperatorForm: React.FC<AddOperatorFormProps> = ({
  initialData = {},
  onSubmit,
  gameTypes,
  regions,
  provinces,
  cities,
  areaOfOperations,
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [hasExcludedCity, setHasExcludedCity] = useState(false);
  const selectedAreaId = Number(formData.areaOfOperations); // ensure it's a number
  const showRegionsAndProvinces = selectedAreaId === 1 || selectedAreaId === 2;
  const showCities = selectedAreaId !== 1;
  const showExcluded = selectedAreaId !== 2;
  const [showPassword, setShowPassword] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleModalClose = () => {
    // Close the confirm modal and the parent AddUserModal
    closeConfirmModal();
    if (onClose) onClose();
  };

  //console.log("GAMETYPES:", gameTypes);
  //console.log("REGIONS", regions);
  //console.log("PROVINCES", provinces);
  //console.log("CITIES", cities);
  //console.log("AREA OF OPERATORS", areaOfOperations);

  const [filteredProvinces, setFilteredProvinces] = useState<OptionType[]>([]);
  const [filteredCities, setFilteredCities] = useState<OptionType[]>([]);

  const gameTypesOptions = gameTypes.map((cat) => ({
    value: cat.GameCategoryId.toString(),
    label: cat.GameCategory,
  }));

  const regionsOptions = regions.map((reg) => ({
    value: reg.RegionId.toString(),
    label: reg.RegionName,
  }));

  const areaOfOperationsOptions = areaOfOperations.map(
    (aop: AreaOfOperation) => ({
      value: aop.AreaOfOperationsOptionsId.toString(),
      label: aop.AreaOfOperations,
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
    { label: "Esq.", value: "Esq." },
  ];

  const provinceOptions = filteredProvinces;
  const cityOptions = filteredCities;
  const selectedCities = Array.isArray(formData.cities) ? formData.cities : [];
  const availableExcludedCities = cityOptions.filter(
    (opt) => !selectedCities.includes(opt.value)
  );

  const handleSelectChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (
    name: string,
    selectedOptions: OptionType[],
    formik: FormikProps<any>
  ) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const selectedValuesNum = selectedValues.map((v) => Number(v)); // Convert to numbers

    if (name === "regions") {
      const filteredProvinces = provinces
        .filter((province) => selectedValuesNum.includes(province.RegionId))
        .map((province) => ({
          value: province.ProvinceId,
          label: province.ProvinceName,
        }));

      setFilteredProvinces(filteredProvinces);
      setFilteredCities([]);

      formik.setFieldValue("regions", selectedValues);
      formik.setFieldTouched("regions", true, true);
      formik.setFieldValue("provinces", []);
      formik.setFieldValue("cities", []);
    } else if (name === "provinces") {
      const filteredCities = cities
        .filter((city) => selectedValuesNum.includes(city.ProvinceId))
        .map((city) => ({
          value: city.CityId,
          label: city.CityName.trim(),
        }));

      setFilteredCities(filteredCities);

      formik.setFieldValue("provinces", selectedValues);
      formik.setFieldTouched("provinces", true, true);
      formik.setFieldValue("cities", []);
    } else {
      formik.setFieldValue(name, selectedValues);
      formik.setFieldTouched(name, true, true);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: initialData.name || "",
      contactNumber: initialData.contactNumber || "",
      dateOfOperation: initialData.dateOfOperation || "",
      email: initialData.email || "",
      address: initialData.address || "",
      areaOfOperations: initialData.areaOfOperations || "",
      gameTypes: initialData.gameTypes || [],
      cities: initialData.cities || [],
      regions: initialData.regions || [],
      provinces: initialData.provinces || [],

      execFirstName: initialData.execFirstName || "",
      execLastName: initialData.execLastName || "",
      execSuffix: initialData.execSuffix || "",
      execNumber: initialData.execNumber || "",
      execEmail: initialData.execEmail || "",
      execPassword: initialData.execPassword || "",
    },
    validationSchema: toFormikValidationSchema(operatorSchema),
    onSubmit: async (values) => {
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
      <div className="text-md font-bold my-1">Owner Information</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {/* Name */}
        <div>
          <label className="block text-sm">Given Name</label>
          <Input
            type="text"
            name="execFirstName"
            value={formik.values.execFirstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Given Name"
            error={
              !!(formik.touched.execFirstName && formik.errors.execFirstName)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("execFirstName") || "\u00A0"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="execLastName" className="block text-sm">
              Last Name
            </label>
            <Input
              type="text"
              id="execLastName"
              placeholder="Enter Last Name"
              className="mt-1"
              {...formik.getFieldProps("execLastName")}
              error={
                !!(formik.touched.execLastName && formik.errors.execLastName)
              }
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("execLastName") || "\u00A0"}
            </p>
          </div>

          <div>
            <label htmlFor="execSuffix" className="block text-sm mb-1">
              Suffix
            </label>
            <CustomSelect
              name="execSuffix"
              options={suffixOptions}
              value={
                suffixOptions.find(
                  (option) => option.value === formik.values.execSuffix
                ) || null
              }
              onChange={(e) => {
                formik.setFieldValue("execSuffix", e.target.value);
              }}
              placeholder="Enter Suffix"
              error={!!getError("execSuffix")}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("execSuffix") || "\u00A0"}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm">Phone Number</label>
          <Input
            type="tel"
            name="execNumber"
            value={formik.values.execNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Phone Number"
            error={!!(formik.touched.execNumber && formik.errors.execNumber)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("execNumber") || "\u00A0"}
          </p>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm">Email Address</label>
          <Input
            type="text"
            name="execEmail"
            value={formik.values.execEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email Address"
            error={!!(formik.touched.execEmail && formik.errors.execEmail)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("execEmail") || "\u00A0"}
          </p>
        </div>

        <div>
          <div className="flex space-x-2">
            {/* Password Input with Eye Toggle */}

            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                id="execPassword"
                placeholder="Generate Password"
                className="pr-10" // padding for eye icon
                {...formik.getFieldProps("execPassword")}
                error={
                  !!(formik.touched.execPassword && formik.errors.execPassword)
                }
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
                formik.setFieldValue("execPassword", generatedPassword);
              }}
              className="bg-[#F6BA12] hover:bg-[#D1940F] text-[#181A1B] text-sm px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 basis-40"
            >
              Generate
            </button>
          </div>
          {/* Error Message */}
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {formik.touched.execPassword && formik.errors.execPassword
              ? formik.errors.execPassword
              : "\u00A0"}
          </p>
        </div>
      </div>

      <div className="text-md font-bold mt-[2rem] my-2">
        Corporation Information
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {/* Name */}
        <div>
          <label className="block text-sm">Operator Name</label>
          <Input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Operator Name"
            error={!!(formik.touched.name && formik.errors.name)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("name") || "\u00A0"}
          </p>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm">Phone Number</label>
          <Input
            type="text"
            name="contactNumber"
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Phone Number"
            error={
              !!(formik.touched.contactNumber && formik.errors.contactNumber)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("contactNumber") || "\u00A0"}
          </p>
        </div>

        {/* Date of Operation */}
        <div>
          <label className="block text-sm">Date of Operation</label>
          <Input
            type="date"
            name="dateOfOperation"
            value={formik.values.dateOfOperation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              !!(
                formik.touched.dateOfOperation && formik.errors.dateOfOperation
              )
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("dateOfOperation") || "\u00A0"}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm">Email</label>
          <Input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter email"
            error={!!(formik.touched.email && formik.errors.email)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("email") || "\u00A0"}
          </p>
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="block text-sm">Address</label>
          <Input
            type="text"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Address"
            error={!!(formik.touched.address && formik.errors.address)}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("address") || "\u00A0"}
          </p>
        </div>

        <div>
          <label htmlFor="gameTypes" className="block text-sm mb-1">
            STL Games Provided
          </label>
          <Select
            id="gameTypes"
            name="gameTypes"
            options={gameTypesOptions}
            isMulti
            onChange={(selectedOptions) => {
              const values = selectedOptions
                ? selectedOptions.map((opt) => opt.value)
                : [];
              formik.setFieldValue("gameTypes", values);
            }}
            onBlur={() => formik.setFieldTouched("gameTypes", true)}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="STL Games Provided"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{
              menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
            }}
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("gameTypes") || "\u00A0"}
          </p>
        </div>

        {/* Area of Operations */}
        <div>
          <label htmlFor="areaOfOperations" className="block text-sm mb-1">
            Area of Operations
          </label>
          <CustomSelect
            name="areaOfOperations"
            options={areaOfOperationsOptions}
            onChange={(selected) => {
              formik.setFieldValue(
                "areaOfOperations",
                selected ? selected.value : ""
              );
              handleSelectChange(selected);
              setHasExcludedCity(false);
            }}
            placeholder="STL Area of Operations"
            error={
              formik.touched.areaOfOperations &&
              Boolean(formik.errors.areaOfOperations)
            }
          />
          <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
            {getError("areaOfOperations") || "\u00A0"}
          </p>
        </div>

        {/* Area of Regional Operations */}
        {showRegionsAndProvinces && (
          <div>
            <label htmlFor="regions" className="block text-sm mb-1">
              Area of Regional Operations
            </label>
            <Select
              id="regions"
              name="regions"
              options={regionsOptions}
              isMulti
              onChange={(selected) =>
                handleMultiSelect("regions", selected as OptionType[], formik)
              }
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Area of Regional Operations"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("regions") || "\u00A0"}
            </p>
          </div>
        )}

        {/* Area of Provincial Operations */}
        {showRegionsAndProvinces && (
          <div>
            <label htmlFor="provinces" className="block text-sm mb-1">
              Area of Provincial Operations
            </label>
            <Select
              id="provinces"
              name="provinces"
              options={provinceOptions}
              isMulti
              onChange={(selected) =>
                handleMultiSelect("provinces", selected as OptionType[], formik)
              }
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Area of Provincial Operations"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
              {getError("provinces") || "\u00A0"}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Area of City Operations and Excluded Cities */}
        <div className="space-y-4">
          {formData.areaOfOperations && showCities && (
            <div>
              <label htmlFor="cities" className="block text-sm mb-1">
                Area of City Operations
              </label>
              <Select
                id="cities"
                name="cities"
                options={cityOptions}
                isMulti
                onChange={(selected) =>
                  handleMultiSelect("cities", selected as OptionType[], formik)
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Area of City Operations"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
                {getError("cities") || "\u00A0"}
              </p>
            </div>
          )}

          {formData.areaOfOperations && showExcluded && hasExcludedCity && (
            <div>
              <label htmlFor="excludedCities" className="block text-sm mb-1">
                Excluded Cities
              </label>
              <Select
                id="excludedCities"
                name="excludedCities"
                options={availableExcludedCities}
                isMulti
                onChange={(selected) =>
                  handleMultiSelect(
                    "excludedCities",
                    selected as OptionType[],
                    formik
                  )
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Excluded cities"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              <p className="text-[#CE1126] text-xs mt-0.5 min-h-[1rem]">
                {getError("excludedCities") || "\u00A0"}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Checkbox */}
        {formData.areaOfOperations && showExcluded && (
          <div className="flex items-center ml-2 my-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-[#0038A8] transition duration-150 ease-in-out"
                checked={hasExcludedCity}
                onChange={(e) => setHasExcludedCity(e.target.checked)}
              />
              <span className="text-gray-700">Is there excluded City?</span>
            </label>
          </div>
        )}
      </div>
      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2 mt-4"
        >
          Add Operator
        </button>

        <ConfirmUserActionModalPage
          open={isConfirmModalOpen}
          onClose={handleModalClose}
          onConfirm={async () => {
            try {
              await onSubmit(formData as unknown as Operator); // submit from the parent component handled after password verification
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

export default AddOperatorForm;
