import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer from "../redux/Slice/userSlice.js"
import propertySliceReducer from "../redux/Slice/propertySlice.js"

export const store = configureStore({
    reducer: {
        user: userSliceReducer,
        property: propertySliceReducer,
    }
})