import invariant from "tiny-invariant";

import Header from "./header";
import Column from "./column";
import { NewColumn } from "./column/newColumn";
import { useGetGroupedTasksQuery } from "./column/column.api";
import SidepeekHusk from "./sidepeek/husk";

function Kanban() {
  const { data, isLoading, isError, error } = useGetGroupedTasksQuery();

  // TODO: Better strategy for these states.
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  invariant(data);

  return (
    <div className="flex h-full flex-col gap-4 bg-primary p-4">
      <Header />

      <div className="flex h-full gap-4 overflow-x-auto pr-1">
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
