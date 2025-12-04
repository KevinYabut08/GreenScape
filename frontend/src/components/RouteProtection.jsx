import { Navigate } from "react-router-dom";

const RouteProtection = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "employee") return <Navigate to="/employeeHome" replace />;
    if (role === "client") return <Navigate to="/home" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RouteProtection;
