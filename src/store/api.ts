import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Column = {
  id: string;
  title: string;
};

type Card = {
  id: string;
  title: string;
  column: string;
};

type ColumnCards = {
  id: string;
  title: string;
  column: string;
  colorSpace: string;
  cards: Card[];
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
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
    getTasks: builder.query<ColumnCards[], void>({
      query: () => "/columnmap",
      providesTags: (result) => {
        if (!result) return ["Tasks"];
        return result
          .map(({ cards }) => {
            return cards.map(({ id, title }) => ({
              type: "Tasks" as const,
              id: `${id}-${title.slice(0, 10).trim()}`,
            }));
          })
          .flat(2);
      },
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/columnmap/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetColumnsQuery, useGetTasksQuery } = api;
