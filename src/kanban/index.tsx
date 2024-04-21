import { useState } from "react";
import Column from "./column";
import { useGetGroupedTasksQuery } from "@/store/api";
import invariant from "tiny-invariant";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [activeColumn, setActiveColumn] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <>
      <div className="flex flex-col w-full h-full gap-4 p-4 overflow-x-auto bg-primary">
        <div className="flex">
          <h1 className="pl-2 font-sans text-3xl font-bold">Kanban Board</h1>
        </div>

        <div className="flex gap-4">
          {Object.entries(data).map(([key, value]) => (
            <Column
              key={key}
              columnColor={value.colorSpace}
              cards={value.cards}
              title={value.title}
              activeColumn={activeColumn}
              setActiveColumn={setActiveColumn}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Kanban;
