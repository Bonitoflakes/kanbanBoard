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

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [updateColumn] = useUpdateColumnMutation();
  const [updateTask] = useUpdateTaskMutation();

  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [isOpen, toggleWidth] = useToggle();
  const [touched, toggleTouched] = useToggle();

  const [searchParams] = useSearchParams();
  const selectedCard = searchParams.get("selectedCard");

  const updateActiveColumn = (column: string | null) => setActiveColumn(column);

  const handleDrop = useCallback(
    (args: BaseEventPayload<ElementDragType>) => {
      updateActiveColumn(null);
      invariant(data, "No data from query");

      const origin = args.source.data;
      const target = args.location.current.dropTargets[0].data;

      if (origin.id === target.id) return; // early return if same card / column.

      const closestEdge = extractClosestEdge(target);

      if (origin.type === "column" && target.type === "column") {
        const targetOrder = target.order as number;

        if (closestEdge === "left" && origin.order === targetOrder - 1) {
          return console.log("noop");
        }

        if (closestEdge === "right" && origin.order === targetOrder + 1) {
          return console.log("noop");
        }

        if (closestEdge === "right") {
          updateColumn({
            id: origin.id as number,
            order: targetOrder + 1,
          });
          return;
        }

        if (closestEdge === "left") {
          updateColumn({
            id: origin.id as number,
            order: targetOrder,
          });
          return;
        }
      }

      if (origin.type === "card" && target.type === "card") {
        const targetOrder = target.order as number;
        const targetColumn = target.column as string;

        if (closestEdge === "top" && origin.order === targetOrder - 1) {
          return console.log("noop");
        }

        if (closestEdge === "bottom" && origin.order === targetOrder + 1) {
          return console.log("noop");
        }

        if (closestEdge === "bottom") {
          updateTask({
            id: origin.id as number,
            order: targetOrder + 1,
            column: targetColumn,
          });
          return;
        }

        if (closestEdge === "top") {
          updateTask({
            id: origin.id as number,
            order: targetOrder,
            column: targetColumn,
          });
          return;
        }
      }

      if (origin.type === "card" && target.type === "column") {
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

      onDrop: (args) => handleDrop(args),
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
