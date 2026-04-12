import * as yup from "yup";
import { Formik, Form, useFormikContext } from "formik";
import {useDispatch, useSelector} from "react-redux"
import { addProperty } from "../../../redux/Slice/propertySlice.js";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AddProperty = () => {


  const pathname = useLocation().pathname;
  const asset = {
    CommonFacilities: [
      "WiFi",
      "Mattress",
      "Fan",
      "Cleaning",
      "FirstAidKit",
      "AttachedWashroom",
      "WesternWashroom",
      "Almirah",
      "ParkingFacility",
      "Fridge",
      "Laundry",
      "WashingMachine",
      "DeskChair",
      "Geyser",
      "FoodIncluded",
      "Single-Sharing",
      "Double-Sharing",
      "Triple-Sharing",
    ],
    Safety: ["CCTV", "Guard"],
    BillsIncluded: ["Water", "Gas"],
    Sharing: ["Single", "Double", "Triple"],
  };

  const initialState = {
    ...Object.fromEntries(
      asset.CommonFacilities.map((item, index) => [item, false])
    ),
    ...Object.fromEntries(asset.Safety.map((item, index) => [item, false])),
    ...Object.fromEntries(
      asset.BillsIncluded.map((item, index) => [item, false])
    ),
    ...Object.fromEntries(asset.Sharing.map((item, index) => [item, " "])),
    Title: "",
    Images: [],
    Locality: "",
    City: "",
    Gender: "",
    LockInPeriod: "",
    Electricity: "",
  };

  const validationSchema = yup.object({
    ...Object.fromEntries(
      asset.CommonFacilities.map((item) => [item, yup.boolean()])
    ),
    ...Object.fromEntries(asset.Safety.map((item) => [item, yup.boolean()])),
    ...Object.fromEntries(
      asset.BillsIncluded.map((item) => [item, yup.boolean()])
    ),
    ...Object.fromEntries(asset.Sharing.map((item) => [item, yup.string()])),
    LockInPeriod: yup.string().required("Enter lock-In-Period"),
    Electricity: yup.string().required("Enter Electricity Unit"),
    Title: yup.string().required("Please Enter Title of Property"),
    Images: yup.array(),
    Locality: yup.string().required("Please Enter Locality"),
    City: yup.string().required("Please Enter City"),
    Gender: yup.string().required("Please Select Gender"),
  });

  const {property,loading,error} = useSelector(state=>state.property)
  const dispatch = useDispatch()


  const handleSubmit = async (values, { resetForm }) => {
  const formData = new FormData();

  formData.append("Title", values.Title);
  formData.append("Locality", values.Locality);
  formData.append("City", values.City);
  formData.append("Gender", values.Gender);
  formData.append("LockInPeriod", values.LockInPeriod);
  formData.append("Electricity", values.Electricity);

  formData.append(
    "Sharing",
    JSON.stringify({
      Single: values.Single,
      Double: values.Double,
      Triple: values.Triple,
    })
  );

  formData.append(
    "CommonFacilities",
    JSON.stringify(
      asset.CommonFacilities.reduce((acc, item) => {
        acc[item] = values[item];
        return acc;
      }, {})
    )
  );

  formData.append(
    "Safety",
    JSON.stringify(
      asset.Safety.reduce((acc, item) => {
        acc[item] = values[item];
        return acc;
      }, {})
    )
  );

  formData.append(
    "BillsIncluded",
    JSON.stringify(
      asset.BillsIncluded.reduce((acc, item) => {
        acc[item] = values[item];
        return acc;
      }, {})
    )
  );

  values.Images.forEach((file) => {
    formData.append("Images", file);
  });

    try {
      const result = await dispatch(addProperty(formData))
      toast.success(result.message || "Property Added Successfully")
      resetForm({ values: initialState });
    } catch (error) {
      toast.error(error)
    }
  };




  return (
    <div
  className={`min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 
  ${pathname === "/admin/add-Property" ? "mt-0 bg-slate-100 mb-5" : "mt-14 md:mt-20"}`}
>
      <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#03A6A1] mb-6">
        Add New Property
        </h2>
        <Formik
          initialValues={initialState}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({
            errors,
            touched,
            values,
            setFieldValue,
            handleChange,
            handleBlur,
          }) => {
            return (
              <Form className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select 4 Images
                  </label>
                  <input
                    name="Images"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length !== 4) {
                        alert("Please select exactly 4 images");

                        e.target.value = null;
                        return;
                      }
                      setFieldValue("Images", files);
                    }}
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03A6A1]"
                  />
                </div>

                <Input label="Property Title" name="Title" />
                <Input label="Locality" name="Locality" />
                <Input label="City" name="City" />
                <Select
                  label="For (Gender)"
                  options={["Boys", "Girls", "Co-Living"]}
                  name="Gender"
                />

                <Input label="Single Sharing" type="text" name="Single" onlyNumber/>
                <Input label="Double Sharing" type="text" name="Double"  onlyNumber/>
                <Input label="Triple Sharing" type="text" name="Triple" onlyNumber/>

                <div className="sm:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Common Facilities
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {asset.CommonFacilities.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item}
                          checked={values[item]}
                          onChange={(e) =>
                            setFieldValue(item, e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Safety</h3>
                  <div className="flex flex-wrap gap-4">
                    {asset.Safety.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item}
                          checked={values[item]}
                          onChange={(e) =>
                            setFieldValue(item, e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Bills Included</h3>
                  <div className="flex flex-wrap gap-4">
                    {asset.BillsIncluded.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={item}
                          checked={values[item]}
                          onChange={(e) =>
                            setFieldValue(item, e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>


                <Input label="Lock-in-period(in Months)" name="LockInPeriod" type="text" onlyNumber/>
                <Input
                  label="Electricity (₹ per unit price)"
                  name="Electricity"
                  type="text"
                  onlyNumber
                />

                <div className="sm:col-span-2 text-center mt-4">
                  <button
                    type="submit"
                    className="bg-[#03A6A1] hover:bg-teal-700 text-white px-6 py-2 rounded-full font-semibold transition duration-300 cursor-pointer"
                  >
                    Submit Property
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", fullWidth , id,onlyNumber = false }) => {
  const { values, setFieldValue, handleBlur, touched, errors } = useFormikContext();

  const handleChange = (e) => {
    let val = e.target.value;
    if (onlyNumber) {
      val = val.replace(/[^0-9]/g, ''); 
    }
    setFieldValue(name, val);
  };
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        id={id}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03A6A1]"
      />
      {touched[name] && errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );
};

const Select = ({ label, name, options }) => {
  const { values, handleChange, handleBlur, errors, touched } =
    useFormikContext();
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03A6A1]"
      >
        <option value="">Select</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {touched[name] && errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );
};

export default AddProperty;
