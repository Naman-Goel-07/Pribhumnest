import { useEffect, useState } from "react";
import Users from "./Users";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../../redux/Slice/userSlice.js";
import { FaSearch } from "react-icons/fa";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.user);

  useEffect(() => {
    if (allUsers.length === 0 ) dispatch(getAllUsers());
  }, [dispatch]);

  const users = allUsers || [];

  const [selectedType, setSelectedType] = useState(null);
  const [searchId, setSearchId] = useState("");

  let filteredUsers = users;

  if (selectedType) {
    filteredUsers = filteredUsers.filter((user) => user.role === selectedType);
  }

if (searchId.trim() !== "") {
  filteredUsers = filteredUsers.filter(
    (user) =>
      user.userId &&
      user.userId.toLowerCase().includes(searchId.toLowerCase())
  );
}


  const removeSearch = () => {
    setSearchId("");
  };

  return (
    <div className="p-8 bg-slate-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full sm:w-[50%]">
        <div className="bg-white text-md font-normal p-2 rounded-md flex items-center justify-between gap-2 w-full">
          <input
            type="text"
            placeholder="Search User Id"
            className="outline-none w-full"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <FaSearch />
        </div>
        {searchId && (
          <button
            onClick={removeSearch}
            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow cursor-pointer hover:bg-orange-600"
          >
            Remove Search
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-6 w-full">
        <button
          onClick={() => setSelectedType("user")}
          className={`px-4 py-2 rounded-full font-semibold shadow cursor-pointer ${
            selectedType === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setSelectedType("pg-owner")}
          className={`px-4 py-2 rounded-full font-semibold shadow cursor-pointer ${
            selectedType === "pg-owner"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-green-100"
          }`}
        >
          PG Owners
        </button>
        <button
          onClick={() => setSelectedType(null)}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow hover:bg-red-600"
        >
          Clear Selection
        </button>
      </div>

      <Users selectedType={selectedType} filteredUsers={filteredUsers} />
    </div>
  );
};

export default ManageUsers;
