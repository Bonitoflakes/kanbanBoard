import { useRef } from "react";
import invariant from "tiny-invariant";
import { CardOptions } from "@/features/kanban/card/cardOptions";
import moveCaretToEnd from "@/utils/moveCaret";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/store/api";
import { cn } from "@/utils/cn";
import { useToggle } from "@/utils/useToggle";
import { useNavigate } from "react-router-dom";

type CardProps = {
  id: number;
  title: string;
  column: string;
};

function Card({ id, title, column }: CardProps) {
  const [editing, toggleEditing] = useToggle(false);
  const contentEditableRef = useRef(null);
  const navigate = useNavigate();

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleEdit = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleEditing();

    requestAnimationFrame(() => {
      invariant(contentEditableRef.current);
      moveCaretToEnd(contentEditableRef.current);
    });
  };

  const handleSave = (e: FocusEvent) => {
    e.stopPropagation();

    toggleEditing();
    updateTask({
      id: id,
      title: String((e.target as HTMLDivElement).innerText).trim(),
      column: column,
    });
  };

  const handleDelete = () => deleteTask(id);
  const openSidePeek = () => navigate(`/sidepeek/${id}`);

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
          )}
          contentEditable={editing}
          suppressContentEditableWarning={true}
          ref={contentEditableRef}
          //  @ts-expect-error: TODO: Fix types
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
