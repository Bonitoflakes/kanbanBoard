import { MdDelete, MdEdit } from "react-icons/md";

type CardOptionsProps = {
  id: string;
  handleEdit: (e: { preventDefault: () => void }) => void;
  handleDelete: (id: string) => void;
};

export function CardOptions({
  id,
  handleEdit,
  handleDelete,
}: CardOptionsProps) {
  return (
    <span className="absolute right-3 top-1.5 flex opacity-0 group-hover/card:opacity-100">
      <button
        title="Edit"
        className="rounded-s-lg bg-primary/65 px-2 py-2 hover:bg-gray-800/70"
        onClick={handleEdit}
      >
        <MdEdit />
      </button>

      <span className="w-[1px] bg-gray-500"></span>

      <button
        title="Delete"
        className="rounded-e-lg bg-primary/65 px-2 py-2 hover:bg-red-800"
        onClick={() => handleDelete(id)}
      >
        <MdDelete />
      </button>
    </span>
  );
}
