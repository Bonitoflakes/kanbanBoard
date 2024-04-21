import { useState } from "react";
import { useAddTaskMutation } from "@/store/api";

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
          className="mt-2.5 w-full resize-none rounded bg-accent-2 p-3 text-sm text-secondary   placeholder-slate-400 ring-accent-1/30 focus-visible:outline-none focus-visible:outline-accent-1 focus-visible:ring-1 dark:placeholder-slate-200"
        />
      )}
    </>
  );
}
