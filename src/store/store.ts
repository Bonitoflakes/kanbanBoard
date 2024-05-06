import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { api } from "./api";
import { SidepeekSlice } from "./sidepeekSlice";

export const store = configureStore({
  reducer: {
    sidepeek: SidepeekSlice.reducer,
    [api.reducerPath]: api.reducer,
  },

  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
