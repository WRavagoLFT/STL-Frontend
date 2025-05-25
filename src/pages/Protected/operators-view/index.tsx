import React, { useCallback, useEffect, useState } from "react";
import OperatorViewPage from "~/components/operators/OperatorView";
import { useOperatorFormStore } from "../../../store/useOperatorFormStore";
import {
  fetchCityData,
  fetchProvinceData,
  fetchRegionData,
} from "~/services/locationService";
import {
  fetchAreaOfOperations,
  fetchGameCategories,
} from "~/services/userService";
import { useOperatorsData } from "../../../store/useOperatorStore";
import { operatorConfig } from "~/config/operatorFormFields";
import { operatorSchema } from "~/schemas/operatorSchema";
import { Operator } from "~/types/types";
import RetailReceiptOperatorsPage from "~/components/operators/RetailReceipts";
import BackIconButton from "~/components/ui/icons/BackButton";
import router from "next/router";

export interface OperatorViewPageProps {
  slug: string;
  operator: Operator;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug, operator }) => {
  const {
    gameTypes,
    regions,
    provinces,
    cities,
    areaOfOperations,
    selectedRegion,
    selectedProvince,
    setGameTypes,
    setRegions,
    setProvinces,
    setCities,
    setAreaOfOperations,
  } = useOperatorFormStore();

  const { fields, setFields } = useOperatorsData();

console.log('OPERATOR:', operator);

  // Fetch gameTypes and location data once on mount
  useEffect(() => {
    Promise.all([
      fetchGameCategories(setGameTypes),
      fetchRegionData(setRegions),
      fetchProvinceData(setProvinces),
      fetchCityData(setCities),
      fetchAreaOfOperations(setAreaOfOperations),
    ]).catch(console.error);
  }, [setGameTypes, setRegions, setProvinces, setCities, setAreaOfOperations]);

  // Update form fields options
  useEffect(() => {
    const updatedFields = operatorConfig.fields.map((field) => {
      if (field.name === "gameTypes") {
        return {
          ...field,
          options: gameTypes.map((g) => ({
            value: g.GameCategoryId,
            label: g.GameCategory,
          })),
        };
      }
      if (field.name === "regions") {
        return {
          ...field,
          options: regions.map((r) => ({
            value: r.RegionId,
            label: r.RegionName,
          })),
        };
      }
      if (field.name === "provinces") {
        const filtered =
          Array.isArray(provinces) && selectedRegion
            ? provinces.filter((p) => p?.RegionId === selectedRegion)
            : [];
        return {
          ...field,
          options: filtered.map((p) => ({
            value: p?.ProvinceId ?? 0,
            label: p?.ProvinceName ?? "Unknown",
          })),
        };
      }
      if (field.name === "cities") {
        const filtered =
          Array.isArray(cities) && selectedProvince
            ? cities.filter((c) => c?.ProvinceId === selectedProvince)
            : [];
        return {
          ...field,
          options: filtered.map((c) => ({
            value: c?.CityId ?? 0,
            label: `${c?.CityName ?? "Unknown"} (${c?.ProvinceKey ?? ""})`,
          })),
        };
      }

      return field;
    });

    setFields(updatedFields);
  }, [
    gameTypes,
    regions,
    provinces,
    cities,
    selectedRegion,
    selectedProvince,
    setFields,
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center space-x-4">
          <BackIconButton
            to="/operators"
            bgColor="#0038A8"
            hoverColor="#004ccf"
            iconColor="#fff"
            size={30}
            onClick={() => {
              router.push("/operators"); // navigate
            }}
          />
        <div className="text-2xl md:text-3xl font-bold truncate">
          {operator?.data?.OperatorName || "N/A"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-4 w-full mt-1">
        {/* Left Side - Operator View */}
        <div className="flex flex-col w-full md:w-3/5">
          <OperatorViewPage
            fields={fields}
            endpoint={operatorConfig.endpoint}
            initialUserData={operator}
            gameTypes={gameTypes}
            provinces={provinces}
            regions={regions}
            cities={cities}
            areaofoperations={areaofoperations}
            schema={operatorSchema}
            isOpen={false}
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
            children={function (props: {
              handleSubmit: () => void;
            }): React.ReactNode {
              throw new Error("Function not implemented.");
            }}
          />
        </div>

        {/* Right Side - Retail Receipt */}
        <div className="flex flex-col w-full md:w-2/5 min-w-0">
          <RetailReceiptOperatorsPage 
            operatorId={operator?.data?.OperatorId}
          />
        </div>
      </div>
    </div>
  );
};

export default OperatorsView;
