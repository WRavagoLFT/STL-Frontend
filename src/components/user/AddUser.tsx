import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import AddUserForm from "./AddUserForm";
import { Branch, Operator, User } from "~/types/types";
import { AddUserPayload, UsersItem } from "~/lib/api/users/users.service";
import { OperatorsItem } from "~/lib/api/operators/operators.service";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserPayload) => void;
  operatorMap: Record<number, OperatorsItem>;
  userTypeId: number;
  pcsoBranchMap: { data: Branch[] };
  kaboMap: UsersItem | null;
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
