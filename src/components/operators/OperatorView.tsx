import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReusableModalPageProps } from "~/types/interfaces";
import Select from "react-select";
import useUpdateModalState from "../../store/useUpdateModalStore";
import Input from "../ui/inputs/TextInputs";
import dayjs from "dayjs";
import { Operator } from "~/types/types";
import ConfirmUserActionModalPage from "../ui/modals/ConfirmUserActionModal";
import Swal from "sweetalert2";
import { useFormik } from "formik";

type GameTypeOption = {
  value: number;
  label: string;
};

type ProvinceTypeOptions = {
  value: number;
  label: string;
};

type AreaOfOperationsTypeOptions = {
  value: number;
  label: string;
};

type OperatorUpdatePageProps = {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: Operator) => void;
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  areaofoperations?: any[];
  initialUserOperatorData?: any;
  onViewEditLogs?: (operatorId: number) => void;
  selectedUser?: any;
};

const OperatorViewPage: React.FC<OperatorUpdatePageProps> = ({
  initialUserOperatorData,
  gameTypes,
  regions,
  provinces,
  cities,
  areaofoperations,
  onViewEditLogs,
  selectedUser,
  onClose,
  onSubmit,
}) => {
  const { user, setUser, errors, setErrors, handleManagerChange } = useUpdateModalState();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
  const [selectedAreaOfOperations, setselectedAreaOfOperations] = useState<any>(null);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [area, setArea] = useState<string | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // Open the confirm modal after submit
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleModalClose = () => {
    // Close the confirm modal and the parent AddUserModal
    closeConfirmModal();
    if (onClose) onClose();
  };
  
  const handleDisable = () => {
    setIsDisabled(false);
    setShowEditButton(false);
  };

  // console.log("hihihh", areaofoperations);
  //console.log("SELECTED USERRR:", selectedUser);
  //console.log("initialUserData:", initialUserOperatorData);
  //console.log("provinces:", provinces);

  const gameTypeOptions: GameTypeOption[] = useMemo(() => {
    return (
      gameTypes?.map((type) => ({
        value: type.GameCategoryId!,
        label: `${type.GameCategory}`,
      })) || []
    );
  }, [gameTypes]);

  const provincesOptions: ProvinceTypeOptions[] = useMemo(() => {
    return (
      provinces?.map((province) => ({
        value: province.ProvinceId,
        label: province.ProvinceName,
      })) || []
    );
  }, [provinces]);  

  const areaOfOperationsOptions: AreaOfOperationsTypeOptions[] = useMemo(() => {
    return (
      areaofoperations?.map((areaOfOperations) => ({
        label: areaOfOperations.AreaOfOperations,
        value: areaOfOperations.AreaOfOperationsOptionsId,
      })) || []
    );
  }, [areaofoperations]);

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

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

    //console.log(`Field Name: ${fieldName}`);
    //console.log(`Selected Options:`, selectedOptions);
    //console.log(`Selected Values:`, selectedValues);

    setFormData({
      ...formData, // Merge the existing user object
      [fieldName]: selectedValues,
    });
  };

  // 1. Define this first so it can be used below
  const mapSelectedOperatorToFormData = (initialUserOperatorData: any) => {
    if (!initialUserOperatorData || !initialUserOperatorData.data) return {};

    const data = initialUserOperatorData.data;
    //console.log(initialUserOperatorData.data);

    return {
      operatorId: data.OperatorId || '', 
      operatorName: data.OperatorName || '',
      operatorAddress: data.OperatorAddress || '',
      operatorContactNos: data.OperatorContactNos || '',
      operatorEmail: data.OperatorEmail || '',
      operatorRepresentative: data.OperatorRepresentative || '',
      contactNo: data.ContactNo || '',
      email: data.Email || '',
      dateOfOperation: data.DateOfOperation || '',
      areaOfOperations: data.AreaOfOperations || '',
      status: data.Status === 1 ? 'active' : 'inactive',
      createdAt: data.CreatedAt || '',
      createdBy: data.CreatedBy || '',
      creationDate: data.CreatedAt || '',
      lastUpdatedDate: data.LastUpdatedDate || '',
      lastUpdatedBy: data.LastUpdatedBy || '',

      regionId: data.Region?.RegionId || null,
      regionName: data.Region?.RegionName || '',
      regionFull: data.Region?.RegionFull || '',
      psgc: data.Region?.PSGC || '',

      gameTypes: data.GameTypes?.map((g: any) => ({
        label: g.GameCategory || g.GameCategoryName || '',
        value: g.GameCategoryId,
      })) || [],

      provinces: data.Provinces?.map((p: any) => ({
        label: p.ProvinceName,
        value: p.ProvinceId,
      })) || [],
    };
  };

  // 2. Main load function
  const operatorFormData = useCallback(() => {
    if (initialUserOperatorData && initialUserOperatorData.data) {
      const operatorData = initialUserOperatorData.data;

      const mappedGameTypes = operatorData.GameTypes?.map(
        (gt: { GameCategory: any; GameCategoryId: any }) => ({
          label: gt.GameCategory,
          value: gt.GameCategoryId,
        })
      ) || [];

      const mappedCities = operatorData.Cities?.map(
        (pv: { CityId: any; CityName: any }) => ({
          label: pv.CityName,
          value: pv.CityId,
        })
      ) || [];

      setSelectedGameTypes(mappedGameTypes);

      if (operatorData.AreaOfOperationsOptionsId && areaOfOperationsOptions) {
        const matchedOption = areaOfOperationsOptions.find(
          (opt: any) => opt.value === operatorData.AreaOfOperationsOptionsId
        );
        if (matchedOption) {
          setselectedAreaOfOperations(matchedOption);
        }
      }

      const formattedData = mapSelectedOperatorToFormData(initialUserOperatorData);
      setFormData(formattedData);
    } else {
      setFormData({});
      setSelectedGameTypes([]);
      setselectedAreaOfOperations(null);
    }
  }, [initialUserOperatorData, areaOfOperationsOptions]);

  // 3. Effect to load when data is ready
  useEffect(() => {
    if (initialUserOperatorData?.data) {
      operatorFormData();
    }
  }, [operatorFormData]);

  // 4. Formik setup (NOTE: selectedUser should already be loaded before this runs)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...mapSelectedOperatorToFormData(initialUserOperatorData),
      remarks: '',
    },
    onSubmit: async (values) => {
      console.log("[Form Submit] Raw Submitted Values:", values);

      const result = await Swal.fire({
        title: "Update Confirmation",
        text: "Did you enter the correct details?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, I did",
        cancelButtonText: "No, let me check",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      // Clean and transform values for backend
      const cleanedData = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            (typeof value === "string" ? value.trim() !== "" : true)
        )
      );

      const transformedData = {
        ...cleanedData,
        status: cleanedData.status === "active" ? 1 : 0,
        gameTypes: Array.isArray(cleanedData.gameTypes)
          ? cleanedData.gameTypes.map((gt: any) => gt.value)
          : [],
      };

      console.log("[Form Submit] Transformed Payload:", transformedData);

      setFormData(transformedData);
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
    <form onSubmit={formik.handleSubmit}>
      {/* History */}
      <div>
        <div className="text-base font-bold mb-2">History</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="createdBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Created By
            </label>
            <Input
              id="createdBy"
              name="createdBy"
              value={formik.values.createdBy || "N/A"}
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
              //value={formik.values.lastUpdatedBy || "N/A"}
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
              id="createdAt"
              name="createdAt"
              value={
                formik.values.createdAt
                  ? dayjs(formik.values.createdAt).format(
                      "MMMM DD, YYYY hh:mm A"
                    )
                  : "N/A"
              }
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
              //value={formik.values.lastUpdatedDate || "N/A"}
              disabled
            />
          </div>
        </div>

        {/* Edit log modal */}
        <div className="w-full flex justify-end items-center mt-3">
          {initialUserOperatorData?.data?.OperatorId &&
            typeof onViewEditLogs === "function" && (
              <button
                type="button"
                onClick={() =>
                  onViewEditLogs(initialUserOperatorData.data.OperatorId)
                }
                className="bg-[#0038A8] py-2.5 px-4 text-white rounded-lg text-xs hover:bg-[#004ccf]"
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
          {/* Operator Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Name
            </label>
            <Input
              id="name"
              {...formik.getFieldProps("name")}
              disabled={isDisabled}
            />
          </div>
          {/* Contact Number */}
          <div>
            <label
              htmlFor="contactNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Phone Number
            </label>
            <Input
              id="contactNo"
              type="text"
              {...formik.getFieldProps("contactNo")}
              disabled={isDisabled}
            />
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label
              htmlFor="operatorAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Address
            </label>
            <Input
              id="operatorAddress"
              {...formik.getFieldProps("operatorAddress")}
              disabled
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Email Address
            </label>
            <Input
              id="email"
              {...formik.getFieldProps("email")}
              disabled={isDisabled}
            />
          </div>

          {/* Date of Operation */}
          <div>
            <label
              htmlFor="dateOfOperation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Operations
            </label>
            <Input
              id="dateOfOperation"
              name="dateOfOperation"
              type="date"
              value={
                formik.values.dateOfOperation
                  ? dayjs(formik.values.dateOfOperation).format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e) =>
                formik.setFieldValue("DateOfOperation", e.target.value)
              }
              disabled={isDisabled}
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
            <Select
              id="gameTypes"
              name="gameTypes"
              isMulti
              options={gameTypeOptions}
              value={formik.values.gameTypes}
              onChange={(selected) =>
                formik.setFieldValue("gameTypes", selected)
              }
              classNamePrefix="react-select"
              placeholder="Select Games Provided"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Area Of Operations */}
          <div className="w-full">
            <label
              htmlFor="areaOfOperations"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area Of Operations
            </label>
            <Select
              id="areaOfOperations"
              name="areaOfOperations"
              options={areaOfOperationsOptions}
              value={
                areaOfOperationsOptions.find(
                  (opt) => opt.value === formik.values.areaOfOperations
                ) || null
              }
              isDisabled={isDisabled}
              onChange={(selected) =>
                formik.setFieldValue("areaOfOperations", selected?.value)
              }
              classNamePrefix="react-select"
              placeholder="Select Area of Operations"
            />
          </div>

          {/* Provinces */}
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
              value={formik.values.provinces}
              onChange={(selected) =>
                formik.setFieldValue("provinces", selected)
              }
              classNamePrefix="react-select"
              placeholder="Select Provinces"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Status */}
          <div className="w-full">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <Select
              id="status"
              name="status"
              options={statusOptions}
              value={
                statusOptions.find(
                  (opt) => opt.value === formik.values.status
                ) || null
              }
              onChange={(selected) =>
                formik.setFieldValue("status", selected?.value)
              }
              isDisabled={isDisabled}
              placeholder="Select Status"
              classNamePrefix="react-select"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 400,
                  overflowY: "auto",
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Remarks */}
      {!isDisabled && (
        <div className="col-span-2 my-2">
          <label htmlFor="remarks" className="block text-sm">
            Remarks
          </label>
          <Input
            type="text"
            name="remarks"
            id="remarks"
            className="mt-1"
            value={formik.values.remarks}
            onChange={formik.handleChange}
            error={!!(formik.touched.remarks && formik.errors.remarks)}
          />
          {formik.touched.remarks && formik.errors.remarks && (
            <p className="text-[#CE1126] text-xs mt-1">
              {formik.errors.remarks}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showEditButton && (
        <div className="w-full flex justify-end items-center my-2">
          <button
            type={isDisabled ? "button" : "submit"}
            onClick={isDisabled ? handleDisable : undefined}
            className="w-full mt-3 px-7 py-2 bg-[#F6BA12] text-black text-sm rounded transition"
          >
            {isDisabled ? "Update" : "Save"}
          </button>
        </div>
      )}

      {!isDisabled && (
        <button
          type="submit"
          className="col-span-2 mt-2 w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2"
        >
          Save
        </button>
      )}
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
    </form>
  );
};

export default OperatorViewPage;
