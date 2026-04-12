import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { enquiry } from '../../../redux/Slice/propertySlice';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


const BookingForm = () => {

  const [data,setData] = useState({
    fullName:"",
    contact:"",
    days:"Within 7 Days"
  })

  const handleInput = (e)=>{
    const {value,name} = e.target
    setData((prev)=>({
      ...prev, [name]:value
    }
    ))
  }

  const dispatch = useDispatch()

const handleSubmit = async(e)=>{
  e.preventDefault();
  try {
    const result = await dispatch(enquiry(data)); 
    toast.success(result.message)
    setData({ fullName: "", contact: "", days: "" }); 
  } catch (error) {
    toast.error(error)
  }
}



  return (
    <div className="lg:col-span-1 animate-fade-in space-y-6">

      <div className="mt-6 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] rounded-xl p-6">

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A6A1]"
              onChange={handleInput}
              name='fullName'
              value={data.fullName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A6A1]"
              onChange={handleInput}
              name='contact'
              value={data.contact}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">How soon do you plan to move?</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" className="accent-[#03A6A1]" 
                 onChange={handleInput}
                 name='days'
                 value="Within 7 Days"
                />
                <span>Within 7 Days</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="radio"  className="accent-[#03A6A1]" 
                 onChange={handleInput}
                 name='days'
                 value="7 Days - 14 Days"
                />
                <span>7 Days - 14 Days</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" className="accent-[#03A6A1]" 
                 onChange={handleInput}
                 name='days'
                 value="More than 14 Days"
                />
                <span>More than 14 Days</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#03A6A1] text-white py-2 rounded-lg hover:bg-[#02807D] transition-colors duration-300 font-semibold cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
