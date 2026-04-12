import { useState } from "react";
import loginImg from "../../assets/login.webp";
import * as yup from "yup";
import { Formik, Form } from "formik";
import TextField from "@mui/material/TextField";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FaGoogle } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";


const Login = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate()

  const {users , loading ,error}= useSelector(state => state.user)
  
  const dispatch = useDispatch()

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 


  const handleVisiblePassword = () => {
    setVisible(!visible);
  };

  const initialState = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object({
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

const handleSubmit = async (values) => {
  try {
    await dispatch(userLogin(values)).unwrap();
  } catch (error) {
    console.log(error)
    toast.error(error)
    return error;
  }
};


  return (
    <>
      <Helmet>
        <title>Login | Pribhumnest</title>
        <meta
          name="description"
          content="Login to your Pribhumnest account to manage your PG listings, enquiries, and profile."
        />
        <link rel="canonical" href="https://www.pribhumnest.in/login" />
      </Helmet>
       <div className="flex items-center justify-center  bg-gradient-to-br from-white via-[#f1fefc] to-[#d5f5f3] p-6 ">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden bg-white bg-opacity-20 backdrop-blur-md">
        <div className="hidden lg:block">
          <img
            src={loginImg}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-10">
          <Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, values, touched, errors }) => (
              <Form className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-[#0ABAB5]">
                    Welcome Back
                  </h2>
                  <p className="text-gray-700 text-sm">
                    Please log in to your account
                  </p>
                </div>

             <div>
                 <TextField
                  fullWidth
                  name="email"
                  label="Enter Your Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  
                />

             </div>
                <div>
                  <TextField
                  fullWidth
                  name="password"
                  label="Enter Your Password"
                  type={visible ? "password" : "text"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleVisiblePassword} edge="end">
                          {visible ? <MdVisibilityOff /> : <MdVisibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                </div>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#0ABAB5",
                    textTransform: "none",
                    fontWeight: "bold",
                    margin:"0 0 10px 0"
                  }}

                  disabled={loading}
                >
                  {loading ? <Loader/>  : "Login"}
                </Button>

              <div className="py-4">
                <p className="text-xs text-center text-gray-700">
                  Don't have an account?{" "}
                  <button
                  type="button"
                  onClick={()=>navigate("/register")}
                    className="text-[#0ABAB5] font-bold cursor-pointer hover:underline "
                  >
                    Register here
                  </button>
                </p>
              </div>

                
                  <Button onClick={()=>navigate("forgotPassword")} variant="text" color="error"  fullWidth>Forgot Password?</Button>
                           
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
