import { create } from 'zustand';
import { Column } from '~/types/interfaces';
import { User, Operator, RoleConfig } from '~/types/types';

interface Field {
  value: any;
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

interface UserRoleStore {
  roleId: number | null;
  setRoleId: (roleId: number | null) => void;

  data: User[];
  setData: (data: User[] | ((prev: User[]) => User[])) => void;

  columns: Column<User>[];
  setColumns: (columns: Column<User>[]) => void;

  userSummaryColumns: Column<User>[];
  setUserSummaryColumns: (columns: Column<User>[]) => void;

  editLogColumns: Column<User>[];
  setEditLogColumns: (columns: Column<User>[]) => void;

  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;

  kaboMap: { [key: number]: any };
  setKaboMap: (kaboMap: { [key: number]: any }) => void;

  pscoBranchMap: { [key: number]: any };
  setPscoBranchMap: (pscoBranchMap: { [key: number]: any }) => void;

  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;

  modalData: any[];
  setModalData: (data: any[]) => void;

  fieldName: string;
  setFieldName: (fieldName: string) => void;

  fields: Field[];
  setFields: (fields: Field[]) => void;

  roleConfig: RoleConfig | null;
  setRoleConfig: (roleConfig: RoleConfig | null) => void;

  roleKey: string | null;
  setRoleKey: (roleKey: string | null) => void;
}

const useUserRoleStore = create<UserRoleStore>((set, get) => ({
  roleId: null,
  data: [],
  columns: [],
  userSummaryColumns: [],
  editLogColumns: [],
  operatorMap: {},
  kaboMap: {},
  pscoBranchMap: {},
  modalOpen: false,
  modalData: [],
  fieldName: '',
  fields: [],
  roleConfig: null,
  roleKey: null,

  setRoleId: (roleId) => set({ roleId }),

  setData: (dataOrUpdater) =>
    set((state) => ({
      data: typeof dataOrUpdater === 'function' ? dataOrUpdater(state.data) : dataOrUpdater,
    })),

  setColumns: (columns) => set({ columns }),
  setUserSummaryColumns: (columns) => set({ userSummaryColumns: columns }),
  setEditLogColumns: (columns) => set({ editLogColumns: columns }),

  setOperatorMap: (operatorMap) => set({ operatorMap }),
  setKaboMap: (kaboMap) => set({ kaboMap }),
  setPscoBranchMap: (pscoBranchMap) => set({ pscoBranchMap }),

  setModalOpen: (modalOpen) => set({ modalOpen }),
  setModalData: (modalData) => set({ modalData }),
  setFieldName: (fieldName) => set({ fieldName }),

  setFields: (fields) =>
    set({
      fields: fields.map((field) => ({
        ...field,
        value: field.value ?? '',
      })),
    }),

  setRoleConfig: (roleConfig) => set({ roleConfig }),
  setRoleKey: (roleKey) => set({ roleKey }),
}));

export default useUserRoleStore;
