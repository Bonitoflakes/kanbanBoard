import invariant from "tiny-invariant";

import Header from "./header";
import Column from "./column";
import { NewColumn } from "./column/newColumn";
import { useGetGroupedTasksQuery } from "./column/column.api";
import SidepeekHusk from "./sidepeek/husk";
import { useSearchParams } from "react-router-dom";
import { useToggle } from "@/utils/useToggle";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [isOpen, toggleWidth] = useToggle(false);

  const [searchParams] = useSearchParams();
  const selectedCard = searchParams.get("selectedCard");

  useEffect(() => {
    if (selectedCard) toggleWidth(true);
    else toggleWidth(false);
  }, [selectedCard, toggleWidth]);

  // TODO: Better strategy for these states.
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <div className="flex h-full flex-col gap-4 bg-primary p-4">
      <Header />

      <div
        className={cn(
          "flex h-full w-full gap-4 overflow-x-auto pr-1 transition-all duration-200",
          {
            "w-[calc(100%-900px)]": isOpen,
          },
        )}
      >
        {data.map((value) => {
          return <Column key={value.id} type={value.title} />;
        })}

        <NewColumn />
      </div>

      <SidepeekHusk />
    </div>
  );
}

export default Kanban;
