import { ReactNode, useEffect, useState } from "react";
import { MdMoveUp } from "react-icons/md";
import invariant from "tiny-invariant";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";
import { useUpdateTaskMutation } from "../card/card.api";
import { useGetGroupedTasksQuery } from "../column/column.api";
import { useToggle } from "@/utils/useToggle";

type Card = {
  id: number;
  column: string;
  order: number;
};

type DropdownSelector = {
  label: string;
  value: string | number;
  children: ReactNode;
  //  TODO: fix types
  onChange: (e: { target: { value: string } }) => void;
  className?: string;
};

const DropdownSelector = ({
  label,
  value,
  children,
  onChange,
  className,
}: DropdownSelector) => {
  return (
    <div className="group/list flex cursor-pointer flex-col rounded-md bg-gray-500 p-2 hover:bg-gray-600">
      <label
        htmlFor={label}
        className="w-full cursor-pointer text-[12px] leading-4 text-primary"
      >
        {label}
      </label>

      <select
        name={label}
        id={label}
        value={value}
        onChange={onChange}
        className={cn(
          "min-w-14 cursor-pointer appearance-none bg-gray-500 text-sm leading-5 text-primary group-hover/list:bg-gray-600",
          className,
        )}
      >
        {children}
      </select>
    </div>
  );
};

function Settings({
  id,
  column,
  order,
  refetch,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Card & { refetch: () => any }) {
  const [selectedColumn, setSelectedColumn] = useState<string>(column);
  const [selectedPos, setSelectedPos] = useState<number>(order);
  const [isDropdownOpen, toggleDropdown] = useToggle(false);

  const { data: groupedTasks } = useGetGroupedTasksQuery();
  invariant(groupedTasks);

  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    setSelectedColumn(column);
    setSelectedPos(order);
  }, [column, order]);

  useEffect(() => {
    const currIndex = groupedTasks.findIndex(
      ({ title }) => title === selectedColumn,
    );
    const currCount = currIndex !== -1 ? groupedTasks[currIndex].count : 0;
    const isSameColumn = selectedColumn === column;
    const defaultPos = isSameColumn ? order : currCount + 1;
    setSelectedPos(defaultPos);
  }, [groupedTasks, selectedColumn, column, order]);

  const columnMap = groupedTasks.map(({ count, title }) => ({
    title,
    count,
  }));

  const handleMove = () => {
    updateTask({
      id,
      column: selectedColumn,
      order: selectedPos,
    });

    toggleDropdown();
    refetch();
  };

  const generatePositions = () => {
    const columnIndex = columnMap.findIndex((d) => d.title === selectedColumn);
    invariant(columnIndex !== -1, "Column not found");
    const count = columnMap[columnIndex].count;
    const isSameColumn = selectedColumn === column;
    const length = isSameColumn ? count : count + 1;

    return Array.from({ length: length }, (_, i) => i + 1);
  };

  const positionOptions = generatePositions();

  return (
    <DropdownMenu.Root open={isDropdownOpen} onOpenChange={toggleDropdown}>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-md p-1.5 hover:bg-gray-100">
          <MdMoveUp size={18} className="text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="min-w-48 rounded-md bg-secondary p-2.5"
        align="start"
        sideOffset={6}
        alignOffset={5}
      >
        <h2 className="text-md mb-6 text-center font-semibold text-primary">
          Move Card
        </h2>
        <p className="text-[12px] font-bold text-primary">Select Destination</p>

        <div className="mt-1 flex gap-2">
          <DropdownSelector
            label="Column"
            value={selectedColumn}
            // TODO: fix types
            onChange={(e: { target: { value: string } }) =>
              setSelectedColumn(e.target.value)
            }
            className="min-w-32"
          >
            {columnMap.map(({ title, count }) => (
              <option value={title} key={title}>
                {title} ({count})
              </option>
            ))}
          </DropdownSelector>

          <DropdownSelector
            label="Position"
            value={selectedPos}
            // TODO: fix types
            onChange={(e: { target: { value: string } }) =>
              setSelectedPos(Number(e.target.value))
            }
          >
            {positionOptions.map((pos) => {
              const isSameColumn = selectedColumn === column;
              const isCurrent = pos === order && isSameColumn;

              return (
                <option value={pos} key={pos}>
                  {pos} {isCurrent && "(current)"}
                </option>
              );
            })}
          </DropdownSelector>
        </div>

        <button
          className="mt-2.5 flex w-full items-center justify-center rounded-md bg-primary p-2 text-sm font-semibold text-secondary"
          onClick={handleMove}
        >
          Move Card
        </button>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default Settings;
