import { create } from 'zustand';
import { OperatorsItem } from '~/lib/api/operators/operators.service';
import { UsersItem } from '~/lib/api/users/users.service';
import { Column } from '~/types/interfaces';
import { Operator, RoleConfig } from '~/types/types';

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

  data: UsersItem[];
  setData: (data: UsersItem[] | ((prev: UsersItem[]) => UsersItem[])) => void;

  columns: Column<UsersItem>[];
  setColumns: (columns: Column<UsersItem>[]) => void;

  userSummaryColumns: Column<UsersItem>[];
  setUserSummaryColumns: (columns: Column<UsersItem>[]) => void;

  editLogColumns: Column<UsersItem>[];
  setEditLogColumns: (columns: Column<UsersItem>[]) => void;

  operatorMap: { [key: number]: OperatorsItem };
  setOperatorMap: (operatorMap: { [key: number]: OperatorsItem }) => void;

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
