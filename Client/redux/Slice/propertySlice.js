import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const addProperty = createAsyncThunk(
  "/add-property",
  async (formData, thunkApi) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/property/add-property`,
        formData, 
        { withCredentials:true,
          headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data.message || "Property Added Failed");
    }
  }
);

export const allProperty = createAsyncThunk("/allProperty",
  async (_,thunkApi)=>{
    try {
      const response = await axios.get(`${BASE_URL}/api/property`)
      return response.data
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message || "somtheing went wrong")
    }
  }
)

export const deleteProperty = createAsyncThunk("/deleteProperty",async(id,thunkApi)=>{
  try {
    const response = await axios.delete(`${BASE_URL}/api/property/delete-property/${id}`,{withCredentials:true})
    return response.data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data.message)
  }
})

export const propertyDetail = createAsyncThunk("/propertyDetail",async(id,thunkApi)=>{
  try {
    const res= await axios.get(`${BASE_URL}/api/property/details/${id}`)
    return res.data
  } catch (error) {
    return thunkApi.rejectWithValue({error})
  }
})

export const enquiry = createAsyncThunk(
  "/enquiry",
  async (data, thunkApi) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/property/enquiry`,
        data,
        { withCredentials: true } 
      );
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message)
      return thunkApi.rejectWithValue(error.response?.data.message || "Login First");
    }
  }
);


const initialState = {
  property: [],
  enquiryDetails:{},
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: "createSlice",
  initialState,
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(addProperty.pending, (state) => {
        (state.loading = true), (state.error = false);
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        (state.loading = false), (state.property = action.payload);
      })
      .addCase(addProperty.rejected, (state, action) => {
        (state.loading = true), 
        state.error = action.payload || action.error.message;
      }).addCase(allProperty.pending, (state) => {
        (state.loading = true), (state.error = false);
      })
      .addCase(allProperty.fulfilled, (state, action) => {
        (state.loading = false), (state.property = action.payload);
      })
      .addCase(allProperty.rejected, (state, action) => {
        (state.loading = true), 
        state.error = action.payload || action.error.message;
      }).addCase(deleteProperty.pending, (state) => {
        (state.loading = true), (state.error = false);
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        (state.loading = false), (state.property = action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        (state.loading = true), 
        state.error = action.payload || action.error.message;
      }).addCase(propertyDetail.pending, (state) => {
        (state.loading = true), (state.error = false);
      })
      .addCase(propertyDetail.fulfilled, (state, action) => {
        (state.loading = false), (state.property = action.payload);
      })
      .addCase(propertyDetail.rejected, (state, action) => {
        (state.loading = true), 
        state.error = action.payload || action.error.message;
      }).addCase(enquiry.pending, (state) => {
        (state.loading = true), (state.error = false);
      })
      .addCase(enquiry.fulfilled, (state, action) => {
        (state.loading = false), (state.enquiryDetails = action.payload);
      })
      .addCase(enquiry.rejected, (state, action) => {
        (state.loading = true), 
        state.error = action.payload || action.error.message;
      })
  },
});

export default propertySlice.reducer;
