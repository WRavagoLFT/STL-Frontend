import { create } from 'zustand';

export interface UpdateModalState {
  user: any;
  errors: Record<string, string>;
  isDisabled: boolean;
  isLoading: boolean;
  isViewMode: boolean;
  status: string;
  areaOfOperations: string;
  isVerifyModalOpen: boolean;
  selectedUserId: number | null;
  openEditLogModal: boolean;
  
  setUser: (user: any) => void;
  setErrors: (errors: Record<string, string>) => void;
  setStatus: (status: string) => void;
  handleManagerChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setIsVerifyModalOpen: (val: boolean) => void;
  setSelectedUserId: (id: number | null) => void;
  setOpenEditLogModal: (val: boolean) => void;
  handleMultiSelect: (fieldName: string, selectedOptions: any[]) => void;
}

export const useUpdateModalState = create<UpdateModalState>((set) => ({
  user: {},
  errors: {},
  isDisabled: true,
  isLoading: false,
  isViewMode: true,
  status: '',
  areaOfOperations: '',
  isVerifyModalOpen: false,
  selectedUserId: null,
  openEditLogModal: false,

  setUser: (user) => set({ user }),
  setErrors: (errors) => set({ errors }),
  setStatus: (status) => set({ status }),
  handleManagerChange: (e) =>
    set((state) => ({
      user: { ...state.user, [e.target.name]: e.target.value },
    })),
  setIsVerifyModalOpen: (val) => set({ isVerifyModalOpen: val }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  setOpenEditLogModal: (val) => set({ openEditLogModal: val }),

  handleMultiSelect: (fieldName, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    set((state) => ({
      user: {
        ...state.user,
        [fieldName]: selectedValues,
      },
    }));
  },
}));

export default useUpdateModalState;
