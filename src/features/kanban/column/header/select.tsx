import { useGetGroupedTasksQuery, useUpdateColumnMutation } from "@/store/api";
import * as S from "@radix-ui/react-select";
import { ReactNode, useState } from "react";
import invariant from "tiny-invariant";

export const Select = ({
  children,
  columnID,
  columnOrder,
}: {
  children: ReactNode;
  columnID: number;
  columnOrder: number;
}) => {
  const [selectedPos, setSelectedPos] = useState<number>(columnOrder);
  const { data: groupedTasks } = useGetGroupedTasksQuery();
  const [updateColumn] = useUpdateColumnMutation();

  const handleMove = () => {
    updateColumn({ id: columnID, order: selectedPos });
  };

  invariant(groupedTasks);

  const columnMap = Object.values(groupedTasks).map(({ title, order }) => ({
    type: title,
    order,
  }));

  const positionOptions = Array.from(
    { length: columnMap.length },
    (_, i) => i + 1,
  );

  return (
    <S.Root>
      <S.Trigger asChild>{children}</S.Trigger>

      <S.Content>
        <div className="flex min-w-52 flex-col rounded-md bg-gray-300 p-2">
          <label
            htmlFor="Position"
            className="py-1 text-[12px] leading-4 text-primary"
          >
            Position
          </label>

          <select
            name="Position"
            id="Position"
            className="appearance-none bg-gray-300 text-sm leading-5 text-primary"
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
      </S.Content>
    </S.Root>
  );
};
