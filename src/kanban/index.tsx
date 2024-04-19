import { useState } from "react";
import Column from "./column";
import {  useGetTasksQuery } from "@/store/api";
import invariant from "tiny-invariant";

function Kanban() {
  const { data, isLoading, isError, error } = useGetTasksQuery();
  const [activeColumn, setActiveColumn] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);
  console.log(data)

  return (
    <>
      <div className="flex bg-[#191919] w-full h-full gap-4 p-4 overflow-x-auto">
        {data.map((column) => (
          <Column
            key={column.title}
            cards={column.cards}
            title={column.column}
            activeColumn={activeColumn}
            setActiveColumn={setActiveColumn}
          />
        ))}
      </div>
    </>
  );
}

export default Kanban;
