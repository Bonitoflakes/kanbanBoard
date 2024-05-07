import { cn } from "@/utils/cn";
import SidePeek from ".";
import { useToggle } from "@/utils/useToggle";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useIsFirstRender } from "@/utils/useIsFirstRender";

function SidepeekHusk() {
  const [isOpen, toggleSidepeek] = useToggle(false);
  const isFirst = useIsFirstRender();

  const [searchParams] = useSearchParams();
  const selectedCard = searchParams.get("selectedCard");

  useEffect(() => {
    if (selectedCard) toggleSidepeek(true);
    else toggleSidepeek(false);
  }, [selectedCard, toggleSidepeek]);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[900px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        isOpen ? "slideinright" : !isFirst && "slideoutright",
      )}
      aria-hidden={!isOpen}
      data-type="sidepeek"
    >
      {isOpen && <SidePeek toggleSidepeek={toggleSidepeek} />}
    </div>
  );
}

export default SidepeekHusk;
