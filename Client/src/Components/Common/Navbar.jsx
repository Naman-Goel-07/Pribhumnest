import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAccess, logoutUser } from "../../../redux/Slice/userSlice";
import { toast } from "react-toastify";
import { Loader } from "../Utils/Loader";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, users, role } = useSelector((state) => state.user);
  const userRole = users?.role || role; 

  // useEffect(() => {
  //   dispatch(getAccess());
  // }, [dispatch]);
  

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { link: "/", type: "Home" },
    { link: "/about", type: "About Us" },
    { link: "/all-PG", type: "PG" },
    { link: "/contact", type: "Contact" },
    { link: "/services", type: "Services" }
  ];

  const adminNavItems = [
    { link: "/admin", type: "Dashboard" },
    { link: "/admin/add-Property", type: "Add Property" },
    { link: "/admin/manage-Users", type: "Manage Users" },
  ];

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      toast.success(result.message || "Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <TopBar />

      <nav
        className={`fixed z-50 w-full px-4 py-3 transition-all duration-300 flex justify-between items-center bg-white ${
          scrolled ? "top-0 shadow-md" : "top-[-4px]  md:top-10 shadow-sm"
        }`}
      >
        <NavLink
          to="/"
          className="w-[30vw] h-[5vh] md:w-[15vw] md:h-[8vh]"
          onClick={handleClose}
        >
          <img src={logo} alt="Logo" className="object-cover w-full h-full" />
        </NavLink>

        <ul className="hidden lg:flex lg:items-center lg:space-x-6">
          {navItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#03A6A1]"
                      : "text-gray-800 hover:text-[#03A6A1]"
                  }`
                }
              >
                {item.type}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-2">
          {!userRole && (
            <>
              <NavLink
                to="/login"
                className="py-2 px-6 bg-gray-100 text-sm font-semibold text-gray-800 rounded-xl hover:bg-gray-200"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/registerOtp"
                className="py-2 px-6 bg-[#03A6A1] text-sm font-semibold text-white rounded-xl hover:bg-teal-700"
              >
                Sign Up
              </NavLink>
            </>
          )}

          {userRole === "admin" && (
            <NavLink
              to="/admin"
              className="pt-1 cursor-pointer text-white bg-slate-800 px-2 rounded-md hover:bg-slate-700 hover:transition-transform ease-in-out duration-300"
            >
              <h1>Admin</h1>
            </NavLink>
          )}

          {userRole && (
            <>
              <button
                onClick={handleLogout}
                className="py-2 px-6 bg-gray-100 text-sm font-semibold text-gray-800 rounded-md cursor-pointer hover:bg-gray-200"
              >
                Logout
              </button>
              <NavLink to="/account" className="text-black cursor-pointer">
                <MdOutlineAccountCircle className="text-4xl" />
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button onClick={handleToggle}>
            <GiHamburgerMenu className="text-[#03A6A1]" size={24} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 bg-opacity-40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible " : "opacity-0 invisible"
        }`}
        onClick={handleClose}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white/90 backdrop-blur-lg shadow-xl transform transition-transform duration-300 flex flex-col justify-between pb-7 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-2">
          <div className="py-4 flex justify-between items-center border-b-2 border-slate-400">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <button
              onClick={handleClose}
              className="text-gray-700 font-bold hover:text-red-500"
            >
              ✕
            </button>
          </div>

          <ul className="p-6 space-y-3">
            {navItems.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.link}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `block text-gray-700 font-medium ${
                      isActive ? "text-[#03A6A1]" : "hover:text-[#03A6A1]"
                    }`
                  }
                >
                  {item.type}
                </NavLink>
              </li>
            ))}
          </ul>

          {userRole === "admin" && (
            <div className="text-white bg-[#17313E] px-4 py-2 rounded-lg mb-4">
              <h1 className="py-2">Admin Options</h1>
              {adminNavItems.map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-[#03A6A1]"
                          : "text-white hover:text-[#03A6A1]"
                      }`
                    }
                  >
                    {item.type}
                  </NavLink>
                </li>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="px-6 mb-4">
          {!userRole && (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/login"
                className="py-2 px-6 bg-gray-100 text-sm font-semibold shadow-lg text-gray-800 rounded-xl text-center hover:bg-gray-200"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="py-2 px-6 bg-[#03A6A1] text-sm font-semibold text-white shadow-xl text-center rounded-xl hover:bg-teal-700"
              >
                Sign Up
              </NavLink>
            </div>
          )}

          {userRole && (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/account"
                className="py-2 px-6 bg-slate-300 text-sm text-center font-semibold text-gray-800 rounded-md cursor-pointer hover:bg-gray-200"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="py-2 px-6 bg-gray-100 text-sm font-semibold text-gray-800 rounded-md cursor-pointer hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}

          <p className="text-xs text-center text-gray-600 mt-4">&copy; 2025</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
