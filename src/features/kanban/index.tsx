import { useState } from "react";
import invariant from "tiny-invariant";
import { toggleTheme } from "@/utils/theme";
import { useAddColumnMutation, useGetGroupedTasksQuery } from "@/store/api";

import Column from "./column";
import { MdAdd } from "react-icons/md";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [activeColumn, setActiveColumn] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <>
      <div className="flex h-full flex-col gap-4 bg-primary p-4">
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

        <div className="flex h-full gap-4 overflow-x-auto pr-1">
          {Object.entries(data).map(([key, value]) => (
            <Column
              key={key}
              id={Number(value.id)}
              columnColor={value.colorSpace}
              cards={value.cards}
              title={value.title}
              activeColumn={activeColumn}
            />
          ))}

          <NewColumn />
        </div>
      </div>
    </>
  );
}

function NewColumn() {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const [addColumn] = useAddColumnMutation();

  const toggleAdd = () => setAdding((p) => !p);

  const handleSave = () => {
    if (!value) return toggleAdd();

    addColumn({
      title: value,
      colorSpace: "gray",
    });

    setValue("");
    toggleAdd();
  };

  return (
    <div className=" h-fit min-w-[280px]">
      {!adding && (
        <button
          className="flex w-full items-center rounded-md bg-secondary/10 p-2 py-2.5 font-bold text-secondary hover:bg-secondary/30"
          onClick={toggleAdd}
        >
          <MdAdd /> <span className="ml-1">Add another list</span>
        </button>
      )}

      {adding && (
        <textarea
          autoFocus
          onBlur={handleSave}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter list title..."
          className="mt-2.5 w-full resize-none rounded bg-accent-2 p-3 text-sm font-semibold text-secondary   placeholder-slate-400 ring-accent-1/30 focus-visible:outline-none focus-visible:outline-accent-1 focus-visible:ring-1 dark:placeholder-slate-200"
        />
      )}
    </div>
  );
}

export default Kanban;
