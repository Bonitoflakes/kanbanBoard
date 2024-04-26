import { generateTaskID } from "@/utils/generateTaskID";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Column = {
  id: string;
  title: string;
  colorSpace: string;
};

type Card = {
  id: string;
  title: string;
  column: string;
};

type NewColumn = Omit<Column, "id">;
type NewCard = Omit<Card, "id">;

type ColumnMap = Record<
  string,
  {
    id: string;
    title: string;
    count: string;
    colorSpace: string;
    cards: Array<Card>;
  }
>;

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
          .map(([, { cards }]) => cards)
          .flat()
          .map(({ title, id }) => {
            return [{ type: "Tasks" as const, id: generateTaskID(id, title) }];
          })
          .flat()
          .concat([{ type: "Tasks", id: "LIST" }]);

        return tags;
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

    addTask: builder.mutation<Card, NewCard>({
      query: (task) => ({
        url: "/cards",
        method: "POST",
        body: task,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateTask: builder.mutation<Card, Card>({
      query: (task) => ({
        url: `/cards/${task.id}`,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: () => [{ type: "Tasks", id: "LIST" }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const {
  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useGetGroupedTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api;
