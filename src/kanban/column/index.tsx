import { memo, useEffect, useRef, useState } from "react";
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

import { useAppDispatch, useAppSelector } from "@/store/store";
import { cn } from "@/utils/cn"
import { selectAllTasks, updateCard } from "@/store/taskSlice";
import { ColumnColors, ColumnType } from "../colors";

export type ColumnProps = {
  title: string;
  activeColumn: string;
  setActiveColumn: React.Dispatch<React.SetStateAction<string>>;
};

export type NewCardProps = {
  title: string;
  color: string;
  adding: boolean;
  toggleAdding: () => void;
};

export type ColumnHeaderProps = {
  title: string;
  columnColor: {
    bg: string;
    text: string;
    circle: string;
  };
  toggleAdding: () => void;
  total: number;
};

function Column({ title, activeColumn, setActiveColumn }: ColumnProps) {
  const [adding, setAdding] = useState<boolean>(false);

  const tasks = useAppSelector(selectAllTasks);
  const columnCards = tasks.filter((c) => c.column === title);

  const columnColor = ColumnColors[title as ColumnType];

  const toggleAdding = () => setAdding((p) => !p);
  const columnRef = useRef(null);
  const dispatch = useAppDispatch();

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
      className={cn(
        "min-h-full flex-1 min-w-[280px]  p-2 group rounded-md bg-[#1D2226]",
        activeColumn === title && "bg-sky-800"
      )}
      ref={columnRef}
    >
      {/* ******** Header */}
      <MemoizedColumnHeader
        title={title}
        columnColor={columnColor}
        total={columnCards.length}
        toggleAdding={toggleAdding}
      />

      {/* ******** The Cards */}
      <div className=" flex flex-col gap-2 mt-6">
        {columnCards.map((card) => (
          <Card key={card.id} {...card} color={columnColor.bg} />
        ))}
      </div>

      {/* ******** New Card */}
      <NewCard
        title={title}
        color={columnColor.text}
        adding={adding}
        toggleAdding={toggleAdding}
      />
    </div>
  );
}

export const ColumnHeader = ({
  title,
  columnColor,
  total,
  toggleAdding,
}: ColumnHeaderProps) => {
  return (
    <div className="flex">
      {/* The Pill */}
      <div
        className={`
          ${columnColor.bg} flex gap-1 items-center pl-[7px] pr-[9px] rounded-3xl`}
      >
        <div className={`${columnColor.circle} w-2 h-2 rounded-full`} />
        <h1 className="text-sm font-bold">{title}</h1>
      </div>

      {/* The Count */}
      <div className="ml-1 flex place-items-center">
        <button
          className={`
            ${columnColor.text} 
            text-sm py-1 px-2 hover:bg-gray-800 transition-colors rounded-md`}
        >
          {total}
        </button>
      </div>

      {/* The Divider */}
      <div className="flex-1"></div>

      {/* The buttons */}
      <div className="flex place-items-center">
        <button
          className={`${columnColor.text} text-sm py-1 px-2 hover:bg-gray-800 transition-colors rounded-md opacity-0  group-hover:opacity-100 font-extrabold`}
        >
          <HiOutlineDotsHorizontal size={23} />
        </button>
        <button
          className={`${columnColor.text} text-sm py-1 px-2 hover:bg-gray-800 transition-colors rounded-md opacity-0  group-hover:opacity-100 font-extrabold`}
          onClick={toggleAdding}
        >
          <MdAdd size={23} />
        </button>
      </div>
    </div>
  );
};

const MemoizedColumnHeader = memo(ColumnHeader);

export const NewCard = ({
  title,
  color,
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
          className={`${color} text-sm w-full p-2 flex gap-2 items-center mt-1.5 hover:bg-gray-800 transition-colors rounded-md font-semibold text-start`}
          onClick={toggleAdding}
        >
          <MdAdd size={18} /> New
        </button>
      )}
    </>
  );
};

export default Column;
