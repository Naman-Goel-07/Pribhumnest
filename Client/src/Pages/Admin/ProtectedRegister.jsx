import { Navigate } from "react-router-dom";

export const ProtectedRegister = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/registerOtp" />;
};
