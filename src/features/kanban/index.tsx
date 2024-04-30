import { memo, useState } from "react";
import invariant from "tiny-invariant";
import { useGetGroupedTasksQuery } from "@/store/api";

import Column from "./column/column";
import { NewColumn } from "./column/newColumn";
import Header from "./header";
import SidePeekRenderer from "./sidepeek/husk";

const Kanban = memo(function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [activeColumn] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <>
      <div className="flex h-full flex-col gap-4 bg-primary p-4">
        <Header />

        <div className="flex h-full gap-4 overflow-x-auto pr-1">
          {Object.entries(data).map(([key, value]) => {
            return <Column key={key} activeColumn={activeColumn} {...value} />;
          })}

          <NewColumn />
        </div>
      </div>

      <SidePeekRenderer />
    </>
  );
});

export default Kanban;
