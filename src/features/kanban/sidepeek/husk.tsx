import { cn } from "@/utils/cn";
import { useSidebar } from "./sidePeekContext";
import { useState } from "react";
import SidePeek from "./sidepeek";

function SidePeekRenderer() {
  const { sidebar } = useSidebar();
  const [hasToggled, setHasToggled] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[1120px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        sidebar ? "slideinright" : hasToggled && "slideoutright",
      )}
      data-type="sidebar"
    >
      {sidebar && <SidePeek setHasToggled={setHasToggled} />}
    </div>
  );
}

export default SidePeekRenderer;
