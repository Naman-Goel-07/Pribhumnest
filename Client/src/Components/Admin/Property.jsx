import { useDispatch, useSelector } from "react-redux";
import {
  allProperty,
  deleteProperty,
} from "../../../redux/Slice/propertySlice";
import { LoaderAdmin } from "../Utils/Loader.jsx";
import { toast } from "react-toastify";

const Property = ({ properties }) => {
  const property = properties 
  const { loading } = useSelector((state) => state.property);
  const dispatch = useDispatch();

  const onDelete = async (id) => {
    try {
      const result = await dispatch(deleteProperty(id)).unwrap();
      toast.success(result.message)
      dispatch(allProperty());
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="">
      {loading ? (
        <LoaderAdmin />
      ) : (
        <div className="text-slate-900">
        

          {properties.length === 0 ? (
            <p className="text-blue-500 ">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {property &&
                property.map((item, index) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-800">
                        {item.Title}
                      </h2>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                      <p>
                        <span className="font-semibold capitalize">Created By:</span>{" "}
                        {item.createdBy || "Unknown"}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">Pg-Id:&nbsp;</span> 
                        {item.pgId}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() => onDelete(item._id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition cursor-pointer"
                      >
                        Delete Property
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Property;
