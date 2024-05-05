import { cn } from "@/utils/cn";
import SidePeek from "./sidepeek";
import { useParams } from "react-router-dom";

function SidePeekRenderer() {
  const { id } = useParams();

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[900px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        "slideinright",
      )}
      data-type="sidepeek"
    >
      {<SidePeek id={Number(id)} />}
    </div>
  );
}

export default SidePeekRenderer;
