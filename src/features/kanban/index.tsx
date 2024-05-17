import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

import { useToggle } from "@/utils/useToggle";
import { cn } from "@/utils/cn";

import {
  useGetGroupedTasksQuery,
  useUpdateColumnMutation,
} from "./column/column.api";
import { useAppDispatch } from "@/store/store";
import { CardAPI, useUpdateTaskMutation } from "./card/card.api";

import Header from "./header";
import Column from "./column";
import { NewColumn } from "./column/newColumn";
import SidepeekHusk from "./sidepeek/husk";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [updateColumn] = useUpdateColumnMutation();
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useAppDispatch();

  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [isOpen, toggleWidth] = useToggle();
  const [touched, toggleTouched] = useToggle();

  const [searchParams] = useSearchParams();
  const selectedCard = searchParams.get("selectedCard");

  useEffect(() => {
    if (selectedCard) {
      toggleWidth(true);
      toggleTouched(true);
    } else toggleWidth(false);
  }, [selectedCard, toggleWidth, toggleTouched]);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => {
        return source.data.type === "column" || source.data.type === "card";
      },

      onDrop: (args) => {
        const origin = args.source.data;
        const destination = args.location.current.dropTargets[0].data;

        console.log(args);
        console.group("____________________________");
        console.log("ORIGIN:", origin);
        console.log("DESTINATION:", destination);
        console.groupEnd();

        if (origin.type === "column" && destination.type === "column") {
          console.log("🚀🚀🚀 ~ COLUMN --- COLUMN");
          updateColumn({
            id: origin.id as number,
            order: destination.order as number,
          });
          updateActiveColumn("");
          return;
        }

        if (origin.type === "card" && destination.type === "card") {
          console.log("🚀🚀🚀 ~ CARD --- CARD");
          updateTask({
            id: origin.id as number,
            order: destination.order as number,
            column: destination.column as string,
          });
          dispatch(
            CardAPI.util.updateQueryData(
              "getTask",
              origin.id as number,
              (draft) => {
                draft.column = destination.column as string;
                draft.order = destination.order as number;
              },
            ),
          );
          updateActiveColumn("");
          return;
        }

        if (origin.type === "card" && destination.type === "column") {
          console.log("🚀🚀🚀 ~ CARD --- COLUMN");

          invariant(data, "No data");
          const destinationColumnIndex = data.findIndex(
            (lane) => lane.title === (destination.title as string),
          );

          invariant(destinationColumnIndex !== -1, "Column not found");
          const destinationColumnCardsLength =
            data[destinationColumnIndex].cards.length + 1;

          updateTask({
            id: origin.id as number,
            column: destination.title as string,
            order: destinationColumnCardsLength,
          });
          updateActiveColumn("");
        }
      },
    });
  }, [updateColumn, updateTask, dispatch, data]);

  const updateActiveColumn = (column: string) => setActiveColumn(column);

  // TODO: Better strategy for these states.
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <div className="flex h-full flex-col gap-4 bg-primary">
      <Header />

      <div
        className={cn(
          "flex h-full w-full gap-4 overflow-x-auto p-4 pr-1 transition-all",
          {
            reduceWidth: isOpen,
            increaseWidth: !isOpen && touched,
          },
        )}
      >
        {data.map((value) => {
          return (
            <Column
              key={value.id}
              title={value.title}
              activeColumn={activeColumn}
              updateActiveColumn={updateActiveColumn}
            />
          );
        })}

        <NewColumn />
      </div>

      <SidepeekHusk />
    </div>
  );
}

export default Kanban;
