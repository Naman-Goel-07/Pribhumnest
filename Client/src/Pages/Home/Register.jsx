import { useState } from "react";
import { motion } from "framer-motion";
import registerImg from "../../assets/register.jpg";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../../redux/Slice/userSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Register = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate()
  const {users,loading,error} = useSelector(state=>state.user)
  const dispatch = useDispatch()

  const token = localStorage.getItem("Token")


  const handleVisiblePassword = () => {
    setVisible(!visible);
  };

  const initialState = {
    name: "",
    email: "",
    password: "",
    contact:""
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is Required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("email is required"),
    contact: yup.string().matches(/^\d{10}$/, "Must be a valid 10-digit number").required("Contact is required"),
    password: yup.string().required("password is required"),
  });

  const handleSubmit = async(values) => {
    try {
      const result = await dispatch(userRegister(values)).unwrap()

      if (result.needsEmailVerification) {
        toast.info(result.message)
        navigate("/verify-email")
      } else {
        toast.success("Registered Successfully!")
        navigate("/")
      }

    } catch (error) {
      toast.error(typeof error === "string" ? error : "Registration failed.")
    }
  };
  return (
    <div className="bg-gradient-to-br from-white via-[#f1fefc] to-[#d5f5f3] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl"
      >
        {/* Image Side */}
        <div className="relative hidden lg:block">
          <img
            src={registerImg}
            alt="Register Illustration"
            className="h-full w-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Form Side */}
        <div className="flex flex-col items-center justify-center px-8 py-12 bg-white/30">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-extrabold text-[#0ABAB5] mb-2">
              Create Account
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Join Pribhum Nest and start your journey 🌿
            </p>
          </div>
          <Formik
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            initialValues={initialState}
          >
            {({ handleChange, handleBlur, values, touched, errors }) => (
              <Form className="w-full max-w-md space-y-3">
                {/* Name */}
                <div className="relative">
                  <TextField
                    name="name"
                    label="Enter Your Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <TextField
                    name="email"
                    label="Enter Your Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    className="peer w-full bg-white pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] text-sm"
                  />
                </div>

                   <div className="relative">
                  <TextField
                    name="contact"
                    label="Enter Your Contact"
                    value={values.contact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.contact && Boolean(errors.contact)}
                    helperText={touched.contact && errors.contact}
                    className="peer w-full bg-white pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <TextField
                    type={visible ? "password" : "text"}
                    name="password"
                    label="Enter You Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleVisiblePassword}
                            edge="end"
                          >
                            {visible ? <MdVisibilityOff /> : <MdVisibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Register Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#0ABAB5] text-white font-semibold py-2.5 rounded-lg hover:bg-[#089b96] transition-all duration-300 cursor-pointer"
                >
                  Register
                </motion.button>

                {/* Login Link */}
                <p className="text-xs text-center text-gray-500 mt-4">
                  Already have an account?
                  <button
                    onClick={()=>navigate("/login")}
                    className="text-[#0ABAB5] font-semibold cursor-pointer hover:underline"
                  >
                    Login
                  </button>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
