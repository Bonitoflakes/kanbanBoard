import { useState } from "react";
import invariant from "tiny-invariant";
import { toggleTheme } from "@/utils/theme";
import { useGetGroupedTasksQuery } from "@/store/api";

import Column from "./column";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [activeColumn, setActiveColumn] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <>
      <div className="flex h-full w-full flex-col gap-4 overflow-x-auto bg-primary p-4">
        <div className="flex justify-between">
          <h1 className="pl-2 font-sans text-3xl font-bold text-secondary">
            Kanban Board
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => toggleTheme("dark")}
              className="rounded-md border border-secondary px-4 py-1 font-bold text-secondary"
            >
              Dark
            </button>
            <button
              onClick={() => toggleTheme("light")}
              className="rounded-md border border-secondary px-4 py-1 font-bold text-secondary"
            >
              Light
            </button>
            <button
              onClick={() => toggleTheme("system")}
              className="rounded-md border border-secondary px-4 py-1 font-bold text-secondary"
            >
              System
            </button>
          </div>
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
