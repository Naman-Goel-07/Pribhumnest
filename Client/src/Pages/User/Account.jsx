import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../redux/Slice/userSlice";

const Account = () => {

  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const handleLogout = async() => {
    await dispatch(logoutUser());
    navigate("/login");
  };


  const {users}= useSelector(state => state.user)
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 ">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#03A6A1]">👤 User Profile</h2>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, {users.name}!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem icon={<FaUser />} label="Name" value={users.name} />
          <InfoItem icon={<FaEnvelope />} label="Email" value={users.email} />
          <InfoItem icon={<FaPhone />} label="Phone" value={users.contact} />
          <InfoItem icon={<FaCalendarAlt />} label="Joined" value={new Date(users.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })} />
        </div>

        <div className="text-center mt-8">
            <button
                onClick={handleLogout}
                className="py-1 px-6 bg-[#03A6A1]  text-md font-semibold text-white rounded-md cursor-pointer hover:bg-gray-200"
              >
                Logout
              </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="text-[#03A6A1] mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Account;
