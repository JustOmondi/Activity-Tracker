
import { configureStore } from '@reduxjs/toolkit';
import { loggedInReducer, memberReducer } from './mainSlice';

export const REPORT_UPDATED = 'REPORT_UPDATED';

export default configureStore({
   reducer: {
      memberUpdated: memberReducer,
      loggedIn: loggedInReducer
   }
})




