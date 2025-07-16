import { create } from "zustand";
import { OperatorsItem } from "@/lib/api/operators/operators.service";

interface OperatorFormStore {
  gameTypes: OperatorsItem[];
  regions: OperatorsItem[];
  provinces: OperatorsItem[];
  cities: OperatorsItem[];
  areaOfOperations: OperatorsItem[];

  data: OperatorsItem[];               // <-- Add main operator data here
  setData: (data: OperatorsItem[]) => void;

  setGameTypes: (gameTypes: OperatorsItem[]) => void;
  setRegions: (regions: OperatorsItem[]) => void;
  setProvinces: (provinces: OperatorsItem[]) => void;
  setCities: (cities: OperatorsItem[]) => void;
  setAreaOfOperations: (areaOfOperations: OperatorsItem[]) => void;
}

export const useOperatorFormStore = create<OperatorFormStore>((set) => ({
  gameTypes: [],
  regions: [],
  provinces: [],
  cities: [],
  areaOfOperations: [],

  data: [],                    // <-- initial data empty array
  setData: (data) => set({ data }),

  setGameTypes: (gameTypes) => set({ gameTypes }),
  setRegions: (regions) => set({ regions }),
  setProvinces: (provinces) => set({ provinces }),
  setCities: (cities) => set({ cities }),
  setAreaOfOperations: (areaOfOperations) => set({ areaOfOperations }),
}));
