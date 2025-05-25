import { create } from "zustand";
import { Operator } from "../src/types/types";
import { Column, Field } from "~/types/interfaces";

export interface OperatorsState {
  data: Operator[];
  columns: Column<Operator>[];
  operators: Operator[];
  operatorMap: Record<number, Operator>;
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  fields: Field[];
  selectedData: Operator | null;

  setData: (data: Operator[]) => void;
  setColumns: (columns: Column<Operator>[]) => void;
  setOperators: (operators: Operator[]) => void;
  setOperatorMap: (operatorMap: Record<number, Operator>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setModalOpen: (open: boolean) => void;
  setFields: (fields: Field[]) => void;
  setSelectedData: (data: Operator | null) => void;
}

export const useOperatorsData = create<OperatorsState>((set) => ({
  data: [],
  columns: [],
  operators: [],
  operatorMap: {}, // Ensures type safety
  loading: false,
  error: null,
  modalOpen: false,
  fields: [],
  selectedData: null,

  setData: (data) => set({ data }),
  setColumns: (columns) => set({ columns }),
  setOperators: (operators) => set({ operators }),
  setOperatorMap: (operatorMap) => set({ operatorMap }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setModalOpen: (open) => set({ modalOpen: open }),
  setFields: (fields) => set({ fields }),
  setSelectedData: (data) => set({ selectedData: data }),
}));
