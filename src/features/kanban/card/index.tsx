import { useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { once } from "@atlaskit/pragmatic-drag-and-drop/once";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
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

function Card({ id, title, column, order }: CardProps) {
  const [editing, toggleEditing] = useToggle();
  const contentEditableRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);

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
        getData: once(() => cardData),
      }),
    );
  }, [cardData]);

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
    </div>
  );
}

export default Card;
