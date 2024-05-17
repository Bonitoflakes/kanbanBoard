import { useEffect, useMemo, useRef } from "react";
import { useToggle } from "@/utils/useToggle";
import {
  dropTargetForElements,
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { once } from "@atlaskit/pragmatic-drag-and-drop/once";
import invariant from "tiny-invariant";

import { useGetGroupedTasksQuery } from "./column.api";
import { cn } from "@/utils/cn";

import Card from "@/features/kanban/card";
import { NewCardButton } from "./newCard";
import { ColumnHeader } from "./header";

type ColumnProps = {
  title: string;
  activeColumn: string | null;
  updateActiveColumn: (column: string) => void;
};

function Column({ title, activeColumn, updateActiveColumn }: ColumnProps) {
  const [adding, toggleAdding] = useToggle();
  const columnRef = useRef<HTMLDivElement>(null);

  const { data } = useGetGroupedTasksQuery();
  invariant(data, "No data");
  const columnIndex = data.findIndex((col) => col.title === title);
  invariant(columnIndex !== -1, "Column Index not found");
  const column = data[columnIndex];
  invariant(column, "Column not found");

  const columnData = useMemo(
    () => ({
      type: "column",
      id: column.id,
      title: column.title,
      order: column.order,
    }),
    [column],
  );

  useEffect(() => {
    const element = columnRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
        getInitialData: () => columnData,
      }),

      dropTargetForElements({
        element,
        getData: once(() => columnData),

        onDragStart: ({ self, source }) => {
          const column = self.data.title as string;
          const isCard = source.data.type === "card";
          if (isCard) updateActiveColumn(column);
        },

        onDragEnter: ({ self, source }) => {
          const column = self.data.title as string;
          const isCard = source.data.type === "card";
          if (isCard) updateActiveColumn(column);
        },
      }),
    );
  }, [updateActiveColumn, columnData]);

  return (
    <div
      data-theme={column.colorSpace}
      className={cn(
        "group/column h-fit min-w-[280px] max-w-[475px] flex-1 rounded-md bg-accent-3 p-2",
        {
          "bg-cyan-200": activeColumn === title,
        },
      )}
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
