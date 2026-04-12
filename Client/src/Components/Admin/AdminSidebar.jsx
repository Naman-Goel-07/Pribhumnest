import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaPlusCircle, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/Slice/userSlice";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const {users}= useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleLogout = async() => {
      try {
      const result = await dispatch(logoutUser());
      toast.success(result.message || "Logout Successfully")
      navigate("/login");
      } catch (error) {
        toast.error(error)
      }
      
    };
  return (
    <div className="h-screen w-64 mb-10 bg-gradient-to-b from-[#17313E] to-[#0f2027] text-white flex flex-col shadow-xl hidden md:block">
      <div className="flex items-center gap-3 p-5 border-b border-white/20">
        
        <div>
          <h2 className="text-lg font-semibold capitalize">Admin,&nbsp;{users && users.name}</h2>
          <a
            href="#"
            className="text-xs text-gray-300 hover:underline"
          >
            View Profile
          </a>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center  gap-3 px-4 py-2 rounded-xl transition-all duration-300 
            ${
              isActive
                ? "bg-white text-[#17313E] shadow-md"
                : "hover:bg-white/10"
            }`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="add-Property"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 
            ${
              isActive
                ? "bg-white text-[#17313E] shadow-md"
                : "hover:bg-white/10"
            }`
          }
        >
          <FaPlusCircle />
          <span>Add Property</span>
        </NavLink>

        <NavLink
          to="manage-Users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 
            ${
              isActive
                ? "bg-white text-[#17313E] shadow-md"
                : "hover:bg-white/10"
            }`
          }
        >
          <FaUsers />
          <span>Manage Users</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
