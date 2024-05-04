import { cn } from "@/utils/cn";
import { useToggle } from "@/utils/useToggle";
import { useSidepeek } from "./sidePeekContext";
import SidePeek from "./sidepeek";

function SidePeekRenderer() {
  const { isSidepeekOpen } = useSidepeek();
  // FIXME: current hack used to add state to track if the sidepeek has been toggled
  const [hasToggled, setHasToggled] = useToggle(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[900px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        isSidepeekOpen ? "slideinright" : hasToggled && "slideoutright",
      )}
      data-type="sidepeek"
    >
      {isSidepeekOpen && <SidePeek setHasToggled={setHasToggled} />}
    </div>
  );
}

export default SidePeekRenderer;
