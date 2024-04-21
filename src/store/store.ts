import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
// import { TaskSlice } from "./taskSlice";
import { api } from "./api";

export const store = configureStore({
  reducer: {
    // tasks: TaskSlice.reducer,
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
