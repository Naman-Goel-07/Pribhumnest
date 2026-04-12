import { FaHome, FaShieldAlt, FaCalendarCheck, FaMoneyBillWave } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductAddOwner = () => {
  const { users, isAuthenticated } = useSelector((state) => state.user);

  const steps = [
    {
      icon: <FaHome className="text-2xl text-white" />,
      title: "List Your Property",
      description: "Show your PG to the world in minutes ✨",
      bg: "from-pink-400 to-pink-500",
    },
    {
      icon: <FaShieldAlt className="text-2xl text-white" />,
      title: "Verify Property",
      description: "Trust & safety ensured 🛡️",
      bg: "from-purple-400 to-purple-500",
    },
    {
      icon: <FaCalendarCheck className="text-2xl text-white" />,
      title: "Confirm Bookings",
      description: "Easy chat & deals 📅",
      bg: "from-blue-400 to-blue-500",
    },
    {
      icon: <FaMoneyBillWave className="text-2xl text-white" />,
      title: "Get Paid",
      description: "Secure & quick payments 💸",
      bg: "from-green-400 to-green-500",
    },
  ];

  const navigate = useNavigate();

  const checkRole = () => {
    if (users?.role === "admin" || users?.role === "pg-owner") {
      navigate("/add-property");
    } else if (!isAuthenticated) {
      toast.error("Please Contact Admin to Continue");
    }
  };

  return (
    <section className="relative w-full py-20 bg-gradient-to-t from-[#e0f7f5] via-white to-teal-50 overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply opacity-30 animate-bounce"></div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 drop-shadow-sm">
          🎉 Are you a <span className="text-teal-600">Property Owner?</span>
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Join{" "}
          <span className="text-pink-500 font-semibold">Pribhum Nest</span> and
          start earning 💰 by listing your PG today!
        </p>

        <div className="mb-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 hover:scale-105"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${step.bg} rounded-full mx-auto mb-4 shadow-md animate-bounce`}
              >
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={checkRole}
          className="px-10 py-3 bg-gradient-to-r from-pink-500 via-teal-500 to-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
        >
          🌟 Add Your Property
        </button>
      </div>
    </section>
  );
};

export default ProductAddOwner;
