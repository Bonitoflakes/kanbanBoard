import { useCallback, useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/types";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";

import { useToggle } from "@/utils/useToggle";
import { cn } from "@/utils/cn";
import useCardParams from "@/utils/useCardParams";

import {
  useGetGroupedTasksQuery,
  useUpdateColumnMutation,
} from "./column/column.api";
import { useUpdateTaskMutation } from "./card/card.api";

import Header from "./header";
import { NewColumn } from "./column/newColumn";
import SidepeekHusk from "./sidepeek/husk";
import {
  adjacentColumns,
  adjacentCards,
  calculateCardOrder,
  calculateColumnOrder,
} from "./util";
import VirtualColumn from "./column";

const Kanban = () => {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [updateColumn] = useUpdateColumnMutation();
  const [updateTask] = useUpdateTaskMutation();

  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [isOpen, toggleWidth] = useToggle();
  const [touched, toggleTouched] = useToggle();

  const selectedCard = useCardParams();

  const updateActiveColumn = (column: string | null) => setActiveColumn(column);

  const handleDrop = useCallback(
    (args: BaseEventPayload<ElementDragType>) => {
      invariant(data, "No data from query");
      const allDropTargets = args.location.current.dropTargets;
      // Early exit if dropped on anything that is not a dropzone.
      if (allDropTargets.length === 0) return console.log("no dropzone");

      const origin = args.source.data;
      const target = allDropTargets[0].data;
      const originOrder = origin.order as number;
      const targetOrder = target.order as number;
      const isSameColumn = origin.column === target.column;
      const closestEdge = extractClosestEdge(target);
      invariant(closestEdge, "No closest edge");

      if (origin.id === target.id) return; // early return if same card / column.

      if (origin.type === "column" && target.type === "column") {
        if (adjacentColumns(closestEdge, originOrder, targetOrder)) {
          return console.log("noop");
        }

        const newOrder = calculateColumnOrder({
          closestEdge,
          originOrder: originOrder as number,
          targetOrder,
        });

        updateColumn({
          id: origin.id as number,
          order: newOrder,
        });

        return;
      }

      if (origin.type === "card" && target.type === "card") {
        if (
          adjacentCards(closestEdge, originOrder, targetOrder, isSameColumn)
        ) {
          return console.log("noop");
        }

        const newOrder = calculateCardOrder({
          closestEdge,
          originOrder: originOrder as number,
          targetOrder,
          isSameColumn,
        });

        updateTask({
          id: origin.id as number,
          order: newOrder,
          column: target.column as string,
        });
        return;
      }

      if (origin.type === "card" && target.type === "column") {
        const destColIndex = data.findIndex(
          (lane) => lane.title === (target.title as string),
        );

        invariant(destColIndex !== -1, "Column not found");
        const destColCardsLength = data[destColIndex].cards.length;
        console.log("destColCardsLength", destColCardsLength);

        if (destColCardsLength === 0) {
          updateTask({
            id: origin.id as number,
            column: target.title as string,
            order: 1,
          });
        }
      }
    },
    [data, updateColumn, updateTask],
  );

  useEffect(() => {
    if (selectedCard) {
      toggleWidth(true);
      toggleTouched(true);
    } else toggleWidth(false);
  }, [selectedCard, toggleWidth, toggleTouched]);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => {
        return source.data.type === "column" || source.data.type === "card";
      },

      onDrop: (args) => {
        updateActiveColumn(null);
        handleDrop(args);
      },
    });
  }, [handleDrop]);

  // TODO: Better strategy for these states.
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <div className="flex h-full flex-col gap-4 bg-primary">
      <Header />

      <div
        className={cn(
          "flex h-full w-full gap-4 overflow-x-auto p-4 pr-1 transition-all",
          {
            reduceWidth: isOpen,
            increaseWidth: !isOpen && touched,
          },
          "magicOne",
        )}
      >
        <div className="magicTwo">
          {data.map((value) => {
            return (
              <VirtualColumn
                key={value.id}
                title={value.title}
                order={value.order}
                activeColumn={activeColumn}
                updateActiveColumn={updateActiveColumn}
              />
            );
          })}

          <NewColumn />
        </div>
      </div>

      <SidepeekHusk />
    </div>
  );
};

export default Kanban;
