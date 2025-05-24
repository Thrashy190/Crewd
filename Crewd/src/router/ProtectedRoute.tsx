import { Navigate, Outlet } from "react-router";
//import { useAuth } from '../core/contexts/AuthContext'

const ProtectedRoute = () => {
  // { isAuthenticated } = useAuth()

  return true ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
