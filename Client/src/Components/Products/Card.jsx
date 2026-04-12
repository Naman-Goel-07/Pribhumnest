import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineFoodBank, MdOutlineBedroomParent } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import noImg from "../../assets/NoImage.png"

const Card = (products ) => {
  const navigate = useNavigate();

  const product = products.details

  const URL = import.meta.env.VITE_BACKEND_URL
  
  const imagePath =
    product.Images && product.Images.length > 0
      ? `${URL}/${product.Images[0].replace(/\\/g, "/")}`
      : noImg;

  const viewFullDetails = (id) => {
    navigate(`/pg-details/${id}`);
  };

  return (

    <div className="w-full sm:w-[300px] md:w-[360px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.20)] overflow-hidden group bg-white relative transition transform hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden">
        <img
          src={imagePath}
          alt={product.Title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />

        {/* Gender badge */}
        <span
          className={`absolute top-3 left-3 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full 
            ${
              product.Gender === "Boys"
                ? "bg-gradient-to-r from-blue-400 to-blue-600"
                : product.Gender === "Girls"
                ? "bg-gradient-to-r from-pink-400 to-pink-600"
                : "bg-gradient-to-r from-yellow-400 to-yellow-600"
            } text-white shadow-md`}
        >
          {product.Gender}
        </span>

        {/* Price badge */}
        <span className="absolute bottom-3 right-3 text-xs sm:text-sm md:text-base font-semibold px-3 py-1 rounded-md bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-md">
          ₹{product.Sharing?.Single}/mo
        </span>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-[#0ABAB5] transition">
          {product.Title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
          <IoLocationSharp className="text-[#0ABAB5]" />
          {product.Locality}
        </p>

        {/* Sharing + Price */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700 mt-2 sm:mt-3">
          <p className="flex items-center gap-1">
            <MdOutlineBedroomParent className="text-[#0ABAB5]" />
            Rooms Available
          </p>
          <p className="flex items-center gap-1">
            <GiMoneyStack className="text-[#0ABAB5]" />₹
            {product.Sharing?.Single} onwards
          </p>

          {product.CommonFacilities?.FoodIncluded && (
            <p className="flex items-center gap-1 text-green-600 font-medium col-span-2">
              <MdOutlineFoodBank className="text-[#0ABAB5]" />
              Food Included
            </p>
          )}
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
          {product.CommonFacilities &&
            Object.entries(product.CommonFacilities).map(([key, value]) => {
              if (!value) return null;
              const labels = {
                WiFi: "WiFi",
                Mattress: "Mattress",
                FirstAidKit: "First Aid Kit",
              };
              return (
                labels[key] && (
                  <span
                    key={key}
                    className="text-[10px] sm:text-xs bg-gray-100 px-2 py-1 rounded-full shadow-sm text-gray-700 border hover:bg-[#0ABAB5] hover:text-white transition"
                  >
                    {labels[key]}
                  </span>
                )
              );
            })}
        </div>
        
        {/* Button */}
        <div className="mt-3 sm:mt-4">
          <div
            onClick={() => viewFullDetails(product._id)}
            className="block w-full text-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:from-teal-500 hover:to-green-600 transition transform hover:scale-105 shadow-md text-sm sm:text-base cursor-pointer"
          >
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
