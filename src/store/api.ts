import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Column = {
  id: number;
  title: string;
  colorSpace: string;
};

type Card = {
  id: number;
  title: string;
  column: string;
  description: string;
  order: number;
};

type NewColumn = Omit<Column, "id">;
type NewCard = Omit<Card, "id" | "order" | "description">;

type ColumnMap = Record<
  string,
  {
    id: number;
    title: string;
    count: number;
    colorSpace: string;
    cards: Array<Card>;
  }
>;

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
    getGroupedTasks: builder.query<ColumnMap, void>({
      query: () => "/columnmap",
      providesTags: (result, error) => {
        if (error) console.error(error);
        if (!result) return [{ type: "Tasks", id: "LIST" }];

        const tags = Object.entries(result)
          .flatMap(([, { cards }]) => cards)
          .map(({ id }) => ({ type: "Tasks" as const, id: id }));

        return [...tags, { type: "Tasks", id: "LIST" }];
        return [{ type: "Tasks", id: "LIST" }];
      },
    }),

    addColumn: builder.mutation<Column, NewColumn>({
      query: ({ title, colorSpace }) => ({
        url: "/columns",
        method: "POST",
        body: { title, colorSpace },
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateColumn: builder.mutation<Column, Column>({
      query: (column) => ({
        url: `/columns/${column.id}`,
        method: "PATCH",
        body: column,
      }),
      invalidatesTags: () => [{ type: "Tasks", id: "LIST" }],
    }),

    deleteColumn: builder.mutation<void, number>({
      query: (id) => ({
        url: `/columns/${id}`,
        method: "DELETE",
      }),
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
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateTask: builder.mutation<Card, Partial<Card>>({
      query: (task) => ({
        url: `/cards/${task.id}`,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Tasks", id: arg.id }],
    }),

    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/cards/${id}`,
        method: "DELETE",
      }),
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
