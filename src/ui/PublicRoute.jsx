import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute() {
  const { authChecked, isAuthenticated } = useAuth();

  if (!authChecked) {
    return (
      <div className="px-4 py-10 text-center text-sm text-slate-400">
        Checking session...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
