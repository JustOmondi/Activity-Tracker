
import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './mainSlice';

export const REPORT_UPDATED = 'REPORT_UPDATED';

export default configureStore({
   reducer: {
      memberUpdated: memberReducer,
   }
})




