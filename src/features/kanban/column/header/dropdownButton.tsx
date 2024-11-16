import { MouseEvent, memo, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { useUpdateColumnMutation } from "../column.api";

import * as DM from "@radix-ui/react-dropdown-menu";
import { DropdownAlert } from "./dropdownAlert";
import { DropdownSelect } from "./dropdownSelect";
import { useToggle } from "@/utils/useToggle";

type DropdownButtonProps = {
  id: number;
  title: string;
  count: number;
  order: number;
  colorSpace: string;
  isPopoverOpen: boolean;
  togglePopover: (value?: boolean | undefined) => void;
  toggleAdding: () => void;
};

const colors = Object.freeze({
  red: "bg-red-400",
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
  green: "bg-green-400",
  brown: "bg-amber-900",
  gray: "bg-gray-400",
});

const MDropdownButton = ({
  id,
  order,
  colorSpace,
  isPopoverOpen,
  togglePopover,
}: DropdownButtonProps) => {
  const [isAlertOpen, setIsAlertOpen] = useToggle();
  const [activeColor, setActiveColor] = useState(colorSpace);

  const [updateColumn] = useUpdateColumnMutation();

  const handleColor = (colorSpace: string) => {
    setActiveColor(colorSpace);
    updateColumn({ id, colorSpace });
  };

  const popoverOnChange = (isOpen: boolean) => togglePopover(isOpen);

  const alertOnChange = (isOpen: boolean) => {
    setIsAlertOpen(isOpen);
  };

  const triggerDelete = (e: MouseEvent) => {
    e.preventDefault();
    togglePopover(true);
    setIsAlertOpen(true);
  };

  return (
    <DM.Root open={isPopoverOpen} onOpenChange={popoverOnChange}>
      <DM.Trigger asChild>
        <button
          className={cn(
            "rounded-md px-2 py-1 text-sm font-extrabold text-accent-1 opacity-0  transition-colors hover:bg-accent-2/35 group-hover/column:opacity-100",
            { "opacity-100": isPopoverOpen },
          )}
        >
          <HiOutlineDotsHorizontal size={18} />
        </button>
      </DM.Trigger>

      <DM.Portal>
        <DM.Content
          loop={true}
          align="start"
          className="z-50 min-w-[220px] rounded-lg border-[0.5px] border-gray-400 bg-primary p-1.5 shadow-2xl dark:border-[0.3px] dark:border-[#3d3d3d] dark:bg-[#262626]"
        >
          <DropdownSelect
            columnID={id}
            columnOrder={order}
            togglePopover={togglePopover}
          >
            <DM.Item
              autoFocus
              className="flex cursor-pointer justify-between rounded-lg p-2 text-sm text-secondary outline-none hover:bg-secondary/15 focus-visible:bg-secondary/15"
            >
              Move Column
              <span className="text-secondary">⌘+T</span>
            </DM.Item>
          </DropdownSelect>

          <DropdownAlert open={isAlertOpen} onChange={alertOnChange} id={id}>
            <DM.Item
              onClick={(e) => triggerDelete(e)}
              className="flex cursor-pointer justify-between rounded-lg p-2 text-sm text-secondary outline-none hover:bg-red-400 focus-visible:bg-red-400"
            >
              Delete Column
              <span className="text-secondary group-hover/item:text-secondary">
                ⌘+D
              </span>
            </DM.Item>
          </DropdownAlert>

          <DM.Separator className="m-1 mx-2 h-px bg-gray-400" />

          <div id="colors">
            <DM.Label className="mx-2 my-2 text-[12px] font-bold text-secondary">
              Change list color
            </DM.Label>

            <DM.RadioGroup
              value={activeColor}
              onValueChange={handleColor}
              className="m-auto flex max-w-[200px] flex-wrap justify-center gap-2"
            >
              {Object.entries(colors).map(([key, value]) => {
                return (
                  <DM.RadioItem
                    key={key}
                    className={cn(
                      "h-8 w-11 rounded-md text-secondary outline-none hover:outline-dashed hover:outline-1 hover:outline-secondary",
                      activeColor === key && "border-2 border-blue-800",
                      value,
                    )}
                    value={key}
                    onSelect={(e) => e.preventDefault()}
                  ></DM.RadioItem>
                );
              })}
            </DM.RadioGroup>

            <DM.Item
              onSelect={(e) => {
                e.preventDefault();
                handleColor("gray");
              }}
              asChild
            >
              <span className="mx-1 mb-1 mt-2 flex rounded-md">
                <button
                  className=" w-full rounded-md p-1.5 text-secondary enabled:hover:bg-zinc-500 enabled:hover:text-primary disabled:cursor-not-allowed disabled:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-950"
                  disabled={activeColor === "gray"}
                >
                  Remove Color
                </button>
              </span>
            </DM.Item>
          </div>
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
};

export const DropdownButton = memo(MDropdownButton);