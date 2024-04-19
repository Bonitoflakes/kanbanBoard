import { useState } from "react";
import Column from "./column";
import { useAppSelector } from "@/store/store";
import { getAllColumns } from "@/store/taskSlice";

function Kanban() {
  const columns = useAppSelector(getAllColumns);
  const [activeColumn, setActiveColumn] = useState("");

  return (
    <>
      <div className="flex bg-[#191919] w-full h-full gap-4 p-4 overflow-x-auto">
        {columns.map((column) => (
          <Column
            key={column}
            title={column}
            activeColumn={activeColumn}
            setActiveColumn={setActiveColumn}
          />
        ))}
      </div>
    </>
  );
}

export default Kanban;
