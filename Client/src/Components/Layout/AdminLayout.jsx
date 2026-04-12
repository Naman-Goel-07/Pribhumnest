import React from "react";
import AdminSidebar from "../Admin/AdminSidebar";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="flex mx-[4vw] mt-15 md:mt-25">
        <AdminSidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
