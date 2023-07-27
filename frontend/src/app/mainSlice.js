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

export const membersListSlice = createSlice({
  name: 'membersList',
  initialState: {
    value: [],
  },
  reducers: {
    setMembersList: (state, action) => {
      state.value = action.payload
    }
  },
})

export const subgroupsListSlice = createSlice({
  name: 'subgroupsList',
  initialState: {
    value: [],
  },
  reducers: {
    setSubgroupsList: (state, action) => {
      state.value = action.payload
    }
  },
})

export const dashboardDataSlice = createSlice({
  name: 'dashboardData',
  initialState: {
    value: {},
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.value = action.payload
    }
  },
})

export const updateDashboardSlice = createSlice({
  name: 'updateDashboard',
  initialState: {
    value: true,
  },
  reducers: {
    setUpdateDashboard: (state, action) => {
      state.value = action.payload
    }
  },
})


// Action creators are generated for each case reducer function
export const { setMemberUpdated } = memberSlice.actions
export const { setLoggedIn } = loggedInSlice.actions
export const { setMembersList } = membersListSlice.actions
export const { setSubgroupsList } = subgroupsListSlice.actions
export const { setDashboardData } = dashboardDataSlice.actions
export const { setUpdateDashboard } = updateDashboardSlice.actions

const memberReducer = memberSlice.reducer
const loggedInReducer = loggedInSlice.reducer
const membersListReducer = membersListSlice.reducer
const subgroupsListReducer = subgroupsListSlice.reducer
const dashboardDataReducer = dashboardDataSlice.reducer
const updateDashboardReducer = updateDashboardSlice.reducer

export { dashboardDataReducer, loggedInReducer, memberReducer, membersListReducer, subgroupsListReducer, updateDashboardReducer }

