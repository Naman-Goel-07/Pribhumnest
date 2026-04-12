import { Button, InputAdornment, TextField } from "@mui/material";
import lock from "../../assets/forgot.gif";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { AiOutlineSend } from "react-icons/ai";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../../redux/Slice/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialState = {
    email: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email or mobile number is required")
      
  });

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(forgotPassword(values)).unwrap();
      // Supabase emails a reset LINK directly — no OTP screen needed.
      // The link redirects back to /login/forgotPassword/otp-verify/update-password
      toast.success(result.message || "Password reset link sent! Check your email.");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen  -mt-5 flex items-center justify-center bg-gradient-to-br from-white via-[#f1fefc] to-[#d5f5f3] p-4">
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <Form className="w-full max-w-md bg-white p-6 sm:p-10 rounded-xl shadow-md">
            <div className="flex flex-col items-center mb-6">
              <img src={lock} alt="lock" className="w-24 sm:w-32 mb-4" />
              <h1 className="text-center text-lg sm:text-xl font-bold text-gray-700 uppercase px-2">
                Enter your registered email or mobile
              </h1>
            </div>

            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                     
                      <MdOutlineAlternateEmail />
                    
                  </InputAdornment>
                ),
              }}
              name="email"
              label="Email or Mobile"
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\S*$/.test(value)) {
                  setFieldValue("email",value);
                }
              }}
              value={values.email}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
              className="mb-4"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              endIcon={<AiOutlineSend />}
              style={{
                backgroundColor: "#0ABAB5",
                color: "white",
                marginBottom: "1rem",
                marginTop: "20px",
              }}
            >
              Send Reset Link
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              fullWidth
              startIcon={<CiLogin />}
              style={{ borderColor: "#0ABAB5", color: "#0ABAB5" }}
            >
              Back to Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
