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
    <span className="absolute top-1.5 right-3 flex opacity-0 group-hover/card:opacity-100">
      <button
        title="Edit"
        className="bg-gray-700 py-2 px-2 rounded-s-lg hover:bg-gray-900"
        onClick={handleEdit}
      >
        <MdEdit />
      </button>

      <span className="w-[1px] bg-gray-500"></span>

      <button
        title="Delete"
        className="bg-gray-700 py-2 px-2 rounded-e-lg hover:bg-red-900"
        onClick={() => handleDelete(id)}
      >
        <MdDelete />
      </button>
    </span>
  );
}
