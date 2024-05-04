import { useEffect, useState } from "react";
import { MdCloseFullscreen } from "react-icons/md";
import invariant from "tiny-invariant";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useGetGroupedTasksQuery, useUpdateTaskMutation } from "@/store/api";

type Card = {
  id: number;
  title: string;
  column: string;
  description: string;
  order: number;
};

function Settings({ cardData }: { cardData: Card }) {
  const [selectedColumn, setSelectedColumn] = useState<string>(cardData.column);
  const [selectedPos, setSelectedPos] = useState<number>(cardData.order);
  const { data: groupedTasks } = useGetGroupedTasksQuery();
  const [updateTask] = useUpdateTaskMutation();

  invariant(groupedTasks);

  const handleMove = () => {
    updateTask({ id: cardData.id, column: selectedColumn, order: selectedPos });
  };

  useEffect(() => {
    const isSameColumn = selectedColumn === cardData.column;
    const currentColumn = groupedTasks.find(
      ({ title }) => title === selectedColumn,
    );

    const currCount = currentColumn?.count ?? 0;

    const count = isSameColumn ? (currCount ? currCount : 1) : currCount + 1;

    const defaultPos = !isSameColumn ? count : cardData.order;
    setSelectedPos(defaultPos);
  }, [groupedTasks, selectedColumn, cardData.column, cardData.order]);

  const columnMap = groupedTasks.map(({ count, title }) => ({
    type: title,
    count,
  }));

  const calculatePositions = () => {
    const count = columnMap.find((d) => d.type === selectedColumn)?.count ?? 0;
    const isSameColumn = selectedColumn === cardData.column;
    const length = isSameColumn ? (count ? count : 1) : count + 1;

    return Array.from({ length: length }, (_, i) => i + 1);
  };

  const positionOptions = calculatePositions();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-md p-1.5 hover:bg-gray-100">
          <MdCloseFullscreen size={18} className="text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="min-w-48 rounded-md bg-secondary p-2"
        align="start"
        sideOffset={6}
        alignOffset={5}
      >
        <h2 className="text-md mb-6 text-center font-semibold text-primary">
          Move Card
        </h2>
        <p className="text-[12px] font-bold text-primary">Select Destination</p>

        <div className="mt-1 flex gap-2">
          <div className="group/list flex cursor-pointer flex-col rounded-md bg-gray-500 p-2 hover:bg-gray-600">
            <label
              htmlFor="List"
              className="w-full cursor-pointer text-[12px] leading-4 text-primary"
            >
              List
            </label>
            <select
              name="List"
              id="List"
              className="cursor-pointer appearance-none bg-gray-500 text-sm leading-5 text-primary group-hover/list:bg-gray-600"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {columnMap.map(({ type, count }) => (
                <option value={type} key={type}>
                  {type} ({count})
                </option>
              ))}
            </select>
          </div>

          <div className="group/list flex cursor-pointer flex-col rounded-md bg-gray-500 p-2 hover:bg-gray-600">
            <label
              htmlFor="Position"
              className="w-full cursor-pointer text-[12px] leading-4 text-primary"
            >
              Position
            </label>
            <select
              name="Position"
              id="Position"
              className="cursor-pointer appearance-none bg-gray-500 text-sm leading-5 text-primary group-hover/list:bg-gray-600"
              value={selectedPos}
              onChange={(e) => setSelectedPos(Number(e.target.value))}
            >
              {positionOptions.map((pos) => {
                const isSameColumn = selectedColumn === cardData.column;
                const isCurrent = pos === cardData.order && isSameColumn;

                return (
                  <option value={pos} key={pos}>
                    {pos} {isCurrent && "(current)"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <button
          className="mt-1.5 flex w-full items-center justify-center rounded-md bg-primary p-2 text-sm font-semibold text-secondary"
          onClick={handleMove}
        >
          Move Card
        </button>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default Settings;
