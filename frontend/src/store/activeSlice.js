import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name:"",
  avatar:""
}

export const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setName: (state,action) => {
       state.name = action.payload
     
    },

    setAvtar: (state, action) => {
        state.avatar = action.payload;
       
    },
  },
})

// Action creators are generated for each case reducer function
export const { setName,setAvtar } = activeSlice.actions

export default activeSlice.reducer