import { createSlice } from '@reduxjs/toolkit'

export const memberSlice = createSlice({
    name: 'memberUpdated',
    initialState: {
      value: false,
    },
    reducers: {
      setMemberUpdated: (state, action) => {
        state.value = action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setMemberUpdated } = memberSlice.actions
  
  export default memberSlice.reducer