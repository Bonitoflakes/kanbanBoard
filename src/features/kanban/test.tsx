import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/types";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";

import { useToggle } from "@/utils/useToggle";
import { cn } from "@/utils/cn";

import {
  useGetGroupedTasksQuery,
  useUpdateColumnMutation,
} from "./column/column.api";
import { useUpdateTaskMutation } from "./card/card.api";

import Header from "./header";
import Column from "./column";
import { NewColumn } from "./column/newColumn";
import SidepeekHusk from "./sidepeek/husk";

const noopIfAdjacent = (
  edge: string,
  origin: Record<string, unknown>,
  target: Record<string | symbol, unknown>,
) => {
  const originOrder = origin.order as number;
  const targetOrder = target.order as number;

  const originColumn = origin.column as string;
  const targetColumn = target.column as string;

  const isSameColumn = originColumn === targetColumn;

  const move = targetOrder < originOrder ? "up" : "down";
  console.log(originOrder, targetOrder, edge, move);

  const beforeSibling = originOrder === targetOrder - 1;
  const afterSibling = originOrder === targetOrder + 1;

  const isBefore = beforeSibling && isTopLeft(edge);
  const isAfter = afterSibling && isBottomRight(edge);

  if ((isBefore || isAfter) && isSameColumn) {
    console.log("func noooooop");
    return true;
  }
  return false;
};

const isBottomRight = (edge: string) => {
  if (edge === "right" || edge === "bottom") return true;
};

const isTopLeft = (edge: string) => {
  if (edge === "left" || edge === "top") return true;
};

const calculateNewOrder = (
  isOriginHigher: boolean,
  edge: string,
  targetOrder: number,
) => {
  let newOrder = targetOrder;
  if (isBottomRight(edge)) {
    if (isOriginHigher) newOrder = targetOrder + 1;
  }

  if (isTopLeft(edge)) {
    if (!isOriginHigher) newOrder = targetOrder - 1;
  }

  console.log("Calculated new order", newOrder);

  return newOrder;
};

const Kanban = () => {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [updateColumn] = useUpdateColumnMutation();
  const [updateTask] = useUpdateTaskMutation();

  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  // Resize the kanban when the sidepeek is opened.
  const [isOpen, toggleWidth] = useToggle();
  const [touched, toggleTouched] = useToggle();
  const [searchParams] = useSearchParams();
  const selectedCard = searchParams.get("selectedCard");
  useEffect(() => {
    if (selectedCard) {
      toggleWidth(true);
      toggleTouched(true);
    } else toggleWidth(false);
  }, [selectedCard, toggleWidth, toggleTouched]);

  const updateActiveColumn = (column: string | null) => setActiveColumn(column);

  const handleDrop = useCallback(
    ({ source, location }: BaseEventPayload<ElementDragType>) => {
      const allDropTargets = location.current.dropTargets;
      // Early exit if dropped on anything that is not a dropzone.
      if (allDropTargets.length === 0) return console.log("noop dropzone");

      const origin = source.data;
      const target = allDropTargets[0].data;
      console.log(origin, target);
      const closestEdge = extractClosestEdge(target);
      invariant(closestEdge, "No closest edge");

      // early return if same card / column.
      if (origin.id === target.id) return console.log("noop same card/lane");

      const originType = origin.type;
      const originOrder = origin.order as number;

      const targetType = target.type;
      const targetOrder = target.order as number;

      const isOriginHigher = originOrder > targetOrder;

      if (noopIfAdjacent(closestEdge, origin, target)) return;

      if (originType === "column" && targetType === "column") {
        console.log("🚀🚀🚀 COLUMN --> COLUMN");
        const newOrder = calculateNewOrder(
          isOriginHigher,
          closestEdge,
          targetOrder,
        );

        updateColumn({
          id: origin.id as number,
          order: newOrder,
        });
        return;
      }

      if (originType === "card" && targetType === "card") {
        console.log("🚀🚀🚀 CARD --> CARD");
        const targetColumn = target.column as string;

        let newOrder = calculateNewOrder(
          isOriginHigher,
          closestEdge,
          targetOrder,
        );
        const originColumn = origin.column as string;

        const isSameColumn = originColumn === targetColumn;

        if (!isSameColumn) {
          console.log("asdf", newOrder + 1);
          newOrder = newOrder + 1;
        }

        console.log(newOrder, "newOrder");

        updateTask({
          id: origin.id as number,
          order: newOrder,
          column: targetColumn,
        });
        return;
      }

      if (originType === "card" && targetType === "column") {
        console.log("🚀🚀🚀 CARD --> COLUMN");
        invariant(data, "No data from query");

        const destColIndex = data.findIndex(
          (lane) => lane.title === (target.title as string),
        );

        invariant(destColIndex !== -1, "Column not found");
        const destColCardsLength = data[destColIndex].cards.length;

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
    <div className="flex h-full flex-col gap-4 bg-primary ">
      <Header />

      <div
        className={cn(
          "flex h-full w-full gap-4 overflow-x-auto p-4 pr-1 transition-all",
          {
            reduceWidth: isOpen,
            increaseWidth: !isOpen && touched,
          },
        )}
      >
        {data.map((value) => {
          return (
            <Column
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

      <SidepeekHusk />
    </div>
  );
}

export default Kanban;
