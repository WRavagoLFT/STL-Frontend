import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import Select from "react-select";

interface AddOperatorFormProps {
  title?: string;
  onSubmit: (data: Operator) => void;
  initialData?: Partial<Operator>;
  gameTypes: any[];
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

interface City {
  CityId: number;
  CityName: string;
  ProvinceId: number;
  IsCity: boolean;
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
  const [excludedCities, setExcludedCities] = useState<number[]>([]);

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

  const handleMultiSelect = (name: string, selectedOptions: OptionType[]) => {
    const selectedValuesStr = selectedOptions.map((option) => option.value); // keep as string
    const selectedValuesNum = selectedValuesStr.map((v) => Number(v)); // numbers for filtering

    if (name === "regions") {
      const filteredProvinces = provinces
        .filter((province) => selectedValuesNum.includes(province.RegionId))
        .map((province) => ({
          value: province.ProvinceId.toString(),
          label: province.ProvinceName,
        }));

      console.log("Selected regions:", selectedValuesStr);
      console.log("Filtered provinces:", filteredProvinces);

      setFilteredProvinces(filteredProvinces);
      setFilteredCities([]);

      setFormData((prev) => ({
        ...prev,
        regions: selectedValuesStr, // store as strings for select compatibility
        provinces: [],
        cities: [],
      }));
    } else if (name === "provinces") {
      const filteredCities = cities
        .filter((city) => selectedValuesNum.includes(city.ProvinceId)) // no IsCity check
        .map((city) => ({
          value: city.CityId.toString(),
          label: city.CityName.trim(),
        }));
      console.log("Filtered cities without IsCity filter:", filteredCities);

      console.log("Selected provinces:", selectedValuesStr);
      console.log("Filtered cities:", filteredCities);

      setFilteredCities(filteredCities);

      setFormData((prev) => ({
        ...prev,
        provinces: selectedValuesStr, // store strings
        cities: [],
      }));
    } else if (name === "excludedCities") {
      const newIncludedCities = formData.cities.filter(
        (cityId: string) => !selectedValuesStr.includes(cityId)
      );

      setFormData((prev) => ({
        ...prev,
        cities: newIncludedCities,
      }));

      setExcludedCities(selectedValuesNum);
    } else if (name === "cities") {
      setFormData((prev) => ({
        ...prev,
        cities: selectedValuesStr,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValuesStr,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const includedCities = formData.cities.map((cityId: string) => {
      const city = cities.find((c) => c.CityId === Number(cityId));
      return {
        CityId: city?.CityId,
        CityName: city?.CityName.trim() || "",
        IsCity: true,
      };
    });

    const excludedCitiesData = excludedCities.map((cityId: number) => {
      const city = cities.find((c) => c.CityId === cityId);
      return {
        CityId: city?.CityId,
        CityName: city?.CityName.trim() || "",
        IsCity: false,
      };
    });

    const combinedCities = [
      ...includedCities.filter(
        (city: City) => !excludedCities.includes(city.CityId)
      ),
      ...excludedCitiesData,
    ];

    const submittedData: Operator = {
      ...formData,
      Cities: combinedCities,
    };

    console.log("Submitted User Data:", submittedData);

    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Row 1 */}
      <div>
        <label htmlFor="name" className="block text-sm">
          Given Name
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Operator Name"
          className="mt-1"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="contactNumber" className="block text-sm">
          Phone Number
        </label>
        <Input
          type="tel"
          name="contactNumber"
          id="contactNumber"
          placeholder="Phone Number"
          className="mt-1"
          value={formData.contactNumber}
          onChange={handleChange}
        />
      </div>

      <div className="col-span-2">
        <label htmlFor="email" className="block text-sm">
          Address
        </label>
        <Input
          type="address"
          name="address"
          id="address"
          placeholder="Address"
          className="mt-1"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* Row 3 */}
      <div>
        <label htmlFor="email" className="block text-sm">
          Email
        </label>
        <Input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="mt-1"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="dateOfOperation" className="block text-sm">
          Date of Operations
        </label>
        <Input
          type="date"
          name="dateOfOperation"
          id="dateOfOperation"
          placeholder="Date of Operations"
          className="mt-1"
          value={formData.dateOfOperation}
          onChange={handleChange}
        />
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
          onChange={(selectedOptions) =>
            handleMultiSelect("gameTypes", [...selectedOptions])
          }
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
      </div>

      {/* Area of Operations */}
      <div>
        <label htmlFor="areaOfOperations" className="block text-sm mb-1">
          Area of Operations
        </label>
        <CustomSelect
          name="areaOfOperations"
          value={
            areaOfOperationsOptions.find(
              (opt: OptionType) => opt.value === formData.areaOfOperations
            ) || null
          }
          options={areaOfOperationsOptions}
          onChange={(selected) => {
            handleSelectChange(selected);
            setHasExcludedCity(false); // reset if city-wide is toggled
          }}
          placeholder="Select Area of Operations"
          error={false}
        />
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
              handleMultiSelect("regions", selected as OptionType[])
            }
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Regions"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
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
              handleMultiSelect("provinces", selected as OptionType[])
            }
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Provinces"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
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
                  handleMultiSelect("cities", selected as OptionType[])
                }
                value={cityOptions.filter((opt) =>
                  formData.cities.includes(opt.value)
                )}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Cities"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
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
          <label htmlFor="excludedCities" className="block text-sm mb-1">
            Excluded Cities
          </label>
          <Select
            id="excludedCities"
            name="excludedCities"
            options={availableExcludedCities}
            isMulti
            onChange={(selected) =>
              setExcludedCities(
                (selected as OptionType[]).map((opt) => Number(opt.value))
              )
            }
            value={availableExcludedCities.filter((opt) =>
              excludedCities.includes(Number(opt.value))
            )}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select excluded cities"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      )}

      <button
        type="submit"
        className="col-span-2 mt-2 w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2"
      >
        Submit
      </button>
    </form>
  );
};

export default AddOperatorForm;
