import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_CARDS, DEFAULT_COLUMNS } from "./mock";
import { RootState } from "./store";

export type Task = {
  id: string;
  title: string;
  column: string;
};

export const TaskAdapter = createEntityAdapter<Task>({
  //   sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const TaskSlice = createSlice({
  name: "tasks",
  initialState: TaskAdapter.getInitialState(
    { columns: DEFAULT_COLUMNS },
    DEFAULT_CARDS,
  ),
  reducers: {
    addCard: TaskAdapter.addOne,
    updateCard: TaskAdapter.updateOne,
    deleteCard: TaskAdapter.removeOne,
    setAllCards: TaskAdapter.setAll,
  },
});

const globalizedTaskSelectors = TaskAdapter.getSelectors(
  (s: RootState) => s.tasks,
);

export const { addCard, updateCard, deleteCard, setAllCards } =
  TaskSlice.actions;

export const { selectAll: selectAllTasks } = globalizedTaskSelectors;
export const getAllColumns = (state: RootState) => state.tasks.columns;
