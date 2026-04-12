import { useEffect, useState } from "react";
import { FaBolt, FaRegClock, FaPlus } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import Aminites from "../../Components/Utils/Aminites";
import RentDetails from "../../Components/Utils/RentDetails";
import BookingForm from "../../Components/Utils/BookingForm";
import { IoChevronBack , IoChevronForward } from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux"
import { allProperty } from "../../../redux/Slice/propertySlice";
import noImg from "../../assets/NoImage.png"
import { Helmet } from "react-helmet-async";


const PgDetails = () => {

  const [img, setImg] = useState(0);
  const [focusImg , setFocusImg] = useState(0)
  const [isFocus, setIsFocus] = useState(true);
 
  const {property} = useSelector(state=>state.property)
  const dispatch = useDispatch()

  const id = location.pathname.replace("pg-details", "").replace(/\//g, "")

    const baseUrl = "https://www.pribhumnest.in";
  const canonicalUrl = `${baseUrl}${location.pathname}`;



  useEffect(()=>{
    if(property.length === 0){
      dispatch(allProperty())
    }
  },[])
  

  const filterDetails = property.findProperty && property.findProperty.filter(item =>
  item._id === id
  ).shift()

   const aminites = filterDetails?.CommonFacilities
    ? Object.entries(filterDetails.CommonFacilities)
        .filter(([key, val]) => val === true).map(([key]) => key)
    : [];
  
   const safetyData = filterDetails?.Safety
    ? Object.entries(filterDetails.Safety)
        .filter(([key, val]) => val === true).map(([key]) => key)
    : [];

   const bills = filterDetails?.BillsIncluded
    ? Object.entries(filterDetails.BillsIncluded)
        .filter(([key, val]) => val === true).map(([key]) => key)
    : [];



  const URL = import.meta.env.VITE_BACKEND_URL

  const images =
  filterDetails?.Images?.map((item) => {
    if (item && item.length > 0) {
      return `${URL}/${item.replace(/\\/g, "/")}`;
    } else {
      return noImg;
    }
  }) || [noImg]; 
  
  const sharing = filterDetails && filterDetails.Sharing
  const extraCharges = [
    {
      icon: <FaRegClock className="text-indigo-500" />,
      type: "Lock-in Period",
      value: `${filterDetails?.LockInPeriod} Months`,
    },
    {
      icon: <FaBolt className="text-yellow-500" />,
      type: "Electricity Bill",
      value: "₹12 / Unit",
    },
  ];


  useEffect(() => {
  const interval = setInterval(() => {
    setImg((prev) => (prev + 1) % images.length);
  }, 5000);
    return () => clearInterval(interval);
  }, [images]);


  const increment = ()=>{
      if(!images.length) return

    setImg(
      prev=> (prev + 1) % images.length
    )
  }
  
  const decrement = ()=>{
      if(!images.length) return
    setImg(
      prev => 
        prev === 0 ? images.length-1 : prev-1
    )
  }

  const handleFocus = (idx)=>{
    setIsFocus(!isFocus)
    setFocusImg(idx)
  }

  return (
<>
<Helmet>
  <title>Pg for Rent in {filterDetails?.Locality}</title>
  <link rel="canonical" href={canonicalUrl} />
  <meta
    name="description"
    content={`Find the best PGs for rent in ${filterDetails?.Locality}. Affordable, verified, and comfortable stays at Pribhumnest.`}
  />
</Helmet>
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#e8f5e9] mt-13 py-3 px-3">
  <div className="max-w-[1300px] px-2 md:px-10  mx-auto grid lg:grid-cols-3 gap-10 bg-white bg-opacity-80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl animate-fade-in">

    <div className="lg:col-span-2 space-y-6">

      <div className="rounded-xl overflow-hidden shadow-lg animate-slide-in flex items-center relative">
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 shadow-xl border border-slate-200 rounded-full z-10 bg-white"
          onClick={decrement}
        >
          <IoChevronBack className="text-3xl"/>
        </button>

        <img
          src={images && images[img]}
          alt="PG"
          className="w-full h-[400px] object-cover rounded-xl transition-all duration-700 overflow-hidden"
        />

        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 shadow-xl border border-slate-200 rounded-full z-10 bg-white"
          onClick={increment}
        >
          <IoChevronForward className="text-3xl"/>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {images && images.map((item, idx) => (
          <div key={idx} className="flex-shrink-0 rounded-xl h-[14vh]">
            <img
              src={item}
              alt=""
              onClick={() => handleFocus(idx)}
              className="w-[100px] h-[13vh] shadow-lg rounded-md cursor-pointer object-cover hover:opacity-50 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            PG for Rent in {filterDetails?.Locality}
          </h2>
          <div className="flex items-center text-green-700 text-xl sm:text-2xl font-bold mt-2 sm:mt-0">
            <span className="text-slate-600 font-normal">Starts From &nbsp;</span>
            ₹{filterDetails?.Sharing?.Single}
            <span className="text-sm text-gray-600 font-medium ml-1">/ Month</span>
          </div>
        </div>
        <p className="text-gray-600 flex items-center gap-2">
          <FaMapLocationDot className="text-red-400" />
          {filterDetails?.Locality}, {filterDetails?.City}
        </p>
      </div>

      <div className="bg-[#d1f2eb] p-4 sm:p-6 rounded-xl shadow-inner">
        <h3 className="text-xl sm:text-2xl font-semibold text-teal-800 mb-3 border-b pb-2 border-teal-300">
          Amenities
        </h3>
        <Aminites data={aminites} safety={safetyData} bills={bills}/>
      </div>

      <div className="bg-[#fffde7] p-4 sm:p-6 rounded-xl shadow-inner">
        <h3 className="text-xl sm:text-2xl font-semibold text-yellow-800 mb-4 border-b pb-2 border-yellow-300">
          Extra Charges
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {extraCharges.map((item, index) => (
            <div key={index} className="flex items-center gap-4 bg-white p-3 sm:p-4 rounded-lg shadow-md">
              {item.icon}
              <div>
                <p className="font-semibold text-gray-700">{item.type}</p>
                <p className="text-sm text-gray-500">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28 relative">
      <RentDetails  sharingRent={sharing}/>
      <BookingForm />
    </div>

  </div>

  {!isFocus && (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="self-end cursor-pointer" onClick={() => setIsFocus(true)}>
        <FaPlus className="text-white text-4xl rotate-45"/>
      </div>
      <img
        src={images && images[focusImg]}
        alt=""
        className="max-w-full max-h-[80vh] rounded-lg border p-2 border-white"
      />
    </div>
  )}
</div>

</>
  );
};

export default PgDetails;
