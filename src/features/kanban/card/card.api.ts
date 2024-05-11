import { API } from "@/store/api";
import { ColumnAPI } from "@/features/kanban/column/column.api";
import { getColumnAndCardIndex, getColumnIndexByTitle } from "./utils";
import { Card, NewCard, UpdateCard } from "@/types";

export const CardAPI = API.injectEndpoints({
  endpoints: (builder) => ({
    getTask: builder.query<Card, number>({
      query: (id) => `/cards/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tasks" as const, id: id }],
    }),

    addTask: builder.mutation<Card, NewCard>({
      query: (task) => ({
        url: "/cards",
        method: "POST",
        body: task,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const randomID = Date.now();

        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            const columnIndex = getColumnIndexByTitle(draft, args.column);
            if (columnIndex === -1) throw new Error("Column not found");

            const newCard = {
              ...args,
              id: randomID,
              order: draft[columnIndex].cards.length + 1,
              description: "",
            };
            draft[columnIndex].cards.push(newCard);
          }),
        );

        try {
          const { data: serverData } = await queryFulfilled;
          dispatch(
            ColumnAPI.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
              // Find the faux card that was just created and update it with the actual data from the server response.
              const { columnIndex, cardIndex } = getColumnAndCardIndex(draft, randomID);
              if (columnIndex === -1 || cardIndex === -1) {
                console.error("Column or card not found");
                return;
              }

              draft[columnIndex].cards[cardIndex] = serverData;
              draft[columnIndex].count++;
            }),
          );
        } catch (error) {
          patchResult.undo(); // Revert the optimistic update on error
          console.error(error);
        }
      },
    }),

    updateTask: builder.mutation<Card, UpdateCard>({
      query: (task) => ({
        url: `/cards/${task.id}`,
        method: "PATCH",
        body: task,
      }),
      onQueryStarted: (args, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            //
            const { columnIndex, cardIndex } = getColumnAndCardIndex(draft, args.id);
            if (columnIndex === -1 || cardIndex === -1) {
              console.error("Column or card not found");
              return;
            }

            // Case: Move card to a different column.
            if (args.column) {
              console.log("Move card to different column");
              const newColumnIndex = getColumnIndexByTitle(draft, args.column);
              if (newColumnIndex === -1) {
                console.error("Column not found");
                return;
              }

              const oldColumn = draft[columnIndex];
              const newColumn = draft[newColumnIndex];

              const cardToBeMoved = oldColumn.cards.splice(cardIndex, 1);
              oldColumn.count--;

              newColumn.cards.push(cardToBeMoved[0]);
              newColumn.count++;
              return;
            }

            // Case: Update card within the same column.
            console.log("Update card within the same column");
            draft[columnIndex].cards[cardIndex] = {
              ...draft[columnIndex].cards[cardIndex],
              ...args,
            };
          }),
        );

        queryFulfilled.catch(patchResult.undo);
      },
    }),

    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/cards/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData("getGroupedTasks", undefined, (draft) => {
            const { columnIndex, cardIndex } = getColumnAndCardIndex(draft, id);
            if (columnIndex === -1 || cardIndex === -1) {
              console.error("Column or card not found");
              return;
            }

            draft[columnIndex].cards.splice(cardIndex, 1);
            draft[columnIndex].count--;
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
  }),
});

export const {
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = CardAPI;
