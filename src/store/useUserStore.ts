import { create } from 'zustand';
import { Column } from '~/types/interfaces';  // Ensure the `Column` type is correctly defined.
import { User, Operator } from '~/types/types';

interface UserRoleStore {
  roleId: number | null;
  setRoleId: (roleId: number | null) => void;
  setData: (data: User[]) => void;
  columns: Column<User>[];
  setColumns: (columns: Column<User>[]) => void;
  setEditLogColumns: (columns: Column<User>[]) => void;
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setFieldName: (fieldName: string) => void;

  // State variables
  data: User[];
  userSummaryColumns: Column<User>[]; // Separate state for UserSummary columns
  editLogColumns: Column<User>[]; // Separate state for EditLog columns
  operatorMap: { [key: number]: Operator };
  modalOpen: boolean;
  fieldName: string;
  fields: {
    value: any;
    name: string;
    label: string;
    type: string;
    placeholder: string;
  
  }[];

  // Modal-related state and setter
  modalData: any[];
  setModalData: (data: any[]) => void;

  // Fields state and setter
  setFields: (fields: { name: string; label: string; type: string; placeholder: string; value: string }[]) => void;
}

const useUserRoleStore = create<UserRoleStore>((set) => ({
  roleId: null,
  data: [],
  userSummaryColumns: [], // Initialize separate columns for UserSummary
  editLogColumns: [], // Initialize separate columns for EditLog
  modalOpen: false,
  operatorMap: {},
  fieldName: "",
  fields: [],
  modalData: [],
  columns: [],

  // Setters for columns
  setModalData: (data) => set({ modalData: data }),
  setRoleId: (roleId) => set({ roleId }),
  setData: (data) => set({ data }),
  setEditLogColumns: (columns: Column<User>[]) => set({ editLogColumns: columns }),
  setColumns: (columns) => set({ columns }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
  setOperatorMap: (operatorMap) => set({ operatorMap }),
  setFieldName: (fieldName) => set({ fieldName }),
  setFields: (fields) => {
    set({
      fields: fields.map(field => ({
        ...field,
        value: field.value || '',
      }))
    });
  }
}));

export default useUserRoleStore;
