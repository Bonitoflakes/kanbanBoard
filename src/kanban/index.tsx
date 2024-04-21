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
      <div className="flex bg-primary w-full h-full gap-4 p-4 overflow-x-auto">
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
    </>
  );
}

export default Kanban;
