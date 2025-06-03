import { create } from "zustand";
import { Operator } from "~/types/types";

interface OperatorFormStore {
  gameTypes: Operator[];
  regions: Operator[];
  provinces: Operator[];
  cities: Operator[];
  areaOfOperations: Operator[];

  data: Operator[];               // <-- Add main operator data here
  setData: (data: Operator[]) => void;

  setGameTypes: (gameTypes: Operator[]) => void;
  setRegions: (regions: Operator[]) => void;
  setProvinces: (provinces: Operator[]) => void;
  setCities: (cities: Operator[]) => void;
  setAreaOfOperations: (areaOfOperations: Operator[]) => void;
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
