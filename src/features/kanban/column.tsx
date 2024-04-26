import { useRef, useState } from "react";
import Card from "@/features/kanban/card/card";
import { cn } from "@/utils/cn";
import { NewCardButton } from "./newCardButton";
import { ColumnHeader } from "./column/header/header";

export type ColumnProps = {
  id: number;
  title: string;
  activeColumn: string;
  columnColor: string;
  cards: { id: string; title: string; column: string }[];
};

function Column({ title, activeColumn, cards, columnColor, id }: ColumnProps) {
  const [adding, setAdding] = useState<boolean>(false);

  const columnRef = useRef(null);

  const columnCards = cards.filter((c) => c.column === title);
  const toggleAdding = () => setAdding((p) => !p);

  return (
    <div
      data-theme={columnColor}
      className={cn(
        "group/column h-fit min-w-[280px] flex-1 rounded-md bg-accent-3 p-2",
        activeColumn === title && "bg-sky-800",
      )}
      ref={columnRef}
    >
      <ColumnHeader
        title={title}
        id={id}
        color={columnColor}
        total={columnCards.length}
        toggleAdding={toggleAdding}
      />

      <div className=" mt-6 flex flex-col gap-[5px]">
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
