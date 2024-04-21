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
  color: string;
};

// Custom DragPreview

function Card({ id, title, column, color }: CardProps) {
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
    <div className="relative group/card" ref={draggableRef}>
      <div
        className={cn(
          "active:cursor-grabbing text-sm w-full py-3 px-2 hover:bg-opacity-50 transition-colors rounded-md font-semibold text-start empty:before:content-['Untitled...'] empty:before:text-neutral-400 cursor-grab",
          editing && "cursor-auto",
          color
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
  );
}

export default Card;
