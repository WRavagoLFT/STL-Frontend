import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import AddUserForm from "./AddUserForm";
import { Branch, Operator, User } from "~/types/types";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
  operatorMap: Record<number, Operator>;
  userTypeId: number;
  pcsoBranchMap: { data: Branch[] };
  kaboMap: User | null;
};

export default function AddUserModal({ open, onClose, operatorMap, onSubmit, userTypeId, pcsoBranchMap, kaboMap }: AddUserModalProps) {
  const title =
  userTypeId === 1 ? "Add Kubrador"
    : userTypeId === 2 ? "Add Kabo"
    : userTypeId === 4 ? "Add Manager"
    : userTypeId === 5 ? "Add Executive"
    : "Add User";

  return (
    <ModalWrapper isOpen={open} onClose={onClose} title={title}>
      <AddUserForm 
        onClose={onClose}
        operatorMap={operatorMap}
        onSubmit={onSubmit}
        userTypeId={userTypeId}
        pcsoBranchMap={pcsoBranchMap}
        kaboMap={kaboMap}
      />
    </ModalWrapper>
  );
}
