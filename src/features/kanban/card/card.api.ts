import { API } from "@/store/api";
import { ColumnAPI } from "@/features/kanban/column/column.api";
import { getColumnAndCardIndex, getColumnIndexByTitle } from "./utils";
import { Card, ColumnMap, NewCard, UpdateCard } from "@/types";
import invariant from "tiny-invariant";

export const reorderCards = (
  cards: Card[],
  sourceIndex: number,
  destinationIndex: number,
) => {
  // Remove the card from the source index
  const [removedCard] = cards.splice(sourceIndex, 1);

  // Insert the removed card at the destination index
  cards.splice(destinationIndex, 0, removedCard);

  // Update the order field for each card
  cards.forEach((card, index) => {
    card.order = index + 1;
  });

  // Sort the cards by order
  cards.sort((a, b) => a.order - b.order);

  return cards;
};

export const handleMoveCardToNewColumn = (
  draft: ColumnMap[],
  oldColumnIndex: number,
  cardIndex: number,
  args: UpdateCard,
) => {
  console.log("Move card to different column");
  invariant(args.column !== undefined, "column is undefined");
  invariant(args.order !== undefined, "order is undefined");

  const newColumnIndex = getColumnIndexByTitle(draft, args.column);
  if (newColumnIndex === -1) return console.error("Column not found");

  const oldColumn = draft[oldColumnIndex];
  const newColumn = draft[newColumnIndex];

  const [removedCard] = oldColumn.cards.splice(cardIndex, 1);
  removedCard.column = args.column;

  oldColumn.count--;
  oldColumn.cards.forEach((card, index) => (card.order = index + 1));

  newColumn.cards.push(removedCard);
  newColumn.count++;

  const reorderedCards = reorderCards(
    newColumn.cards,
    newColumn.cards.length - 1,
    args.order - 1,
  );
  newColumn.cards = reorderedCards;
};

export const handleMoveCardInSameColumn = (
  draft: ColumnMap[],
  columnIndex: number,
  cardIndex: number,
  args: UpdateCard,
) => {
  console.log("Update card within the same column");
  invariant(args.order !== undefined, "order is undefined");

  const reorderedData = reorderCards(
    draft[columnIndex].cards,
    cardIndex,
    args.order - 1,
  );
  draft[columnIndex].cards = reorderedData;
};

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
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const randomID = Date.now();

        const patchResult = dispatch(
          ColumnAPI.util.updateQueryData(
            "getGroupedTasks",
            undefined,
            (draft) => {
              const columnIndex = getColumnIndexByTitle(draft, args.column);
              if (columnIndex === -1) throw new Error("Column not found");

              const newCard = {
                ...args,
                id: randomID,
                order: draft[columnIndex].cards.length + 1,
                description: "",
              };
              draft[columnIndex].cards.push(newCard);
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
                // Find the faux card that was just created and update it with the actual data from the server response.
                const { columnIndex, cardIndex } = getColumnAndCardIndex(
                  draft,
                  randomID,
                );
                if (columnIndex === -1 || cardIndex === -1) {
                  console.error("Column or card not found");
                  return;
                }

                draft[columnIndex].cards[cardIndex] = serverData;
                draft[columnIndex].count++;
              },
            ),
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
          ColumnAPI.util.updateQueryData(
            "getGroupedTasks",
            undefined,
            (draft) => {
              const { columnIndex, cardIndex } = getColumnAndCardIndex(
                draft,
                args.id,
              );
              if (columnIndex === -1 || cardIndex === -1)
                return console.error("Column or card not found");

              if (args.order === undefined) {
                console.log("Update card details only, not order");
                draft[columnIndex].cards[cardIndex] = {
                  ...draft[columnIndex].cards[cardIndex],
                  ...args,
                };
                return;
              }

              // Case: Move card to a different column.
              if (args.column !== draft[columnIndex].title) {
                handleMoveCardToNewColumn(draft, columnIndex, cardIndex, args);
              }

              // Case: Update card within the same column.
              else {
                handleMoveCardInSameColumn(draft, columnIndex, cardIndex, args);
              }
            },
          ),
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
          ColumnAPI.util.updateQueryData(
            "getGroupedTasks",
            undefined,
            (draft) => {
              const { columnIndex, cardIndex } = getColumnAndCardIndex(
                draft,
                id,
              );
              if (columnIndex === -1 || cardIndex === -1) {
                console.error("Column or card not found");
                return;
              }

              draft[columnIndex].cards.splice(cardIndex, 1);
              draft[columnIndex].count--;
              draft[columnIndex].cards.forEach((card, index) => {
                card.order = index + 1;
              });
            },
          ),
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
