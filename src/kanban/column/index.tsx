import { useEffect, useRef, useState } from "react";
import Card from "@/kanban/card";
import { AddCard } from "./addCard";
import { MdAdd } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import {
  BaseEventPayload,
  ElementDragType,
  DropTargetLocalizedData,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { cn } from "@/utils/cn";
import { updateCard } from "@/store/taskSlice";
import { useAppDispatch } from "@/store/store";

export type ColumnProps = {
  title: string;
  activeColumn: string;
  setActiveColumn: React.Dispatch<React.SetStateAction<string>>;
  columnColor: string;
  cards: { id: string; title: string; column: string }[];
};

export type NewCardProps = {
  title: string;
  adding: boolean;
  toggleAdding: () => void;
};

export type ColumnHeaderProps = {
  title: string;
  toggleAdding: () => void;
  total: number;
};

function Column({
  title,
  activeColumn,
  setActiveColumn,
  cards,
  columnColor,
}: ColumnProps) {
  const [adding, setAdding] = useState<boolean>(false);
  const columnRef = useRef(null);
  const dispatch = useAppDispatch();

  const columnCards = cards.filter((c) => c.column === title);
  const toggleAdding = () => setAdding((p) => !p);

  useEffect(() => {
    const el = columnRef.current;
    invariant(el);

    const handleDrop = (
      args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData
    ) => {
      const { source, self } = args;
      const origin = source.data.origin;
      const id = source.data.id as string;
      const destination = self.data.destination as string;

      if (!origin || !destination || !id) {
        throw new Error("something is missing");
      }

      if (origin === destination) return console.log("Same same");

      dispatch(
        updateCard({
          id,
          changes: {
            column: destination,
          },
        })
      );
    };

    return dropTargetForElements({
      element: el,
      canDrop: () => true,
      getData: () => ({
        destination: title,
      }),
      onDragStart: (args) => {
        const column = args.self.data.destination as string;
        setActiveColumn(column);
      },
      onDragEnter: (args) => {
        const column = args.self.data.destination as string;
        setActiveColumn(column);
      },
      onDragLeave: (args) => {
        const column = args.self.data.destination as string;
        setActiveColumn(column);
      },
      onDrop: (args) => {
        console.log("Column Drop: ", args);
        handleDrop(args);
        setActiveColumn("");
      },
    });
  }, [dispatch, title, setActiveColumn]);

  return (
    <div
      data-theme={columnColor}
      className={cn(
        "flex-1 min-w-[280px] h-fit p-2 group rounded-md bg-accent-3",
        activeColumn === title && "bg-sky-800"
      )}
      ref={columnRef}
    >
      {/* ******** Header */}
      <ColumnHeader
        title={title}
        total={columnCards.length}
        toggleAdding={toggleAdding}
      />

      {/* ******** The Cards */}
      <div className=" flex flex-col gap-[5px] mt-6">
        {columnCards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>

      {/* ******** New Card */}
      <NewCard title={title} adding={adding} toggleAdding={toggleAdding} />
    </div>
  );
}

export const ColumnHeader = ({
  title,
  total,
  toggleAdding,
}: ColumnHeaderProps) => {
  return (
    <div className="flex">
      {/* The Pill */}
      <div className="flex gap-1 items-center pl-[7px] pr-[9px] rounded-3xl bg-accent-2">
        <div className="w-2 h-2 rounded-full bg-accent-1" />
        <h1 className="text-sm font-bold mt-[-2px]">{title}</h1>
      </div>

      {/* The Count */}
      <div className="ml-1 flex place-items-center">
        <button className="text-accent-1 text-sm py-1 px-2 rounded-md cursor-auto">
          {total}
        </button>
      </div>

      {/* The Divider */}
      <div className="flex-1"></div>

      {/* The buttons */}
      <div className="flex place-items-center">
        <button className="text-sm py-1 px-2 hover:bg-accent-2/35 transition-colors rounded-md opacity-0  group-hover:opacity-100 font-extrabold text-accent-1">
          <HiOutlineDotsHorizontal size={18} />
        </button>
        <button
          className="text-sm py-1 px-2 hover:bg-accent-2/35 transition-colors rounded-md opacity-0  group-hover:opacity-100 font-extrabold text-accent-1"
          onClick={toggleAdding}
        >
          <MdAdd size={18} />
        </button>
      </div>
    </div>
  );
};

export const NewCard = ({ title, adding, toggleAdding }: NewCardProps) => {
  return (
    <>
      {/* *********  New Card */}
      <AddCard column={title} adding={adding} toggleAdding={toggleAdding} />

      {/* New Button */}
      {!adding && (
        <button
          className="text-sm w-full p-2 flex gap-2 items-center mt-1.5 hover:bg-accent-2/25 transition-colors duration-200 rounded-md font-semibold text-start text-accent-1"
          onClick={toggleAdding}
        >
          <MdAdd size={18} /> New
        </button>
      )}
    </>
  );
};

export default Column;
