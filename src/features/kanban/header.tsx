import { toggleTheme } from "@/utils/theme";

const Header = () => {
  return (
    <div className="flex justify-between p-4">
      <h1 className="pl-2 font-sans text-3xl font-bold text-secondary">
        Kanban Board
      </h1>
      <div className="flex gap-4">
        <button
          onClick={() => toggleTheme("dark")}
          className="rounded-md border border-secondary px-4 py-1 font-bold text-secondary"
        >
          Dark
        </button>
        <button
          onClick={() => toggleTheme("light")}
          className="rounded-md border border-secondary px-4 py-1 font-bold text-secondary"
        >
          Light
        </button>
        <button
          onClick={() => toggleTheme("system")}
          className="rounded-md border border-secondary px-4 py-1 font-bold text-secondary"
        >
          System
        </button>
      </div>
    </div>
  );
}

export default Header;
