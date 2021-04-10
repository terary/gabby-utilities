/*
 author t.chambers
*/
import { configureStore } from '@reduxjs/toolkit';
import queryNodeSlice from '../components/QueryTermBuilderRedux/slice';

const store = configureStore({
  reducer: {
    // didItems: didsReducer,
    queryNodes: queryNodeSlice.reducer,
  },
});
export default store;
