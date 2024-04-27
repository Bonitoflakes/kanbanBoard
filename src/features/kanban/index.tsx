import { useState } from "react";
import invariant from "tiny-invariant";
import { useGetGroupedTasksQuery } from "@/store/api";

import Column from "./column/column";
import Sidebar from "./sidebar";
import { NewColumn } from "./column/newColumn";
import Header from "./header";
import { useToggle } from "@/utils/useToggle";
import { SidebarContextProvider } from "./sidebar/sidebarContext";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();
  const [activeColumn] = useState("");
  const [sidebar, toggleSidebar] = useToggle(true);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <SidebarContextProvider>
      <div className="flex h-full flex-col gap-4 bg-primary p-4">
        <Header />

        <div className="flex h-full gap-4 overflow-x-auto pr-1">
          {Object.entries(data).map(([key, value]) => (
            <Column key={key} activeColumn={activeColumn} {...value} />
          ))}

          <NewColumn />
        </div>
      </div>

      <Sidebar sidebar={sidebar} toggleSidebar={toggleSidebar} />
    </SidebarContextProvider>
  );
}

export default Kanban;
