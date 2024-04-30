import { useGetGroupedTasksQuery, useUpdateTaskMutation } from "@/store/api";
import * as D from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { MdCloseFullscreen } from "react-icons/md";
import invariant from "tiny-invariant";

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
    updateTask({
      id: cardData.id,
      column: selectedColumn,
      order: selectedPos,
    });
  };

  const isSameColumn = selectedColumn === cardData.column;

  const formattedData = Object.entries(groupedTasks).map(
    ([column, { count }]) => ({ type: column, count }),
  );

  const calculatePositions = () => {
    const count =
      formattedData.find((d) => d.type === selectedColumn)?.count ?? 0;
    return isSameColumn ? (count ? count : 1) : count + 1;
  };

  const positionOptions = Array(calculatePositions()).fill(1);
  const defaultPos = !isSameColumn ? positionOptions.length : cardData.order;

  useEffect(() => {
    setSelectedPos(defaultPos);
  }, [defaultPos]);

  return (
    <D.Root defaultOpen>
      <D.Trigger asChild>
        <button className="rounded-md p-1.5 hover:bg-gray-100">
          <MdCloseFullscreen size={18} className="text-gray-500" />
        </button>
      </D.Trigger>

      <D.Content
        className="rounded-md bg-secondary p-2"
        align="start"
        sideOffset={6}
        alignOffset={5}
      >
        <h2 className="text-md mb-6 text-center font-semibold text-primary">
          Move Card
        </h2>

        <p className="text-[12px] font-bold text-primary">Select Destination</p>

        <div className="parent mt-1 flex gap-2">
          <div className="flex flex-col rounded-md bg-gray-300 p-2">
            <label
              htmlFor="List"
              className="text-[12px] leading-4 text-primary"
            >
              List
            </label>

            <select
              name="List"
              id="List"
              className="bg-gray-300 text-sm leading-5 text-primary"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {formattedData.map(({ type, count }) => (
                <option value={type} key={type}>
                  {type} ({count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col rounded-md bg-gray-300 p-2">
            <label
              htmlFor="Position"
              className="text-[12px] leading-4 text-primary"
            >
              Position
            </label>

            <select
              name="Position"
              id="Position"
              className="bg-gray-300 text-sm leading-5 text-primary"
              value={selectedPos}
              onChange={(e) => setSelectedPos(Number(e.target.value))}
            >
              {positionOptions.map((_, index) => {
                const pos = index + 1;
                const isSame = pos === cardData.order && isSameColumn;
                return (
                  <option value={pos} key={pos}>
                    {pos} {isSame && "(current)"}
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
      </D.Content>
    </D.Root>
  );
}

export default Settings;
