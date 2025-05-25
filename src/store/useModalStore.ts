import { create } from "zustand";
import { Operator, User } from "~/types/types";

type ModalType = "create" | "view" | "editlog" | "page" | null;

interface ModalState {
  modalOpen: boolean;
  modalType: ModalType;
  selectedData: User | Operator | null;

  operatorId: number | null;               // add operatorId here
  setOperatorId: (id: number | null) => void;  // add setter

  openModal: (type: ModalType, data?: User | Operator | null) => void;
  closeModal: () => void;
  setSelectedData: (data: User | Operator | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalOpen: false,
  modalType: null,
  selectedData: null,
  
  operatorId: null,           // initialize operatorId here
  setOperatorId: (id) => set({ operatorId: id }),

  openModal: (type, data = null) =>
    set({ modalOpen: true, modalType: type, selectedData: data }),

  closeModal: () => set({ modalOpen: false, modalType: null, selectedData: null }),

  setSelectedData: (data) => set({ selectedData: data }),
}));
