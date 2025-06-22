"use client";

import { AccessGuard } from "~/components/auth/AccessGuard";
import UsersPage from "~/components/user/ParentUser";
import { useParams } from "next/navigation";

type RoleKey = "kubrador" | "kabo" | "executives" | "managers";

const roleMap: Record<
  RoleKey,
  {
    label: string;
    textlabel: string;
    roleId: number;
    permittedUserTypes: number[];
  }
> = {
  kubrador: {
    label: "Kubrador",
    textlabel: "Kubrador",
    roleId: 1,
    permittedUserTypes: [3, 4],
  },
  kabo: {
    label: "Kabo",
    textlabel: "Kabo",
    roleId: 2,
    permittedUserTypes: [3, 4, 5],
  },
  executives: {
    label: "Small Town Lottery Executive",
    textlabel: "Executives",
    roleId: 5,
    permittedUserTypes: [6],
  },
  managers: {
    label: "Small Town Lottery Manager",
    textlabel: "Managers",
    roleId: 4,
    permittedUserTypes: [6],
  },
};

export default function Page() {
  const params = useParams();
  const roleParam = (params?.role as string)?.toLowerCase() as RoleKey;

  const roleConfig = roleMap[roleParam];
  const roleKey =
    roleParam === "managers"
      ? "manager"
      : roleParam === "executives"
      ? "executive"
      : roleParam;

  if (!roleConfig) {
    return <div className="p-4 text-lg font-medium">Role not found.</div>;
  }

  return (
    <AccessGuard allowedUserTypes={roleConfig.permittedUserTypes}>
      <UsersPage roleConfig={roleConfig} roleKey={roleKey} />
    </AccessGuard>
  );
}
