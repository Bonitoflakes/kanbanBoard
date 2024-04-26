type colors =
  | "rose"
  | "yellow"
  | "red"
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "brown"
  | "gray";

export type Column = {
  id: number;
  title: string;
  colorSpace: colors;
  order: number;
  totalCards: number;
};

export type Card = {
  id: number;
  title: string;
  pos: number;
  column: string;
  // description: string;
};

export type ColumnMap = {
  [key: string]: {
    id: number;
    title: string;
    colorSpace: colors;
    order: number;
    totalCards: number;
    cards: Array<Card>;
  };
};
