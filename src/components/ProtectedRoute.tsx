import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminRoute?: boolean;
  isAdmin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAdmin,
  adminRoute,
  redirect = "/",
  children,
  isAuthenticated,
}: Props) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;
  if (adminRoute && !isAdmin) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
