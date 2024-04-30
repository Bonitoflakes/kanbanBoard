import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdAdd } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useUpdateColumnMutation } from "@/store/api";
import { cn } from "@/utils/cn";
import { Alert } from "./alert";

export type ColumnHeaderProps = {
  title: string;
  toggleAdding: () => void;
  count: number;
  id: number;
  color: string;
};

const colors = {
  red: "bg-red-400",
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
  green: "bg-green-400",
  brown: "bg-amber-900",
  gray: "bg-gray-400",
};

export const ColumnHeader = ({
  title,
  count,
  toggleAdding,
  color,
  id,
}: ColumnHeaderProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [activeColor, setActiveColor] = useState(color);

  const [updateColumn] = useUpdateColumnMutation();

  const handleColor = (color: string) => {
    console.log(color);
    setActiveColor(color);
    updateColumn({ id, colorSpace: color, title });
  };

  const popoverOnChange = (e: boolean) => {
    setIsPopoverOpen(e);
  };

  const alertOnChange = (e: boolean) => {
    setIsAlertOpen(e);
    popoverOnChange(e);
  };

  return (
    <div className="flex">
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
      <div className="flex place-items-center">
        <DropdownMenu.Root open={isPopoverOpen} onOpenChange={popoverOnChange}>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                "rounded-md px-2 py-1 text-sm font-extrabold text-accent-1 opacity-0  transition-colors hover:bg-accent-2/35 group-hover/column:opacity-100",
                { "opacity-100": isPopoverOpen },
              )}
            >
              <HiOutlineDotsHorizontal size={18} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              loop={true}
              align="start"
              className="min-w-[220px] rounded-lg border-[0.5px] border-gray-400 bg-primary p-1.5 shadow-2xl dark:border-[0.3px] dark:border-[#3d3d3d] dark:bg-[#262626]"
            >
              <DropdownMenu.Item
                autoFocus
                className="flex cursor-pointer justify-between rounded-lg p-2 text-sm text-secondary outline-none hover:bg-secondary/15 focus-visible:bg-secondary/15"
              >
                Hide Column
                <div className="text-secondary">⌘+T</div>
              </DropdownMenu.Item>

              <Alert open={isAlertOpen} onChange={alertOnChange} id={id}>
                <DropdownMenu.Item
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAlertOpen(true);
                  }}
                  className="flex cursor-pointer justify-between rounded-lg p-2 text-sm text-secondary outline-none hover:bg-red-400 focus-visible:bg-red-400"
                >
                  Delete Column
                  <div className="text-secondary group-hover/item:text-secondary">
                    ⌘+D
                  </div>
                </DropdownMenu.Item>
              </Alert>

              <DropdownMenu.Separator className="m-1 mx-2 h-px bg-gray-400" />

              <DropdownMenu.Label className="mx-2 my-2 text-[12px] font-bold text-secondary">
                Change list color
              </DropdownMenu.Label>

              <DropdownMenu.RadioGroup
                value={activeColor}
                onValueChange={handleColor}
                asChild
              >
                <div className="m-auto flex max-w-[200px] flex-wrap justify-center gap-2">
                  {Object.entries(colors).map(([key, value]) => {
                    return (
                      <DropdownMenu.RadioItem
                        key={key}
                        className={cn(
                          "h-8 w-11 rounded-md text-secondary outline-none hover:outline-dashed hover:outline-1 hover:outline-secondary",
                          activeColor === key && "border-2 border-blue-800",
                          value,
                        )}
                        value={key}
                        onSelect={(e) => {
                          e.preventDefault();
                        }}
                      ></DropdownMenu.RadioItem>
                    );
                  })}
                </div>
              </DropdownMenu.RadioGroup>

              <DropdownMenu.Item
                onSelect={(e) => {
                  e.preventDefault();
                  handleColor("gray");
                }}
                asChild
                disabled={activeColor === "gray"}
              >
                <span className="mx-1 mb-1 mt-2 flex">
                  <button className=" w-full rounded-md p-1.5 text-secondary disabled:cursor-zoom-out  data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-950">
                    Remove Color
                  </button>
                </span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

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
