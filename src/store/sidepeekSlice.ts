import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type SidepeekState = {
  id: number;
  isOpen: boolean;
};

const initialState: SidepeekState = {
  id: 0,
  isOpen: false,
};

export const SidepeekSlice = createSlice({
  name: "sidepeek",
  initialState,
  reducers: {
    setData: (
      state,
      { payload }: PayloadAction<Omit<SidepeekState, "isOpen">>,
    ) => {
      state.id = payload.id;
      state.isOpen = true;
    },
    resetData: (state) => {
      state.id = 0;
      state.isOpen = false;
    },
  },
});

export const { setData, resetData } = SidepeekSlice.actions;
export const selectSidepeekData = (state: RootState) => state.sidepeek;
