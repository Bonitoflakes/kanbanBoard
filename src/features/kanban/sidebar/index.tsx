import { cn } from "@/utils/cn";
import { MdCloseFullscreen } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";

type SidebarProps = {
  sidebar: boolean;
  toggleSidebar: (val: boolean) => void;
};

function Sidebar({ sidebar, toggleSidebar }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-[1120px] translate-x-full bg-primary text-secondary shadow-2xl transition-all dark:bg-slate-950",
        sidebar ? "slideinright" : "slideoutright",
      )}
    >
      <div className="flex flex-col p-3">
        <div className="px-1">
          <button
            className="rounded-md p-1.5 hover:bg-gray-100"
            onClick={() => toggleSidebar(false)}
          >
            <VscEyeClosed size={18} className="text-gray-500" />
          </button>

          <button className="rounded-md p-1.5 hover:bg-gray-100">
            <MdCloseFullscreen size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          <h1
            className="text-4xl font-bold leading-tight outline-none"
            contentEditable
            suppressContentEditableWarning
          >
            Title goes here..
          </h1>
          <p
            className="pt-6 text-base leading-none outline-none before:text-neutral-400  empty:before:content-['Type_a_description']"
            contentEditable
            suppressContentEditableWarning
          >
            Description goes here...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
