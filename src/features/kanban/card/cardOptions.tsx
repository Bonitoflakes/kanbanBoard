import { MdDelete, MdEdit } from "react-icons/md";

type CardOptionsProps = {
  handleEdit: (e: React.MouseEvent) => void;
  handleDelete: (e: React.MouseEvent) => void;
};

export const CardOptions = ({ handleEdit, handleDelete }: CardOptionsProps) => {
  return (
    <span className="absolute right-3 top-1.5 flex opacity-0 group-hover/card:opacity-100">
      <button
        title="Edit"
        className="rounded-s-lg bg-primary px-2 py-2 hover:bg-gray-400 dark:hover:bg-gray-600"
        onClick={handleEdit}
      >
        <MdEdit className="text-secondary" />
      </button>

      <span className="w-[1px] bg-gray-500"></span>

      <button
        title="Delete"
        className=" rounded-e-lg bg-primary px-2 py-2 hover:bg-red-400 dark:hover:bg-red-800"
        onClick={handleDelete}
      >
        <MdDelete className="text-secondary " />
      </button>
    </span>
  );
}
