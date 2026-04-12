import { useEffect } from "react";
import Card from "./Card";
import {useSelector, useDispatch} from "react-redux"
import { allProperty } from "../../../redux/Slice/propertySlice.js";
import { Loader } from "../Utils/Loader.jsx";

const NewlyAdded = () => {
  

  const {property,loading} = useSelector(state=>state.property)

  const dispatch = useDispatch()
  useEffect(()=>{
    if(property.length === 0){
      dispatch(allProperty())
    }
  },[dispatch])

  if(loading) return <Loader/>
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 mt-10 xl:px-40">
      

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Newly Added
        </h1>
        <p className="text-gray-600 mt-2">
          Be Early, Book Smart – Check Out New PGs
        </p>
      </div>

      <div className="flex flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 gap-6 py-10 px-4">
        {property.findProperty && property.findProperty.map((products, idx) => {
          return (
            <div key={idx} className="min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[25vw]">
              <Card details={products} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewlyAdded;
