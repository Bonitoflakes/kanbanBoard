import { cn } from "@/utils/cn";
import SidePeek from ".";
import { useToggle } from "@/utils/useToggle";
import { useEffect } from "react";
import useCardParams from "@/utils/useCardParams";

const SidepeekHusk = () => {
  const [isOpen, toggleSidepeek] = useToggle();
  const [touched, toggleTouched] = useToggle();

  const selectedCard = useCardParams();

  useEffect(() => {
    if (selectedCard) toggleSidepeek(true);
    else toggleSidepeek(false);
  }, [selectedCard, toggleSidepeek]);

  const closeSidepeek = () => {
    toggleSidepeek(false);
    toggleTouched(true);
  };

  return (
    <div
      id="sidepeek-husk"
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[900px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        {
          slideinright: isOpen,
          slideoutright: !isOpen && touched,
        },
      )}
      aria-hidden={!isOpen}
      data-type="sidepeek"
    >
      {isOpen && <SidePeek closeSidepeek={closeSidepeek} />}
    </div>
  );
};

export default SidepeekHusk;
