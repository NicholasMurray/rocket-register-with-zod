// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { rocketApi } from './rocketApi';
import { rocketSlice } from './rocketSlice';

export const store = configureStore({
  reducer: {
    [rocketApi.reducerPath]: rocketApi.reducer,
    rocket: rocketSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rocketApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
