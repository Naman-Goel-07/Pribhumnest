import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allProperty } from "../../../redux/Slice/propertySlice.js";
import Property from "../Admin/Property.jsx";
import { getAllUsers } from "../../../redux/Slice/userSlice.js";
import { FaSearch } from "react-icons/fa";
import Button from '@mui/material/Button';

const AdminDashboard = () => {
  const { property } = useSelector((state) => state.property);
  const { allUsers } = useSelector((state) => state.user);
  const [pgId,setPgId] = useState("")
  const [findedPg,setFindedPg] = useState("")


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allProperty());

    if (allUsers.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch]);


  const pgOwnersData = allUsers.map(users =>  users.role
  )

const allPg = property?.findProperty || [];




  const filteredPgOwner = pgOwnersData.filter(users => users === "pg-owner")

  const handleSubmit = (e)=>{e.preventDefault()
  const findPg = allPg.filter(id => id.pgId == pgId)
  setFindedPg(findPg)
  }

  const removeSearch = ()=>{
  setFindedPg([])
  setPgId("")
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen md:mb-4">
      <h1 className="text-3xl font-bold mb-6 text-[#17313E]">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold text-[#03A6A1]">{allUsers.length}</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg text-gray-500">PG Owners</h2>
          <p className="text-3xl font-bold text-[#03A6A1]">{filteredPgOwner.length}</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg text-gray-500">Total Properties</h2>
          <p className="text-3xl font-bold text-[#03A6A1]">
            {property.findProperty && property.findProperty.length}
          </p>
        </div>
      </div>
   <div className="flex flex-col md:flex gap-2">
       <h1 className="text-3xl font-bold mb-6 text-gray-800">All Properties</h1>
   <form
  className="flex flex-col sm:flex-row gap-2 w-full sm:items-center md:mb-4"
  onSubmit={handleSubmit}
>
  <div className="bg-white text-md font-normal p-2 rounded-md flex items-center justify-between gap-2 w-full sm:w-[20vw]">
    <input
      type="text"
      placeholder="Search Pg Id"
      className="outline-none w-full"
      onChange={(e) => setPgId(e.target.value)}
      value={pgId}
      name="pgId"
    />
    <FaSearch  />
  </div>

 <div className="flex gap-4 mb-4 md:mb-0">
   <Button
    type="submit"
    sx={{
      backgroundColor: "teal",
      color: "white",
      height: "39px",
      fontSize: "12px",
      width: "100%", 
      "@media (min-width: 640px)": { width: "auto" }, 
    }}
  >
    Search
  </Button>

  <Button
    onClick={removeSearch}
    sx={{
      backgroundColor: "#c183b7ff",
      color: "white",
      height: "39px",
      fontSize: "12px",
      width: "100%",
      "@media (min-width: 640px)": { width: "auto" },
    }}
  >
    Remove Search
  </Button>
 </div>
</form>

   </div>
      {
       findedPg && findedPg.length > 0 ? 
      <Property properties={findedPg} />
      :
      <Property properties={allPg} />

      }
    </div>
  );
};

export default AdminDashboard;
