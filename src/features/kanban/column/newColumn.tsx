import { useAddColumnMutation } from "@/store/api";
import { useState } from "react";
import { MdAdd } from "react-icons/md";

export function NewColumn() {
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