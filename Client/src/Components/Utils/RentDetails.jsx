import React from "react";
import { MdOutlinePerson, MdPersonAddAlt } from "react-icons/md";
import { FaRupeeSign, FaPhoneAlt, FaHandshake } from "react-icons/fa";

const RentDetails = ({sharingRent}) => {

const rent = Object.entries(sharingRent || {}).map(([type, value]) => ({
  type,
  value,
}));

  return (
    <div className="p-6 bg-gradient-to-br from-teal-100 to-green-50 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full max-w-xl mx-auto mt-10 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-teal-800 mb-6 border-b pb-3 border-teal-300">
        Rent Options
      </h1>

      <div className="space-y-4">
        {rent.map((val, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.015]"
          >
            <div className="flex items-center gap-3 text-gray-700 font-semibold text-lg">
              {val.type} Sharing
            </div>

              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-full flex items-center gap-1 text-base shadow-md">
              <FaRupeeSign />
              {val.value}
              <span className="text-sm font-light">/mo</span>
            </button>
          </div>
        ))}
      </div>

      {/* Call-to-Actions */}
      <div className="mt-8 space-y-4">

            <a href="tel:+917303847437">
        <button className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition cursor-pointer">
          <FaPhoneAlt className="text-lg" />
          Call Now
        </button>
            </a>

      </div>


      {/* Optional animation style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default RentDetails;
