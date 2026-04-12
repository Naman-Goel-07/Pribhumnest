import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allProperty } from "../../../redux/Slice/propertySlice";
import { BiSearch } from "react-icons/bi";
import CardFilter from "../../Components/Utils/CardFilter.jsx";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AllPg = () => {
  const { property } = useSelector((state) => state.property);
  const [price, setPrice] = useState("15000");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();
  const homeFilteredData = location.state?.homeFilteredData || [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (property.length === 0) {
      dispatch(allProperty());
    }
  }, [dispatch, property.length]);

  const cityFormat = city.toLowerCase();

  const updatedData =
    property.findProperty &&
    property.findProperty.map((item) => ({
      ...item,
      Locality: item.Locality.toLowerCase(),
    }));

  const dataFilter = () => {
    if (!updatedData) return [];

    return updatedData.filter((item) => {
      const matchesGender = gender ? item.Gender === gender : true;
      const matchesCity = city ? item.Locality.includes(cityFormat) : true;
      const matchesPrice = price
        ? Number(item.Sharing.Single) <= Number(price)
        : true;

      return matchesGender && matchesCity && matchesPrice;
    });
  };

  const handleFilter = () => {
    setFilteredData(dataFilter());
  };

  return (
    <>
    <Helmet>
      <title>All Pg | Pribhumnest</title>
      <link rel="canonical" href="https://pribhumnest.in/all-PG" />
          <meta
          name="description"
          content="Pribhumnest provides secure and easy PG management. Property owners can add, update, and manage PGs, while tenants can browse verified listings effortlessly."
        />
    </Helmet>
    <div className="min-h-screen px-4 py-8 md:px-10 bg-[#f8fafc] mt-15">
      <h1 className="text-2xl font-bold text-center text-[#2C3E50] mb-6 ">
            Find Your Perfect PG
          </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[240px] bg-white shadow-md rounded-xl p-4 border border-gray-200 h-fit sticky top-20">
          <h2 className="text-lg font-semibold text-[#34495E] mb-3">
            Filters
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              City
            </label>
            <div className="flex items-center border border-slate-400 rounded-md px-2">
              <input
                type="text"
                value={city}
                placeholder="Enter City"
                className="w-full py-1 text-sm outline-none"
                onChange={(e) => setCity(e.target.value)}
              />
              <BiSearch className="text-lg text-slate-400" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Price (₹)
            </label>
            <input
              type="range"
              min="3000"
              max="15000"
              step="500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full accent-[#3498DB]"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>₹{price}</span>
              <span>₹15000</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Gender
            </label>
            <select
              className="w-full border rounded-md px-2 py-1 text-sm text-gray-600"
              onChange={(e) => setGender(e.target.value)}
              value={gender}
            >
              <option value="">All</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-Living">Co-Living</option>
            </select>
          </div>

          <button
            className="mt-2 w-full bg-[#3498DB] text-white py-1.5 rounded-md hover:bg-[#2980B9] transition duration-200 text-sm font-medium cursor-pointer"
            onClick={handleFilter}
          >
            Apply
          </button>
        </div>

        <div className="flex-1">
          
          <div className="">
            <CardFilter
              data={
                filteredData.length > 0
                  ? filteredData
                  : homeFilteredData.length > 0
                  ? homeFilteredData
                  : updatedData || []
              }
              fallback={updatedData || []}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AllPg;
