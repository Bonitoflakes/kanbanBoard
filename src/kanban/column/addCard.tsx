import { useState } from "react";
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
            // columnColors.bg,
            // columnColors.border,
            "placeholder-slate-200 w-full rounded mt-2.5 p-3 text-sm text-neutral-50   focus-visible:outline-accent-1 focus-visible:outline-none focus-visible:ring-1 ring-accent-1/30 resize-none bg-accent-2"
          )}
        />
      )}
    </>
  );
}
