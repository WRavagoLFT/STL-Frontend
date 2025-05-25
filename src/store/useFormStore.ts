// this file is responsible for managing the form state using Zustand
// and provides functions to set, update, and reset the form data.

import { create } from 'zustand';

type FormStore = {
  setFormData: (data: { [key: string]: string | number }) => void;
  formData: { [key: string]: string | number };

  updateFormField: (key: string, value: string) => void;
  resetFormData: () => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  children?: React.ReactNode; // Added children property
};

export const useFormStore = create<FormStore>((set) => ({
  formData: {},
  setFormData: (data) => {
    set({ formData: { ...data, userTypeId: data.userTypeId || '2' } }); // Ensure userTypeId is set
  },
  updateFormField: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),
  resetFormData: () => set({ formData: {} }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),

  children: undefined,
}));

