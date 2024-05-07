import { useRef } from "react";
import { useToggle } from "@/utils/useToggle";
import Card from "@/features/kanban/card";
import { NewCardButton } from "./newCard";
import { ColumnHeader } from "./header";
import invariant from "tiny-invariant";
import { useGetGroupedTasksQuery } from "./column.api";

export type ColumnProps = {
  type: string;
};

function Column({ type }: Readonly<ColumnProps>) {
  const [adding, toggleAdding] = useToggle();
  const columnRef = useRef(null);

  const { data } = useGetGroupedTasksQuery();
  invariant(data, "No data");
  const columnIndex = data.findIndex((col) => col.title === type);
  invariant(columnIndex !== -1, "Column Index not found");
  const column = data[columnIndex];
  invariant(column, "Column not found");

  return (
    <div
      data-theme={column.colorSpace}
      className="group/column h-fit min-w-[280px] max-w-[475px] flex-1 rounded-md bg-accent-3 p-2"
      ref={columnRef}
    >
      <ColumnHeader {...column} toggleAdding={toggleAdding} />

      <div className="mt-6 flex flex-col gap-[5px]">
        {column.cards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>

      <NewCardButton
        title={column.title} // alt for column id.
        adding={adding}
        toggleAdding={toggleAdding}
      />
    </div>
  );
}

export default Column;
