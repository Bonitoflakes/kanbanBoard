import { generateTaskID } from "@/utils/generateTaskID";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Column = {
  id: string;
  title: string;
};

type NewType = Omit<Card, "id">;

type Card = {
  id: string;
  title: string;
  column: string;
};

type ColumnMap = {
  [key: string]: {
    id: string;
    title: string;
    count: string;
    colorSpace: string;
    cards: Card[];
  };
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Tasks", "Columns"],

  endpoints: (builder) => ({
    getColumns: builder.query<Column[], void>({
      query: () => "/columns",
      providesTags: ["Columns"],
    }),

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

    getTaskByID: builder.query<Card, string>({
      query: (id) => `/cards/${id}`,
      providesTags: (result) => [
        {
          type: "Tasks",
          id: generateTaskID(result!.id, result!.title),
        },
      ],
    }),

    addTask: builder.mutation<Card, NewType>({
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
  useGetColumnsQuery,
  useGetGroupedTasksQuery,
  useGetTaskByIDQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} = api;
