import { createSlice } from '@reduxjs/toolkit'

export const memberSlice = createSlice({
  name: 'memberUpdated',
  initialState: {
    value: false,
  },
  reducers: {
    setMemberUpdated: (state, action) => {
      state.value = action.payload
    }
  }
})

export const loggedInSlice = createSlice({
  name: 'loggedIn',
  initialState: {
    value: false,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMemberUpdated } = memberSlice.actions
export const { setLoggedIn } = loggedInSlice.actions

const memberReducer = memberSlice.reducer
const loggedInReducer = loggedInSlice.reducer

export { loggedInReducer, memberReducer }
