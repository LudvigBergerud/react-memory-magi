import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider.jsx";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === false) {
    return <Navigate to="/landingpage" />;
  }
  return children;
};
