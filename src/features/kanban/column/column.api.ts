import { API } from "@/store/api";
import Column from ".";

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

type ColumnMap = {
  id: number;
  count: number;
  title: string;
  order: number;
  colorSpace: string;
  cards: Array<Card>;
};

export const ColumnAPI = API.injectEndpoints({
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
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateColumn: builder.mutation<Column, Partial<Column>>({
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
  }),
});

export const {
  useGetGroupedTasksQuery,

  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
} = ColumnAPI;
