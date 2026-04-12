import React from "react";
import {
  FaBed, FaCar, FaFan, FaShower, FaTv, FaUserShield, FaUtensils, FaWifi,
} from "react-icons/fa";
import {
  MdOutlineCleaningServices, MdOutlineLocalLaundryService, MdLocalLaundryService, MdBathroom,
} from "react-icons/md";
import { IoWaterOutline } from "react-icons/io5";
import { GiGasStove, GiWashingMachine, GiLockedChest } from "react-icons/gi";
import { PiDeskDuotone } from "react-icons/pi";
import { BiCctv, BiFirstAid } from "react-icons/bi";
import { BsFillHouseLockFill, BsFillHouseGearFill } from "react-icons/bs";
import { RiFridgeLine } from "react-icons/ri";

const Aminites = ({data, safety , bills}) => {
  const icons = {
    WiFi: <FaWifi />, "Mattress": <FaBed />, Meals: <FaUtensils />, Shower: <FaShower />,
    Fan: <FaFan />, TV: <FaTv />, "ParkingFacility": <FaCar />, "Security Guard": <FaUserShield />,
    Cleaning: <MdOutlineCleaningServices />, Laundry: <MdOutlineLocalLaundryService />,
    "Ro Water": <IoWaterOutline />, Gas: <GiGasStove />, "DeskChair": <PiDeskDuotone />,
    "FirstAidKit": <BiFirstAid />, "AttachedWashroom": <MdBathroom />,
    "Western Washroom": <BsFillHouseLockFill />, Almirah: <GiLockedChest />, Fridge: <RiFridgeLine />,
    Laundary: <MdLocalLaundryService />, "WashingMachine": <GiWashingMachine />,
    Gyser: <BsFillHouseGearFill />, CCTV: <BiCctv />, Guard: <FaUserShield />,
    Water: <IoWaterOutline />,
  };


  const allowedCommonFacilities = [
  "WiFi", "Mattress", "Fan", "Cleaning", "FirstAidKit", "AttachedWashroom",
  "WesternWashroom", "Almirah", "ParkingFacility", "Fridge", "Laundary",
  "WashingMachine", "DeskChair", "Gyser"];
  const allowedSafety = ["CCTV","Guard"]
  const allowedBills = ["Water","Gas"]

  const commonFacilities = data.filter(item => allowedCommonFacilities.includes(item))
  const Safety = safety.filter(item => allowedSafety.includes(item))

  const BillsIncluded = bills.filter(item => allowedBills.includes(item))

  const renderAmenityList = (title, list, color) => (
    <div className="mb-6">
      <h2 className={`text-sm md:text-lg font-bold mb-4 px-3 py-1 rounded-full w-fit ${color} text-white`}>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-gradient-to-br from-white to-gray-100 p-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="text-xl text-teal-600">{icons[item]}</div>
            <p className="text-[10px] md:text-sm font-medium">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-4 space-y-8">
      {renderAmenityList("Common Facilities", commonFacilities, "bg-[#4D77FF]")}
      {renderAmenityList("Safety & Security", Safety, "bg-[#FF90BB]")}
      {renderAmenityList("Bills Included", BillsIncluded, "bg-[#6962AD]")}
    </div>
  );
};

export default Aminites;
