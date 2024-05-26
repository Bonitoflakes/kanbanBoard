import { useRef, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import invariant from "tiny-invariant";

import { useDeleteTaskMutation, useUpdateTaskMutation } from "./card.api";

import { CardOptions } from "@/features/kanban/card/cardOptions";
import moveCaretToEnd from "@/utils/moveCaret";
import { cn } from "@/utils/cn";
import { useToggle } from "@/utils/useToggle";

type CardProps = {
  id: number;
  title: string;
  column: string;
  order: number;
};

const Card = ({ id, title, column, order }: CardProps) => {
  const [editing, toggleEditing] = useToggle();
  const contentEditableRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const cardData = useMemo(
    () => ({
      type: "card",
      id,
      title,
      order,
      column,
    }),
    [id, order, title, column],
  );

  useEffect(() => {
    const el = cardRef.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () => cardData,
      }),

      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => {
          if (source.data.type === "card") return true;
          return false;
        },
        getData: (args) => {
          const result = attachClosestEdge(cardData, {
            element: el,
            input: args.input,
            allowedEdges: ["top", "bottom"],
          });

          return result;
        },
        onDrag({ self, source }) {
          if (source.data.type === "column") {
            setClosestEdge(null);
            return;
          }

          const isSource = source.element === el;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);
          const sourceOrder = source.data.order as number;

          const isItemBeforeSource = order === sourceOrder - 1;
          const isItemAfterSource = order === sourceOrder + 1;

          // Don't show the drop indicator if the item is before the source
          // or after the source (i.e. the edge is near the source)

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          const isSameLane = source.data.column === column;

          if (isDropIndicatorHidden && isSameLane) {
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
      }),
    );
  }, [cardData, order]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleEditing();

    requestAnimationFrame(() => {
      invariant(contentEditableRef.current);
      moveCaretToEnd(contentEditableRef.current);
    });
  };

  const handleSave = (e: React.FocusEvent) => {
    e.stopPropagation();

    toggleEditing();
    updateTask({
      id: id,
      title: String((e.target as HTMLDivElement).innerText).trim(),
      column: column,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(id);
  };

  const openSidePeek = () => {
    if (editing) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selectedCard", id.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <div
      className="group/card relative rounded-md"
      onClick={openSidePeek}
      data-type="card"
      ref={cardRef}
    >
      <div className="rounded-md bg-accent-2 transition-colors hover:bg-accent-1/35">
        <div
          className={cn(
            "w-full cursor-pointer break-all rounded-md px-2 py-3 text-start text-sm font-semibold text-secondary empty:before:text-neutral-400 empty:before:content-['Untitled...'] active:cursor-grabbing dark:empty:before:text-neutral-400",
            editing && "cursor-auto",
            import.meta.env.DEV && "customOrderDebugger",
          )}
          contentEditable={editing}
          data-order={order}
          suppressContentEditableWarning={true}
          ref={contentEditableRef}
          onBlur={handleSave}
        >
          {title}
        </div>

        {!editing && (
          <CardOptions handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </div>
      {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
    </div>
  );
}

export default Card;
