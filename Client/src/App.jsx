import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import UserLayout from "./Components/Layout/UserLayout.jsx";
import AdminLayout from "./Components/Layout/AdminLayout.jsx";

// User Pages
import Home from "./Pages/Home/Home.jsx";
import PgDetails from "./Pages/Home/PgDetails.jsx";
import ContactForm from "./Pages/Home/ContactForm.jsx";
import About from "./Pages/Home/About.jsx";
import Login from "./Pages/Home/Login.jsx";
import Register from "./Pages/Home/Register.jsx";
import Account from "./Pages/User/Account.jsx";
import AddProperty from "./Pages/Home/AddProperty.jsx";
import ForgotPassword from "./Pages/Home/ForgotPassword.jsx";

// Admin Pages
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import ManageUsers from "./Components/Admin/ManageUsers.jsx";
import AllPg from "./Pages/Home/AllPg.jsx";
import UpdatePassword from "./Pages/Home/UpdatePassword.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protected from "./Pages/Admin/Protected.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { getAccess, setAuthState } from "../redux/Slice/userSlice.js";
import { listenToAuthChanges } from "./services/authService.js";
import LoginRedirect from "./Pages/Admin/LoginRedirect.jsx";
import { Loader } from "./Components/Utils/Loader.jsx";
import AuthRedirect from "./Components/Utils/AuthRedirect.jsx";
import PrivacyPolicy from "./Pages/Home/PrivacyPolicy.jsx";
import TermsAndConditions from "./Pages/Home/Term&Conditions.jsx";
import Services from "./Pages/Home/Services.jsx";
import EmailVerificationPending from "./Pages/Home/EmailVerificationPending.jsx";


const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const initialLoadRef = useRef(false);

  useEffect(() => {
    window.onpopstate = function () {
      window.location.reload(true);
      window.location.href = "/all-PG";
    };
  }, []);

  useEffect(() => {
    // 1. Strict Mode Guard: Ensure getAccess runs ONLY ONCE during initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      dispatch(getAccess()).catch(() => {});
    }

    // 2. Subscribe to Supabase real-time auth changes
    // We strictly only handle SIGNED_OUT to avoid duplicate `fetchProfile` during login.
    // The `userLogin` thunk handles the active login state.
    // The initial `getAccess()` handle cold-start recovery.
    const { data: { subscription } } = listenToAuthChanges(async (event, session) => {
      if (event === "SIGNED_OUT") {
        dispatch(setAuthState({
          isAuthenticated: false,
          user: null,
          profile: null,
        }));
      }
    });

    // 3. Cleanup the listener when App unmounts
    return () => subscription.unsubscribe();
  }, [dispatch]);



  if (loading) {
    return  <Loader/>
  }


  return (
    <>
     <AuthRedirect isAuthenticated={isAuthenticated}/>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="pg-details/:id" element={<PgDetails />} />
          <Route path="contact" element={<ContactForm />} />
          <Route path="about" element={<About />} />
          <Route path="privacyPolicy" element={<PrivacyPolicy/>} />
          <Route path="termConditions" element={<TermsAndConditions/>} />
          <Route path="/services" element={<Services/>}/>
          <Route
            path="login"
            element={<LoginRedirect isAuthenticated={isAuthenticated} />}
          />
          <Route path="login/forgotPassword" element={<ForgotPassword />} />
          <Route
            path="login/forgotPassword/otp-verify/update-password"
            element={<UpdatePassword />}
          />
          {/* Clean redirect target for Supabase password reset link */}
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="registerOtp" element={<EmailVerificationPending />} />
          <Route path="register" element={<Register />} />
          <Route path="account" element={<Account />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="all-PG" element={<AllPg />} />
          <Route path="verify-email" element={<EmailVerificationPending />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<Protected />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="manage-Users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  );
};

export default App;
