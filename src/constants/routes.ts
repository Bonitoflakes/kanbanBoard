export const APP_ROUTES = {
  BOARD: "/board",
};

export const API_ROUTES = {
  GROUPED_TASKS: "/columnMap",
  COLUMNS: "/columns",
  COLUMN: (columnId: number) => `/columns/${columnId}`,

  CARD: (cardId: number) => `/cards/${cardId}`,
  NEW_CARD: "/cards",
};
