import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import { Operator, User } from "~/types/types";
import UpdateUserForm from "./UpdateUserForm";
import { OperatorsItem } from "~/lib/api/operators/operators.service";
import { UsersItem } from "~/lib/api/users/users.service";

type UpdateUserModalProps = {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: User) => void;
  operatorMap?: Record<number, OperatorsItem>;
  userTypeId: number;
  selectedUser?: UsersItem | null;
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
      isOpen={open ?? false}
      onClose={onClose ?? (() => {})}
      title={title}
    >
      <UpdateUserForm
        operatorMap={operatorMap ?? {}}
        onSubmit={onSubmit}
        userTypeId={userTypeId}
        selectedUser={selectedUser}
        onViewEditLogs={onViewEditLogs}
        onClose={onClose ?? (() => {})}
      />
    </ModalWrapper>
  );
}
