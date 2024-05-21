import { API_ROUTES } from "@/constants/routes";
import { API } from "@/store/api";
import { Column, ColumnMap, NewColumn, UpdateColumn } from "@/types";

export const ColumnAPI = API.injectEndpoints({
  endpoints: (builder) => ({
    getGroupedTasks: builder.query<ColumnMap[], void>({
      query: () => API_ROUTES.GROUPED_TASKS,
      providesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    addColumn: builder.mutation<Column, NewColumn>({
      query: ({ title, colorSpace }) => ({
        url: API_ROUTES.COLUMNS,
        method: "POST",
        body: { title, colorSpace },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const randomID = Date.now();

        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData(
            "getGroupedTasks",
            undefined,
            (draft) => {
              draft.push({
                id: randomID,
                title: args.title,
                order: draft.length + 1,
                colorSpace: args.colorSpace,
                count: 0,
                cards: [],
              });
            },
          ),
        );

        try {
          const { data: serverData } = await queryFulfilled;

          dispatch(
            ColumnAPI.util.updateQueryData(
              "getGroupedTasks",
              undefined,
              (draft) => {
                const columnIndex = draft.findIndex(
                  (col) => col.id === randomID,
                );
                if (columnIndex === -1) return console.log("Column not found");
                const column = draft[columnIndex];
                draft[columnIndex] = { ...column, ...serverData };
              },
            ),
          );
        } catch (error) {
          patchResult.undo(); // Revert the optimistic update on error
          console.error(error);
        }
      },
      // invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateColumn: builder.mutation<Column, UpdateColumn>({
      query: (column) => ({
        url: API_ROUTES.COLUMN(column.id),
        method: "PATCH",
        body: column,
      }),

      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData(
            "getGroupedTasks",
            undefined,
            (draft) => {
              const columnIndex = draft.findIndex((col) => col.id === args.id);
              if (columnIndex === -1) return console.log("Column not found");
              const column = draft[columnIndex];

              // case: move column
              if (args.order !== undefined) {
                const newPos = args.order;
                const [removedColumn] = draft.splice(columnIndex, 1);
                draft.splice(newPos - 1, 0, removedColumn);
                draft.forEach((col, index) => (col.order = index + 1));
              }

              // case: update column
              else {
                draft[columnIndex] = { ...column, ...args };
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Revert the optimistic update on error
          console.error(error);
        }
      },

      // invalidatesTags: () => [{ type: "Tasks", id: "LIST" }],
    }),

    deleteColumn: builder.mutation<void, number>({
      query: (id) => ({
        url: `/columns/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData(
            "getGroupedTasks",
            undefined,
            (draft) => {
              const columnIndex = draft.findIndex((col) => col.id === id);
              if (columnIndex === -1) return console.log("Column not found");
              draft.splice(columnIndex, 1);
              draft.forEach((col, index) => (col.order = index + 1));
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      // invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetGroupedTasksQuery,

  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
} = ColumnAPI;
