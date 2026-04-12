import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {Loader} from "../../Components/Utils/Loader.jsx"


const Protected = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated} = useSelector((state) => state.user);


  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);


  if (loading) return <Loader/>;
  return (
    <>
      <Outlet />
    </>
  );
};

export default Protected;
