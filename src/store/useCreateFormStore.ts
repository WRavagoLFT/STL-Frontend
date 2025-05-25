import { create } from 'zustand';

type FormData = {
  [key: string]: string | number | boolean | string[];
};

interface CreateFormStore {
  formData: FormData;
  setFormData: (data: FormData) => void;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
  setErrors: (errors: Record<string, string[]>) => void;
  isVerifyModalOpen: boolean;
  setIsVerifyModalOpen: (isOpen: boolean) => void;
  filteredProvinces: any[];
  setFilteredProvinces: (provinces: any[]) => void;
  filteredCities: any[];
  setFilteredCities: (cities: any[]) => void;
  resetForm: () => void;
}

export const useCreateFormStore = create<CreateFormStore>((set) => ({
  formData: {},
  setFormData: (data) => set({ formData: data }),
  updateField: (field, value) =>
    set((state) => ({ formData: { ...state.formData, [field]: value } })),
  errors: {},
  setErrors: (errors) => set({ errors }),
  isVerifyModalOpen: false,
  setIsVerifyModalOpen: (isOpen) => set({ isVerifyModalOpen: isOpen }),
  filteredProvinces: [],
  setFilteredProvinces: (provinces) => set({ filteredProvinces: provinces }),
  filteredCities: [],
  setFilteredCities: (cities) => set({ filteredCities: cities }),
  resetForm: () =>
    set({
      formData: {},
      errors: {},
      isVerifyModalOpen: false,
      filteredProvinces: [],
      filteredCities: [],
    }),
}));
