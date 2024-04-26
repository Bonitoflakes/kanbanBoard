import { MdAdd } from "react-icons/md";
import { AddCard } from "./addCard";

export type NewCardProps = {
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
      {/* *********  New Card */}
      <AddCard column={title} adding={adding} toggleAdding={toggleAdding} />

      {/* New Button */}
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
