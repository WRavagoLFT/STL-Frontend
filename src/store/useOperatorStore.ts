import { create } from "zustand";
import { OperatorsItem } from "~/lib/api/operators/operators.service";
import { Column } from "~/types/interfaces";

export interface OperatorsState {
  data: OperatorsItem[];
  columns: Column<OperatorsItem>[];
  operators: OperatorsItem[];
  operatorMap: Record<number, OperatorsItem>;
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  //fields: Field[];
  selectedData: OperatorsItem | null;

  setData: (data: OperatorsItem[]) => void;
  setColumns: (columns: Column<OperatorsItem>[]) => void;
  setOperators: (operators: OperatorsItem[]) => void;
  setOperatorMap: (operatorMap: Record<number, OperatorsItem>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setModalOpen: (open: boolean) => void;
  //setFields: (fields: Field[]) => void;
  setSelectedData: (data: OperatorsItem | null) => void;
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
  //setFields: (fields) => set({ fields }),
  setSelectedData: (data) => set({ selectedData: data }),
}));
