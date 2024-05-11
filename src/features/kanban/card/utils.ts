import { ColumnMap } from "@/types";

export const getColumnIndexByTitle = (draft: ColumnMap[], column: string) => {
  const columnIndex = draft.findIndex((col) => col.title === column);
  return columnIndex;
};

export const getColumnIndexByCardID = (draft: ColumnMap[], cardID: number) => {
  const columnIndex = draft.findIndex((col) =>
    col.cards.some((card) => card.id === cardID),
  );
  return columnIndex;
};

export const getCardIndex = (
  draft: ColumnMap[],
  colIndex: number,
  cardID: number,
) => {
  const cardIndex = draft[colIndex].cards.findIndex(
    (card) => card.id === cardID,
  );
  return cardIndex;
};

export const getColumnAndCardIndex = (
  draft: ColumnMap[],
  cardID: number,
): { columnIndex: number; cardIndex: number } => {
  const columnIndex = draft.findIndex((col) =>
    col.cards.some((card) => card.id === cardID),
  );
  const cardIndex =
    columnIndex !== -1
      ? draft[columnIndex].cards.findIndex((card) => card.id === cardID)
      : -1;
  return { columnIndex, cardIndex };
};
