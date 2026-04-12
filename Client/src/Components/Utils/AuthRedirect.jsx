import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthRedirect = ( {isAuthenticated} ) => {
  const navigate = useNavigate();
  const location = useLocation();

   const excludedPaths = ["/login", "/register", "/registerOtp", "/login/forgotPassword", "/login/forgotPassword/otp-verify","/login/forgotPassword/otp-verify/update-password"];
  useEffect(() => {
    if (!isAuthenticated && !excludedPaths.includes(location.pathname)) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 120000); 

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return null;
};

export default AuthRedirect;
