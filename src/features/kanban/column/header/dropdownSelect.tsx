import * as Select from "@radix-ui/react-select";
import { ReactNode, useState } from "react";
import invariant from "tiny-invariant";
import {
  useUpdateColumnMutation,
  useGetGroupedTasksQuery,
} from "../column.api";

type DropdownSelectProps = {
  children: ReactNode;
  columnID: number;
  columnOrder: number;
  togglePopover: (value?: boolean | undefined) => void;
};

export const DropdownSelect = ({
  children,
  columnID,
  columnOrder,
  togglePopover,
}: DropdownSelectProps) => {
  const [selectedPos, setSelectedPos] = useState<number>(columnOrder);
  const [updateColumn] = useUpdateColumnMutation();

  const { data: groupedTasks } = useGetGroupedTasksQuery();
  invariant(groupedTasks);

  const handleMove = () => {
    updateColumn({ id: columnID, order: selectedPos });
    togglePopover(false);
  };

  const columnMap = groupedTasks.map(({ title, order }) => ({
    type: title,
    order,
  }));

  const positionOptions = Array.from(
    { length: columnMap.length },
    (_, i) => i + 1,
  );

  return (
    <Select.Root>
      <Select.Trigger asChild>{children}</Select.Trigger>

      <Select.Content>
        <div className="flex min-w-52 flex-col rounded-md bg-indigo-300 p-2">
          <label
            htmlFor="Position"
            className="py-1 text-[12px] leading-4 text-primary"
          >
            Position
          </label>

          <select
            name="Position"
            id="Position"
            className="appearance-none bg-indigo-300 text-sm leading-5 text-primary"
            value={selectedPos}
            onChange={(e) => setSelectedPos(Number(e.target.value))}
          >
            {positionOptions.map((pos) => {
              return (
                <option value={pos} key={pos}>
                  {pos}
                </option>
              );
            })}
          </select>

          <button
            className="mt-1.5 flex w-full items-center justify-center rounded-md bg-primary p-2 text-sm font-semibold text-secondary"
            onClick={handleMove}
          >
            Move Column
          </button>
        </div>
      </Select.Content>
    </Select.Root>
  );
};
