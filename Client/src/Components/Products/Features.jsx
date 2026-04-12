import { GiTakeMyMoney, GiMeal, GiWifiRouter, GiHomeGarage } from "react-icons/gi";
import { FaUsers} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <GiTakeMyMoney className="text-5xl text-white" />,
      title: "No Brokerage",
      description:
        "Search 1000+ PG accommodations here without any brokerage or commission charge",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <GiMeal className="text-5xl text-white" />,
      title: "Homely Meals",
      description:
        "Nutritious home-style food options available in most of the PGs",
      color: "from-pink-500 to-red-500",
    },
    {
       icon: <FaUsers className="text-5xl text-white" />,
    title: "We Provide Same College Members in PG (Coming Soon)",
    description:
      "Enjoy staying with PG members from the same college for a comfortable environment",
    color: "from-green-500 to-emerald-600",
    },
    {
      icon: <GiHomeGarage className="text-5xl text-white" />,
      title: "Shifting PG (Coming Soon)",
      description:
        "If you are not comfortable in your old PG, you will have the facility to shift hassle-free",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="px-6 py-16 bg-gradient-to-b from-[[#f0fdfa] via-[#e0f7f5] to-white">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-extrabold text-gray-800">
          🌟 Why Choose <span className="text-teal-600">Us?</span>
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Discover the colorful benefits of staying with Pribhum Nest
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-lg p-6 flex flex-col items-center text-center 
              bg-gradient-to-br ${item.color} transform transition duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
          >
            {/* Icon Circle */}
            <div className="bg-white/20 backdrop-blur-md rounded-full p-6 mb-4 shadow-inner">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white drop-shadow mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-white/90 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
