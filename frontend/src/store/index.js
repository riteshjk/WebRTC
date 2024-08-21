import { configureStore } from '@reduxjs/toolkit'
import auth from "./authSlice";
import active from "./activeSlice";

export const store = configureStore({
  reducer: {
    auth,
    active,
    devTools: process.env.NODE_ENV !== 'production', 
  },
})