import { useState } from "react";
import { useAddTaskMutation } from "@/store/api";
import { MdAdd } from "react-icons/md";

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
    <>
      {adding && <AddCard columnType={title} toggleAdding={toggleAdding} />}

      {!adding && (
        <button
          className="mt-1.5 flex w-full items-center gap-2 rounded-md p-2 text-start
            text-sm font-semibold text-accent-1 transition-colors duration-200 hover:bg-accent-2/75 dark:hover:bg-accent-1/20"
          onClick={toggleAdding}
        >
          <MdAdd size={18} /> New
        </button>
      )}
    </>
  );
};

function AddCard({ toggleAdding, columnType }: AddCardProps) {
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
        className="mt-2.5 w-full resize-none rounded bg-accent-2 p-3 text-sm font-semibold text-secondary   placeholder-slate-400 ring-accent-1/30 focus-visible:outline-none focus-visible:outline-accent-1 focus-visible:ring-1 dark:placeholder-slate-200"
      />
    </>
  );
}
