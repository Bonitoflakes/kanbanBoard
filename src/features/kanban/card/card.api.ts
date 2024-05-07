import { API } from "@/store/api";

type Card = {
  id: number;
  title: string;
  column: string;
  description: string;
  order: number;
};

type NewCard = Omit<Card, "id" | "order" | "description">;

export const CardAPI = API.injectEndpoints({
  endpoints: (builder) => ({
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

      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
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
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = CardAPI;
