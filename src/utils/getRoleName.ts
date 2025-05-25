import useUserRoleStore from "../store/useUserStore";

const { roleId } = useUserRoleStore();

const getRoleName = () => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname.includes("managers")) return "Manager";
    if (pathname.includes("executives")) return "Executive";
    if (pathname.includes("operators")) return "Operator";
  }
  switch (roleId) {
    case 2:
      return "Manager";
    case 3:
      return "Executive";
    default:
      return "Operator";
  }
};
