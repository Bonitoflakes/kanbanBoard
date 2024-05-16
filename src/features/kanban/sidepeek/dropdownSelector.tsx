import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type DropdownSelector = {
  label: string;
  value: string | number;
  children: ReactNode;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
};

export const DropdownSelector = ({
  label,
  value,
  children,
  onChange,
  className,
}: DropdownSelector) => {
  return (
    <div className="group/list flex cursor-pointer flex-col rounded-md bg-gray-500 p-2 hover:bg-gray-600">
      <label
        htmlFor={label}
        className="w-full cursor-pointer text-[12px] leading-4 text-primary"
      >
        {label}
      </label>

      <select
        name={label}
        id={label}
        value={value}
        onChange={onChange}
        className={cn(
          "min-w-14 cursor-pointer appearance-none bg-gray-500 text-sm leading-5 text-primary group-hover/list:bg-gray-600",
          className,
        )}
      >
        {children}
      </select>
    </div>
  );
};
