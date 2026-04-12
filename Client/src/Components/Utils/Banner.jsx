import React, { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import banner from "../../assets/BannerImg.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { allProperty } from "../../../redux/Slice/propertySlice";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const {property} = useSelector((state)=>state.property)
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("")
  const navigate = useNavigate()

  const dispatch = useDispatch();
  useEffect(()=>
  {
    if(property.length === 0) {
     dispatch(allProperty()); 
    }
  },[dispatch])

  const homefilteredData = property.findProperty && property.findProperty.filter((item) => {
    return item.Locality.toLowerCase() == city.toLowerCase() || item.Gender.toLowerCase() === gender.toLowerCase()
  })

  const handleFilter = () => {
    navigate("/all-PG", { state:{ homeFilteredData: homefilteredData } });
  }

  return (
    <div
      className="w-full h-[85vh] mt-10 bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl w-full mx-4 text-center text-white px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Discover Your Perfect PG Stay
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-300">
          Verified Listings · 0% Brokerage · Instant Booking
        </p>

        {/* Search Form - Styled like uploaded image */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex justify-between flex-col sm:flex-row items-center gap-4 w-full">
          <div className="relative w-full sm:w-[45%]">
            <MdLocationPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-lg" />
            <input
              type="text"
              placeholder="Enter city or locality"
              className="w-full py-2 pl-10 pr-3 rounded-lg bg-white/20 text-white placeholder-white/80 border border-white/30 outline-none focus:ring-2 focus:ring-[#0ABAB5]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-[30%]">
            <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-md" />
            <select className="w-full py-2 pl-10 pr-3 rounded-lg bg-white/20 text-white placeholder-white/80 border border-white/30 outline-none focus:ring-2 focus:ring-[#0ABAB5] cursor-pointer" value={gender} onChange={(e)=>setGender(e.target.value)}>
              <option className="text-black " >Select Gender</option>
              <option value="boys" className="text-black ">Boys</option>
              <option value="girls" className="text-black ">Girls</option>
              <option value="co-living" className="text-black ">Co-living</option>
            </select>
          </div>

          <button className="w-full sm:w-auto px-6 py-2 bg-[#0ABAB5] text-white font-semibold rounded-lg hover:bg-[#089b96] transition flex items-center gap-2 justify-center cursor-pointer" onClick={handleFilter}>
            <FaSearchLocation />
            Search PG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
