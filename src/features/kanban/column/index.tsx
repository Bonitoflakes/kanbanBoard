import { useRef } from "react";
import { useToggle } from "@/utils/useToggle";
import Card from "@/features/kanban/card/card";
import { NewCardButton } from "./newCard";
import { ColumnHeader } from "./header/header";
import { useGetGroupedTasksQuery } from "@/store/api";
import invariant from "tiny-invariant";

export type ColumnProps = {
  type: string;
};

function Column({ type }: ColumnProps) {
  const [adding, toggleAdding] = useToggle();
  const columnRef = useRef(null);

  const { data } = useGetGroupedTasksQuery();
  const column = data?.find((col) => col.title === type);
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
