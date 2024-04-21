import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { CardOptions } from "@/components/cardOptions";
import moveCaretToEnd from "@/utils/moveCaret";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/store/api";
import { cn } from "@/utils/cn";

type CardProps = {
  id: string;
  title: string;
  column: string;
};

// Custom DragPreview

function Card({ id, title, column }: CardProps) {
  const [editing, setEditing] = useState(false);

  const contentEditableRef = useRef(null);
  const draggableRef = useRef(null);

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    const el = draggableRef.current;
    invariant(el);
  }, []);

  const handleEdit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEditing((p) => !p);

    requestAnimationFrame(() => {
      invariant(contentEditableRef.current);
      moveCaretToEnd(contentEditableRef.current);
    });
  };

  const handleSave = (e: { target: { innerText: string } }) => {
    setEditing((p) => !p);

    updateTask({
      id: id,
      title: String(e.target.innerText).trim() || "",
      column: column,
    });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  return (
    <div className="group/card relative" ref={draggableRef}>
      <div className="rounded-md bg-accent-2 transition-colors hover:bg-accent-1/35">
        <div
          className={cn(
            "w-full cursor-grab rounded-md px-2 py-3 text-start text-sm font-semibold text-secondary empty:before:text-neutral-400 empty:before:content-['Untitled...'] active:cursor-grabbing dark:empty:before:text-neutral-400",
            editing && "cursor-auto",
          )}
          contentEditable={editing}
          suppressContentEditableWarning={true}
          ref={contentEditableRef}
          onBlur={handleSave}
        >
          {title}
        </div>

        {!editing && (
          <CardOptions
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            id={id}
          />
        )}
      </div>
    </div>
  );
}

export default Card;
