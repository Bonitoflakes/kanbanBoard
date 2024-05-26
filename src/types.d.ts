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

type ColumnMap = {
  id: number;
  count: number;
  title: string;
  order: number;
  colorSpace: string;
  cards: Array<Card>;
};

type NewCard = Omit<Card, "id" | "order" | "description">;
type UpdateCard = Partial<Card> & Pick<Card, "id">;

type NewColumn = Omit<Column, "id" | "order">;
type UpdateColumn = Partial<Column> & Pick<Column, "id">;

export type {
  Card,
  ColumnMap,
  NewCard,
  UpdateCard,
  NewColumn,
  Column,
  UpdateColumn,
};
