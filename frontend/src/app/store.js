
import memberReducer from './mainSlice';
import { configureStore } from '@reduxjs/toolkit'

export const REPORT_UPDATED = 'REPORT_UPDATED';

export default configureStore({
   reducer: {
    memberUpdated: memberReducer,
   }
})




