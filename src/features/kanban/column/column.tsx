import { useRef } from "react";
import Card from "@/features/kanban/card/card";
import { cn } from "@/utils/cn";
import { NewCardButton } from "./newCard";
import { ColumnHeader } from "./header/header";
import { useToggle } from "@/utils/useToggle";

export type ColumnProps = {
  id: number;
  order: number;
  title: string;
  activeColumn: string;
  colorSpace: string;
  count: number;
  cards: Array<{ id: number; title: string; column: string }>;
};

function Column({
  id,
  title,
  colorSpace,
  count,
  order,
  cards,
  activeColumn,
}: ColumnProps) {
  const [adding, toggleAdding] = useToggle();
  const columnRef = useRef(null);

  const columnCards = cards.filter((c) => c.column === title);

  return (
    <div
      data-theme={colorSpace}
      className={cn(
        "group/column h-fit min-w-[280px] flex-1 rounded-md bg-accent-3 p-2",
        activeColumn === title && "bg-sky-800",
      )}
      ref={columnRef}
    >
      <ColumnHeader
        title={title}
        id={id}
        color={colorSpace}
        count={count}
        toggleAdding={toggleAdding}
        order={order}

      />

      <div className="mt-6 flex flex-col gap-[5px]">
        {columnCards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>

      <NewCardButton
        title={title}
        adding={adding}
        toggleAdding={toggleAdding}
      />
    </div>
  );
}

export default Column;
