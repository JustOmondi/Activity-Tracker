
import { configureStore } from '@reduxjs/toolkit';
import { dashboardDataReducer, loggedInReducer, memberReducer, membersListReducer, subgroupsListReducer, updateDashboardReducer } from './mainSlice';

export const REPORT_UPDATED = 'REPORT_UPDATED';

export default configureStore({
   reducer: {
      memberUpdated: memberReducer,
      loggedIn: loggedInReducer,
      membersList: membersListReducer,
      subgroupsList: subgroupsListReducer,
      dashboardData: dashboardDataReducer,
      updateDashboard: updateDashboardReducer,
   }
})




