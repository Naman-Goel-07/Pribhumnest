import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Home/Login";
import { toast } from "react-toastify";

const LoginRedirect = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      setTimeout(()=>{
      toast.success("Login Successfully")

      },1000)

    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? <Login /> : null;
};

export default LoginRedirect