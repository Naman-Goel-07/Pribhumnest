import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, updateRole } from "../../../redux/Slice/userSlice.js";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Users = ({ selectedType, filteredUsers }) => {

  const dispatch = useDispatch();

   const handleSelect = async (e, id) => {
    try {
      const role = e.target.value;
      const result = await dispatch(updateRole({ id, role })).unwrap();
      await dispatch(getAllUsers());

      toast.success(result.message || "Role Updated Successfully")
    } catch (error) {
      toast.error(error)
    }
  };

  useEffect(()=>{
    if(filteredUsers.length === 0){
      dispatch(getAllUsers())
    }
  },[dispatch])


  const handleDelete = async(id)=>{
try {
    const result = await dispatch(deleteUser(id)).unwrap()

    if(result){
      await dispatch(getAllUsers());
    }

    toast.success(result.message || "User Deleted Successfully")
  
} catch (error) {
  toast.error(error || "Delete User Failed")
}
    
}


  if (!filteredUsers || filteredUsers.length === 0) {
    return <div>No users found</div>;
  }



  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">User Id</th>
            <th className="py-3 px-4">Joined</th>
            <th className="py-3 px-4">Delete User</th>
            <th className="py-3 px-4">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers ? (
            filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 capitalize">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{user.role}</td>
                <td className="py-3 px-4 capitalize">{user.userId}</td>
                <td className="py-3 px-4">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB")
                    : "0"}
                </td>
              
                <td className="py-3 px-4">
                  <button onClick={()=>handleDelete(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer">
                    Delete
                  </button>
                </td>
                <td className="py-3 px-4">
                  <label htmlFor="role">Select Role:</label>
                  <select
                    id="role"
                    value={user.role}
                    onChange={(e) => handleSelect(e, user._id)}
                    name="changeRole"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="pg-owner">PG Owner</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (<tr>
            <td>Loading....</td>

          </tr>          )}

        </tbody>
      </table>
    </div>
  );
};

export default Users;
