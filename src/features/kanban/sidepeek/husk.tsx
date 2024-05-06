import { cn } from "@/utils/cn";
import SidePeek from ".";
import { selectSidepeekData } from "@/features/kanban/sidepeek/sidepeekSlice";
import { useAppSelector } from "@/store/store";
import { useToggle } from "@/utils/useToggle";

function SidepeekHusk() {
  const { isOpen } = useAppSelector(selectSidepeekData);
  const [hasToggled, setHasToggled] = useToggle(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[900px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        isOpen ? "slideinright" : hasToggled && "slideoutright",
      )}
      data-type="sidepeek"
    >
      {isOpen && <SidePeek setHasToggled={setHasToggled} />}
    </div>
  );
}

export default SidepeekHusk;
