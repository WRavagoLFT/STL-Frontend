import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import { Operator, User } from "~/types/types";
import UpdateUserForm from "./UpdateUserForm";

type UpdateUserModalProps = {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: User) => void;
  operatorMap?: Record<number, Operator>;
  userTypeId: number;
  selectedUser?: User | null;
  onViewEditLogs?: (userId: number) => void;

  user?: User;
  slug?: string;
};

export default function UpdateUserModal({
  open,
  onClose,
  operatorMap,
  onSubmit,
  userTypeId,
  selectedUser,
  onViewEditLogs,
}: UpdateUserModalProps) {
  
  const title = userTypeId === 4 ? "Update Manager" : userTypeId === 3 ? "Update Executive" : "Update User";

  return (
    <ModalWrapper
      isOpen={open ?? false} // fallback to false if undefined
      onClose={onClose ?? (() => {})} // fallback to no-op function if undefined
      title={title}
    >
      <UpdateUserForm
        operatorMap={operatorMap ?? {}} // fallback to empty object
        onSubmit={onSubmit}
        userTypeId={userTypeId}
        selectedUser={selectedUser}
        onViewEditLogs={onViewEditLogs}
        onClose={onClose ?? (() => {})} // same fallback here
      />
    </ModalWrapper>
  );
}
