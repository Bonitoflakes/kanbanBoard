import { useState } from "react";
import { ColumnType, TextAreaColors } from "../colors";
import { useAddTaskMutation } from "@/store/api";
import { cn } from "@/utils/cn";

type AddCardProps = {
  column: string;
  adding: boolean;
  toggleAdding: () => void;
};

export function AddCard({ adding, toggleAdding, column }: AddCardProps) {
  const [addCard] = useAddTaskMutation();
  const [value, setValue] = useState("");
  const columnColors = TextAreaColors[column as ColumnType];

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    addCard({
      title: value.trim(),
      column,
    });

    setValue("");
    toggleAdding();
  };

  return (
    <>
      {adding && (
        <textarea
          onBlur={handleSubmit}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          placeholder="Add new task..."
          className={cn(
            columnColors.bg,
            columnColors.border,
            "placeholder-slate-200 w-full rounded border mt-2 p-3 text-sm text-neutral-50  focus:outline-0 focus-visible:outline-0 resize-none contentEditable"
          )}
        />
      )}
    </>
  );
}
