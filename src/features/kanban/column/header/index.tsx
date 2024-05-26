import { MdAdd } from "react-icons/md";
import { cn } from "@/utils/cn";
import { DropdownButton } from "./dropdownButton";
import { useToggle } from "@/utils/useToggle";

export type ColumnHeaderProps = {
  id: number;
  title: string;
  count: number;
  colorSpace: string;
  order: number;
  toggleAdding: () => void;
};

export const ColumnHeader = (props: ColumnHeaderProps) => {
  const { title, count, toggleAdding } = props;
  const [isPopoverOpen, togglePopover] = useToggle();
  

  return (
    <div className="flex p-2 sticky top-0 z-50 bg-accent-3">
      {/* The Pill */}
      <div className="flex items-center gap-1 rounded-3xl bg-accent-2 pl-[7px] pr-[9px]">
        <div className="h-2 w-2 rounded-full bg-accent-1" />
        <h3 className="mt-[-2px] text-sm font-medium text-secondary dark:font-bold">
          {title}
        </h3>
      </div>

      {/* The Count */}
      <div className="ml-1 flex place-items-center">
        <p className="cursor-auto rounded-md px-2 py-1 text-sm text-accent-1">
          {count}
        </p>
      </div>

      {/* The Divider */}
      <div className="flex-1"></div>

      {/* The buttons */}
      <div
        className={cn(
          "flex place-items-center",
          import.meta.env.DEV && "customOrderDebugger",
        )}
        data-order={props.order}
      >
        <DropdownButton
          {...props}
          isPopoverOpen={isPopoverOpen}
          togglePopover={togglePopover}
        />

        <button
          className={cn(
            "rounded-md px-2 py-1 text-sm font-extrabold text-accent-1 opacity-0  transition-colors hover:bg-accent-2/35 group-hover/column:opacity-100",
            { "opacity-100": isPopoverOpen },
          )}
          onClick={toggleAdding}
        >
          <MdAdd size={18} />
        </button>
      </div>
    </div>
  );
};
