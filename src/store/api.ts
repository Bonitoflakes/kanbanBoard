import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Column = {
  id: number;
  title: string;
  colorSpace: string;
  order: number;
};

type Card = {
  id: number;
  title: string;
  column: string;
  description: string;
  order: number;
};

type NewColumn = Omit<Column, "id" | "order">;
type NewCard = Omit<Card, "id" | "order" | "description">;

type ColumnMap = {
  id: number;
  count: number;
  title: string;
  order: number;
  colorSpace: string;
  cards: Array<Card>;
};

export function providesList<
  R extends { id: string | number }[],
  T extends string,
>(resultsWithIds: R | undefined, tagType: T) {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}

// NOTE: Return TYPE, QueryParam TYPE
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Tasks"],

  endpoints: (builder) => ({
    getGroupedTasks: builder.query<ColumnMap[], void>({
      query: () => "/columnmap",
      providesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    addColumn: builder.mutation<Column, NewColumn>({
      query: ({ title, colorSpace }) => ({
        url: "/columns",
        method: "POST",
        body: { title, colorSpace },
      }),
      onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            draft.push({
              ...patch,
              count: 0,
              cards: [],
              id: Math.random(),
              order: 99999,
            });
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateColumn: builder.mutation<Column, Partial<Column>>({
      query: (column) => ({
        url: `/columns/${column.id}`,
        method: "PATCH",
        body: column,
      }),
      onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            const index = draft.findIndex((c) => c.id === patch.id);
            draft[index] = { ...draft[index], ...patch };
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: () => [{ type: "Tasks", id: "LIST" }],
    }),

    deleteColumn: builder.mutation<void, number>({
      query: (id) => ({
        url: `/columns/${id}`,
        method: "DELETE",
      }),
      onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            const index = draft.findIndex((c) => c.id === args);
            draft.splice(index, 1);
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    getTask: builder.query<Card, number>({
      query: (id) => `/cards/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Tasks" as const, id: id },
      ],
    }),

    addTask: builder.mutation<Card, NewCard>({
      query: (task) => ({
        url: "/cards",
        method: "POST",
        body: task,
      }),

      onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            const index = draft.findIndex((c) => c.title === patch.column);
            draft[index].cards.push({
              ...patch,
              id: Math.random(),
              order: draft[index].cards.length,
              description: "",
            });
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateTask: builder.mutation<Card, Partial<Card>>({
      query: (task) => ({
        url: `/cards/${task.id}`,
        method: "PATCH",
        body: task,
      }),

      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/cards/${id}`,
        method: "DELETE",
      }),

      onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            const index = draft.findIndex((c) =>
              c.cards.some((t) => t.id === args),
            );
            const currCard = draft[index].cards;
            currCard.splice(
              currCard.findIndex((c) => c.id === args),
              1,
            );
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetGroupedTasksQuery,

  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,

  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api;
