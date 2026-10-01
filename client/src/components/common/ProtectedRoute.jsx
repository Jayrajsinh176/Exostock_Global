import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "../../api";

/**
 * ProtectedRoute component that checks authentication before rendering children
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ children, requiredAccess }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredAccess =
    requiredAccess === "business"
      ? AuthService.hasBusinessAccess()
      : requiredAccess === "standard"
        ? AuthService.hasStandardAccess()
        : requiredAccess === "basic"
          ? AuthService.hasBasicAccess()
          : true;

  if (!hasRequiredAccess) {
    return <Navigate to="/subscription" replace />;
  }

  return children;
};

export default ProtectedRoute;
