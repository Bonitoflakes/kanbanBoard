import { useEffect, useMemo, useRef, useState } from "react";
import { useToggle } from "@/utils/useToggle";
import {
  dropTargetForElements,
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import invariant from "tiny-invariant";

import { useGetGroupedTasksQuery } from "./column.api";
import { cn } from "@/utils/cn";

import { NewCardButton } from "./newCard";
import { ColumnHeader } from "./header";
import { VirtualCards } from "./virtualCards";

type ColumnProps = {
  title: string;
  order: number;
  activeColumn: string | null;
  updateActiveColumn: (column: string) => void;
};

const VirtualColumn = ({
  title,
  order,
  activeColumn,
  updateActiveColumn,
}: ColumnProps) => {
  const [adding, toggleAdding] = useToggle();
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const columnRef = useRef<HTMLDivElement | null>(null);

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
        canDrop: ({ source }) => {
          if (source.data.type === "column" || source.data.type === "card") {
            return true;
          }
          return false;
        },
        getData: (args) => {
          const result = attachClosestEdge(columnData, {
            element: args.element,
            input: args.input,
            allowedEdges: ["left", "right"],
          });
          return result;
        },
        onDrag: ({ self, source }) => {
          // To prevent DropIndicator from showing up for the same column.
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          // To prevent DropIndicator from showing up for the column when dragging a card
          // from a column to another column.
          if (source.data.type === "card") {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);
          const targetOrder = source.data.order as number;

          const isItemBeforeSource = order === targetOrder - 1;
          const isItemAfterSource = order === targetOrder + 1;

          // Don't show the drop indicator if the item is before the source
          // or after the source (i.e. the edge is near the source)
          // the left edge of the itemBefore and the right edge of the itemAfter are identical postions as the item's edge
          // CHECK AdjacentColumns() in utils.ts
          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "right") ||
            (isItemAfterSource && closestEdge === "left");

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },

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
  }, [updateActiveColumn, columnData, order]);

  return (
    <div className="relative">
      {/* The above div is required for the drop indicator to work. */}
      <div
        data-theme={column.colorSpace}
        className={cn(
          "group/column w-[280px]  overflow-y-scroll rounded-md bg-accent-3",
          {
            "bg-cyan-200": activeColumn === title,
          },
          "magicThree",
          "relative overflow-auto",
        )}
        ref={columnRef}
      >
        <ColumnHeader {...column} toggleAdding={toggleAdding} />

        <VirtualCards column={column} columnRef={columnRef}/>

        <NewCardButton
          title={column.title} // alt for column id.
          adding={adding}
          toggleAdding={toggleAdding}
        />
        {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
      </div>
    </div>
  );
};

export default VirtualColumn;
