import React, { useEffect, useState } from "react";
import { ReusableModalPageProps } from "~/types/interfaces";
import Select from "react-select";
import useUpdateModalState from "../../store/useUpdateModalStore";
import Input from "../ui/inputs/TextInputs";
import dayjs from "dayjs";

type GameTypeOption = {
  value: number;
  label: string;
};

type ProvinceTypeOptions = {
  value: number;
  label: string;
};

const OperatorViewPage: React.FC<ReusableModalPageProps> = ({
  initialUserData,
  gameTypes,
  regions,
  provinces,
  cities,
  areaofoperations,
  onViewEditLogs,
  selectedUser,
}) => {
  const { user, setUser, errors, setErrors, handleManagerChange } =
    useUpdateModalState();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState([]);
  const [area, setArea] = useState<string | null>(null);

  // console.log("hihihh", areaofoperations);
  console.log("SELECTED USERRR:", selectedUser);
  console.log("initialUserData:", initialUserData);
  console.log("provinces:", provinces);
  const handleDisable = () => {
    setIsDisabled(false);
    setShowEditButton(false);
  };

  const gameTypeOptions: GameTypeOption[] =
    gameTypes?.map((type) => ({
      value: type.GameCategoryId!,
      label: `${type.GameCategory}`,
    })) || [];

  const provincesOptions: ProvinceTypeOptions[] =
    provinces?.map((province) => ({
      value: province.ProvinceId,
      label: province.ProvinceName,
    })) || [];

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  const areaOfOperationsOptions = areaofoperations?.map((item: any) => ({
    label: item.AreaOfOperations,
    value: item.AreaOfOperationsOptionsId,
  }));

  useEffect(() => {
    console.log("initialUserDatass:", initialUserData);

    if (initialUserData && Object.keys(initialUserData).length > 0) {
      const operatorData = initialUserData.data;

      if (operatorData && operatorData.GameTypes && operatorData.Cities) {
        const mappedGameTypes = operatorData.GameTypes.map(
          (gt: { GameCategory: any; GameCategoryId: any }) => ({
            label: gt.GameCategory,
            value: gt.GameCategoryId,
          })
        );

        // fetching of cities to get the province
        const mappedCities = operatorData.Cities.map(
          (pv: { CityId: any; CityName: any }) => ({
            label: pv.CityId,
            value: pv.CityName,
          })
        );

        console.log("Mapped GameTypes for Select:", mappedGameTypes);
        console.log("cities", mappedCities);
        console.log(mappedGameTypes);
        setSelectedGameTypes(mappedGameTypes);
      } else {
        setSelectedGameTypes([]);
        console.log("No GameTypes found. Resetting selected game types.");
      }

      setFormData(operatorData);
      console.log("Form data set:", operatorData);
    } else {
      setFormData({});
      setSelectedGameTypes([]);
      console.log("No initialUserData found. Resetting form and game types.");
    }
  }, [initialUserData]);

  const operator = formData?.data || {};

  // FOR SELECT FIELDS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (fieldName: string, selectedOptions: any[]) => {
    const selectedValues = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : [];

    console.log(`Field Name: ${fieldName}`);
    console.log(`Selected Options:`, selectedOptions);
    console.log(`Selected Values:`, selectedValues);

    setFormData({
      ...formData, // Merge the existing user object
      [fieldName]: selectedValues,
    });
  };

  return (
    <div>
      {/* History */}
      <div className="">
        <div className="text-base font-bold mb-2">History</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="createdBy"
              className="block text-sm font-medium text-gray-700 mb-1" // #212121 to hindi gray 700
              // TINGNAN MO KASI YUNG UI!
            >
              Created By
            </label>
            <Input
              id="createdBy"
              name="createdBy"
              value={formData.CreatedBy || ""}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="lastUpdatedBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Updated By
            </label>
            <Input
              id="lastUpdatedBy"
              name="lastUpdatedBy"
              value={formData.CreatedBy || ""}
              onChange={handleChange}
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="creationDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Creation Date
            </label>
            <Input
              id="creationDate"
              name="creationDate"
              value={
                formData.CreatedAt
                  ? dayjs(formData.CreatedAt).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="lastUpdatedDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Updated Date
            </label>
            <Input
              id="lastUpdatedDate"
              name="lastUpdatedDate"
              value={formData.lastUpdatedDate || ""}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>
        <div className="w-full flex justify-end items-center mt-3">
          {typeof selectedUser?.OperatorId === "number" && (
            <button
              type="button"
              onClick={() => {
              
                const operatorId = selectedUser.OperatorId;

                if (
                  typeof operatorId === "number" &&
                  typeof onViewEditLogs === "function"
                ) {
                  onViewEditLogs(operatorId);
                } else {
                  console.warn(
                    "Invalid OperatorId or onViewEditLogs is not defined."
                  );
                }
              }}
              className="bg-[#0038A8] py-2.5 px-4 text-white rounded-lg text-xs cursor-pointer hover:none"
            >
              View Update History
            </button>
          )}
        </div>
      </div>

      {/* AAC Information */}
      <div className="mt-5">
        <div className="text-base font-bold mb-2">AAC Information</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="operatorName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Name
            </label>
            <Input
              id="operatorName"
              name="OperatorName"
              disabled={isDisabled}
              value={formData.OperatorName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="ContactNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Phone Number
            </label>
            <Input
              id="ContactNo"
              name="ContactNo"
              type="text"
              disabled={isDisabled}
              value={formData.ContactNo || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="OperatorAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Address
            </label>
            <Input
              id="OperatorAddress"
              name="OperatorAddress"
              value={formData.OperatorAddress || ""}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Email Address
            </label>
            <Input
              id="Email"
              name="Email"
              disabled={isDisabled}
              value={formData.Email || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="DateOfOperation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Operations
            </label>
            <Input
              id="DateOfOperation"
              name="DateOfOperation"
              type="date"
              disabled={isDisabled}
              value={
                formData.DateOfOperation
                  ? dayjs(formData.DateOfOperation).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
            />
          </div>

          {/* Games Provided */}
          <div>
            <label
              htmlFor="gameTypes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Games Provided
            </label>
            <Select<GameTypeOption, true> // true = isMulti
              id="gameTypes"
              name="gameTypes"
              isMulti
              options={gameTypeOptions}
              value={selectedGameTypes}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Games Provided"
              onChange={(selectedOptions) =>
                handleMultiSelect(
                  "gameTypes",
                  Array.isArray(selectedOptions) ? selectedOptions : []
                )
              }
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Area of Operator */}
          <div className="w-full">
            <label
              htmlFor="Status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <Select
              id="Status"
              name="Status"
              options={statusOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Status"
              value={
                statusOptions.find((opt) => opt.value === formData.Status) ||
                null
              }
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  Status: selectedOption ? selectedOption.value : null,
                }));
              }}
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 1000000,
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 400,
                  overflowY: "auto",
                }),
              }}
              classNames={{
                control: () => "rounded text-sm",
              }}
            />
          </div>

          {/* Provincial Operations */}
          <div>
            <label
              htmlFor="provinces"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area of Provincial Operations
            </label>
            <Select
              id="provinces"
              name="provinces"
              isMulti
              options={provincesOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Provinces"
              onChange={(selectedOptions) =>
                handleMultiSelect(
                  "provinces",
                  Array.isArray(selectedOptions) ? selectedOptions : []
                )
              }
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Status */}
          <div className="w-full">
            <label
              htmlFor="Status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area Of Operations
            </label>
            <Select
              id="AreaOfOperations"
              name="AreaOfOperations"
              options={areaOfOperationsOptions}
              value={
                areaOfOperationsOptions?.find(
                  (opt) => opt.value === formData.AreaOfOperations
                ) || null
              }
              isDisabled={isDisabled}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  AreaOfOperations: selected?.value || null,
                }));
              }}
              placeholder="Select Area of Operations"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      {/* Remarks Field */}
      {!isDisabled && (
        <div className="w-full !mt-4">
          <label
            htmlFor="remarks"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter Remarks"
            value={typeof user.remarks === "string" ? user.remarks : ""}
            onChange={handleManagerChange}
            className={`w-full border !border-[#0038A8] rounded px-3 py-2 text-sm bg-transparent ${
              errors.remarks
                ? "border-red-600 focus:ring-red-600"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            rows={3}
          />
          {errors.remarks && (
            <p className="text-red-600 text-xs mt-1">{errors.remarks}</p>
          )}
        </div>
      )}

      {/* Show only when `showEditButton` is true */}
      {showEditButton && (
        <form onSubmit={handleDisable}>
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
    </div>
  );
};

export default OperatorViewPage;
