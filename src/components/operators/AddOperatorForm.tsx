import React, { useState } from "react";
import { Operator } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import Select from "react-select";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { userSchema } from "~/schemas/userSchema";
import ConfirmUserActionModalPage from "../shared/ConfirmUserActionModal";
import { operatorSchema } from "~/schemas/operatorSchema";

interface AddOperatorFormProps {
  title?: string;
  onSubmit: (data: Operator) => void;
  initialData?: Partial<Operator>;
  gameTypes: any[]; // <-- add this
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
}

export interface AreaOfOperation {
  AreaOfOperationsOptionsId: number;
  AreaOfOperations: string;
  // any other properties if needed
}

const AddOperatorForm: React.FC<AddOperatorFormProps> = ({
  initialData = {},
  onSubmit,
  gameTypes,
  regions,
  provinces,
  cities,
  areaOfOperations,
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    contactNumber: initialData.contactNumber || "",
    dateOfOperation: initialData.dateOfOperation || "",
    email: initialData.email || "",
    address: initialData.address || "",
    cities: initialData.cities || "",
    gameTypes: initialData.gameTypes || "",
    areaOfOperations: initialData.areaOfOperations || "",
  });

  const [hasExcludedCity, setHasExcludedCity] = useState(false);
  const selectedAreaId = Number(formData.areaOfOperations); // ensure it's a number
  const showRegionsAndProvinces = selectedAreaId === 1 || selectedAreaId === 2;
  const showCities = selectedAreaId !== 1;
  const showExcluded = selectedAreaId !== 2;

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

  const provinceOptions = filteredProvinces;

  const cityOptions = filteredCities;

  const availableExcludedCities = cityOptions.filter(
    (opt) => !formData.cities.includes(opt.value)
  );

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
    },
    validationSchema: toFormikValidationSchema(operatorSchema),
    onSubmit: (values) => {
      onSubmit(values as Operator);
    },
  });

  // Helpers to display errors
  const getError = (field: string) =>
    formik.touched[field as keyof typeof formik.touched] &&
    formik.errors[field as keyof typeof formik.errors]
      ? (formik.errors[field as keyof typeof formik.errors] as string)
      : null;

  return (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
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
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-xs">{formik.errors.name}</p>
        )}
      </div>

      {/* Contact Number */}
      <div>
        <label className="block text-sm">Contact Number</label>
        <Input
          type="text"
          name="contactNumber"
          value={formik.values.contactNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="09XXXXXXXXX"
          error={
            !!(formik.touched.contactNumber && formik.errors.contactNumber)
          }
        />
        {formik.touched.contactNumber && formik.errors.contactNumber && (
          <p className="text-red-500 text-xs">{formik.errors.contactNumber}</p>
        )}
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
            !!(formik.touched.dateOfOperation && formik.errors.dateOfOperation)
          }
        />
        {formik.touched.dateOfOperation && formik.errors.dateOfOperation && (
          <p className="text-red-500 text-xs">
            {formik.errors.dateOfOperation}
          </p>
        )}
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
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs">{formik.errors.email}</p>
        )}
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
          placeholder="Address"
          error={!!(formik.touched.address && formik.errors.address)}
        />
        {formik.touched.address && formik.errors.address && (
          <p className="text-red-500 text-xs">{formik.errors.address}</p>
        )}
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
          placeholder="Select GameTypes"
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{
            menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          }}
        />
        {formik.touched.gameTypes && formik.errors.gameTypes && (
          <p className="text-red-500 text-xs">{formik.errors.gameTypes}</p>
        )}
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
          placeholder="Select Area of Operations"
          error={
            formik.touched.areaOfOperations &&
            Boolean(formik.errors.areaOfOperations)
          }
        />
        {formik.touched.areaOfOperations && formik.errors.areaOfOperations && (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.areaOfOperations as string}
          </p>
        )}
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
            placeholder="Regions"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          {formik.touched.regions && formik.errors.regions && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.regions as string}
            </p>
          )}
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
            placeholder="Provinces"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          {formik.touched.provinces && formik.errors.provinces && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.provinces as string}
            </p>
          )}
        </div>
      )}

      {formData.areaOfOperations && (
        <>
          {/* Area of City Operations */}
          {showCities && (
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
                placeholder="Cities"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              {formik.touched.cities && formik.errors.cities && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.cities as string}
                </p>
              )}
            </div>
          )}

          {/* Hide Checkbox + Excluded City if Area is City Wide (value 2) */}
          {showExcluded && (
            <div>
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
        </>
      )}

      {formData.areaOfOperations && showExcluded && hasExcludedCity && (
        <div>
          <label htmlFor="cities" className="block text-sm mb-1">
            Excluded Cities
          </label>
          <Select
            id="cities"
            name="cities"
            options={availableExcludedCities}
            isMulti
            onChange={(selected) =>
              handleMultiSelect("cities", selected as OptionType[], formik)
            }
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select excluded cities"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          {formik.touched.cities && formik.errors.cities && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.cities as string}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddOperatorForm;
