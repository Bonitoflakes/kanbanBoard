import { useRef } from "react";
import invariant from "tiny-invariant";
import { useSearchParams } from "react-router-dom";
import { CardOptions } from "@/features/kanban/card/cardOptions";
import moveCaretToEnd from "@/utils/moveCaret";
import { cn } from "@/utils/cn";
import { useToggle } from "@/utils/useToggle";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "./card.api";

type CardProps = {
  id: number;
  title: string;
  column: string;
  order: number;
};

function Card({ id, title, column, order }: CardProps) {
  const [editing, toggleEditing] = useToggle(false);
  const contentEditableRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

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
      className="group/card relative"
      onClick={openSidePeek}
      data-type="card"
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
