import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useAddTaskMutation } from "../card/card.api";
import { cn } from "@/utils/cn";

type AddCardProps = {
  columnType: string;
  toggleAdding: () => void;
};

type NewCardProps = {
  title: string;
  adding: boolean;
  toggleAdding: () => void;
};

export const NewCardButton = ({
  title,
  adding,
  toggleAdding,
}: NewCardProps) => {
  return (
    <div
      className={cn("bottom-0 z-50 bg-accent-3 p-2 pt-1", {
        sticky: !adding,
      })}
    >
      {adding && <AddCard columnType={title} toggleAdding={toggleAdding} />}

      {!adding && (
        <button
          className="flex w-full items-center gap-2 rounded-md p-2  text-start
            text-sm font-semibold text-accent-1 transition-colors duration-200 hover:bg-accent-2/75 dark:hover:bg-accent-1/20"
          onClick={toggleAdding}
        >
          <MdAdd size={18} /> New
        </button>
      )}
    </div>
  );
};

const AddCard = ({ columnType, toggleAdding }: AddCardProps) => {
  const [value, setValue] = useState("");
  const [addCard] = useAddTaskMutation();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    addCard({
      title: value.trim(),
      column: columnType,
    });

    setValue("");
    toggleAdding();
  };

  return (
    <>
      <textarea
        onBlur={handleSubmit}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        placeholder="Add new task..."
        className="w-full resize-none rounded bg-accent-2 p-2 text-sm font-semibold text-secondary placeholder-slate-400 ring-accent-1/30  focus-visible:border focus-visible:border-accent-1 focus-visible:outline-none dark:placeholder-slate-200"
      />
    </>
  );
}
