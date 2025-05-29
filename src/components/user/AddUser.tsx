import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import AddUserForm from "./AddUserForm";
import { Operator, User } from "~/types/types";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
  operatorMap: Record<number, Operator>;
  userTypeId: number;
};

export default function AddUserModal({ open, onClose, operatorMap, onSubmit, userTypeId }: AddUserModalProps) {
  const title = userTypeId === 4 ? "Add Manager" : userTypeId === 3 ? "Add Executive" : "Add User";

  return (
    <ModalWrapper isOpen={open} onClose={onClose} title={title}>
      <AddUserForm onClose={onClose} operatorMap={operatorMap} onSubmit={onSubmit} userTypeId={userTypeId}/>
    </ModalWrapper>
  );
}
